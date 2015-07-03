'use strict';

angular.module('liveopsConfigPanel')
  .controller('UsersController', ['$scope', '$window', 'userRoles', 'User', 'Session', 'AuthService', 'userTableConfig', 'Invite', 'toastr', 'flowSetup',
    function($scope, $window, userRoles, User, Session, AuthService, userTableConfig, Invite, toastr, flowSetup) {
      var self = this;
      $scope.Session = Session;

      $window.flowSetup = flowSetup;

      this.newPassword = null;

      User.prototype.preUpdate = function() {
        if (this.password) {
          self.newPassword = this.password;
        }
      };

      User.prototype.postUpdate = function(user) {
        if (user.id === Session.user.id && self.newPassword) {
          var token = AuthService.generateToken(user.email, self.newPassword);
          Session.setUser(user);
          Session.setToken(token);
          self.newPassword = null;
        }
      };

      User.prototype.postCreate = function(user) {
        Invite.save({
          tenantId: Session.tenant.tenantId
        }, {
          email: user.email,
          roleId: '00000000-0000-0000-0000-000000000000'
        }); //TEMPORARY roleId
      };

      User.prototype.postCreateError = function(error) {
        if (error.status === 400) {
          toastr.clear();
          toastr.success('User already exists. Sending ' + $scope.user.email + ' an invite for ' + Session.tenant.name, '', {
            timeout: 5000
          });
 
          Invite.save({
            tenantId: Session.tenant.tenantId
          }, {
            email: $scope.user.email,
            roleId: '00000000-0000-0000-0000-000000000000'
          }); //TEMPORARY roleId
          $scope.$broadcast('resource:details:user:cancel');
        }
        return error;
      };

      $scope.fetch = function() {
        $scope.users = User.query({
          tenantId: Session.tenant.tenantId !== '' ? Session.tenant.tenantId : null
        });
      };

      $scope.create = function() {
        $scope.selectedUser = new User({
          status: true
        });
      }

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

      $scope.tableConfig = userTableConfig;
      $scope.fetch();
    }
  ]);
