'use strict';

angular.module('liveopsConfigPanel')
  .controller('UsersController', ['$scope', '$window', 'userRoles', 'User', 'Session', 'AuthService', 'userTableConfig', 'Invite', 'Alert', 'flowSetup', 'BulkAction',
    function($scope, $window, userRoles, User, Session, AuthService, userTableConfig, Invite, Alert, flowSetup, BulkAction) {
      var self = this;
      $scope.Session = Session;

      $window.flowSetup = flowSetup;

      this.newPassword = null;

      User.prototype.preUpdate = function() {
        if (this.password) {
          self.newPassword = this.password;
        }
      };

      User.prototype.postUpdate = function(result) {
        if (this.id === Session.user.id && self.newPassword) {
          var token = AuthService.generateToken(this.email, self.newPassword);
          Session.setUser(this);
          Session.setToken(token);
          self.newPassword = null;
        }

        return result;
      };

      User.prototype.postCreate = function() {
        Invite.save({
          tenantId: Session.tenant.tenantId
        }, {
          email: this.email,
          roleId: '00000000-0000-0000-0000-000000000000'
        }); //TEMPORARY roleId
      };

      User.prototype.postCreateError = function(error) {
        if (error.status === 400) {
          Alert.success('User already exists. Sending ' + this.email + ' an invite for ' + Session.tenant.name);

          Invite.save({
            tenantId: Session.tenant.tenantId
          }, {
            email: this.email,
            roleId: '00000000-0000-0000-0000-000000000000'
          }); //TEMPORARY roleId
        }

        $scope.create();

        return error;
      };

      $scope.fetch = function() {
        $scope.users = User.query({
          tenantId: Session.tenant.tenantId
        });
      };

      $scope.create = function() {
        $scope.selectedUser = new User({
          status: true
        });
      };

      $scope.additional = {
        roles: userRoles,
        updateDisplayName: function($childScope) {
          if (!$childScope.resource.id && $childScope.detailsForm.displayName.$untouched) {
            var first = $childScope.resource.firstName ? $childScope.resource.firstName : '';
            var last = $childScope.resource.lastName ? $childScope.resource.lastName : '';
            $childScope.resource.displayName = first + ' ' + last;
          }
        }
      };

      $scope.$on('on:click:create', function() {
        $scope.create();
      });

      $scope.$watch('Session.tenant.tenantId', function(old, news) {
        if (angular.equals(old, news)) {
          return;
        }

        $scope.fetch();
      }, true);
      
      $scope.$on('on:click:actions', function() {
        $scope.bulkActions = {
          setStatus: new BulkAction(),
          resetPassword: new BulkAction(),
          userSkills: new BulkAction(),
          userGroups: new BulkAction()
        };
      });

      $scope.tableConfig = userTableConfig;
      $scope.fetch();
    }
  ]);
