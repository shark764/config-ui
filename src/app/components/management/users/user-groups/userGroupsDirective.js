'use strict';

/*jshint browser:true */

angular.module('liveopsConfigPanel')
  .directive('userGroups', ['TenantUserGroups', 'TenantGroupUsers', 'Group', 'Session', '$timeout', '$filter', 'toastr', function (TenantUserGroups, TenantGroupUsers, Group, Session, $timeout, $filter, toastr) {
    return {
      restrict: 'E',

      scope: {
        user: '='
      },

      templateUrl: 'app/components/management/users/user-groups/userGroups.html',

      link: function ($scope) {
        $scope.new = function() {
          $scope.selectedGroup = null;
          $scope.addGroup.name.$touched = false;

          $scope.newGroupUser = new TenantGroupUsers({
            groupId: null,
            tenantId: Session.tenant.tenantId,
            userId: $scope.user.id
          });
        };
        
        $scope.save = function () {
          $scope.saving = true;

          if(!$scope.selectedGroup.id){
            new Group({
              name: $scope.selectedGroup.name,
              tenantId: Session.tenant.tenantId,
              description: '',
              status: true,
              owner: Session.user.id
            }).save(function(result){
              $scope.selectedGroup = result;
              $scope.saveUserGroup();
            });
          } else {
            $scope.saveUserGroup();
          }
        };
        
        $scope.saveUserGroup = function () {
          $scope.newGroupUser.groupId = $scope.selectedGroup.id;
          var usc = angular.copy($scope.newGroupUser);
          usc.groupName = $scope.selectedGroup.name;
          usc.memberId = usc.userId;
          $scope.userGroups.push(usc);
          
          $scope.newGroupUser.memberId = 
          $scope.newGroupUser.$save(function(){
            $scope.new();
            $scope.saving = false;
          }, function () {
            $scope.fetch();
            toastr.error('Failed to save user group');
            $scope.saving = false;
          });
          
          
        };

        $scope.remove = function (userGroup) {
          $scope.groupId = null;

          var tgu = new TenantGroupUsers({
            memberId: userGroup.memberId,
            groupId: userGroup.groupId,
            tenantId: userGroup.tenantId
          });

          tgu.$delete(function(){
            $scope.userGroups.removeItem(userGroup);
            $timeout(function(){ //Timeout prevents simultaneous $digest cycles
              $scope.updateCollapseState(tagWrapper.height());
            }, 200);
          });
        };

        $scope.fetch = function () {
          if(!Session.tenant.tenantId){
            return;
          }
          $scope.saving = false;
          $scope.userGroups = TenantUserGroups.query({ tenantId: Session.tenant.tenantId, memberId: $scope.user.id }, $scope.new);
          $scope.userGroups.$promise.then(function(){
            $timeout(function(){ //Timeout prevents simultaneous $digest cycles
              $scope.updateCollapseState(tagWrapper.height());
            }, 200);
          });
          $scope.groups = Group.query({tenantId: Session.tenant.tenantId }, function(){
            $scope.filtered = $filter('objectNegation')($scope.groups, 'id', $scope.userGroups, 'groupId');
          });
        };

        $scope.$watchGroup(['Session.tenant.tenantId', 'user'], function(){
          $scope.groupId = null;
          $scope.fetch();
        });

        $scope.collapsed = true;

        //This is just for presentation, to only show the expander thing when there is more than three rows of data
        var tagWrapper = angular.element(document.querySelector('#tags-inside'));
        $scope.$on('resizehandle:resize', function(){
          $scope.updateCollapseState(tagWrapper.height());
        });

        $scope.updateCollapseState = function(wrapperHeight){
          var maxCollapsedHeight = 94; //TODO: This should be dynamically determined
          if (wrapperHeight < maxCollapsedHeight && wrapperHeight > 0){
            $scope.$apply(function(){
              $scope.hideCollapseControls = true;
            });
          } else {
            $scope.$apply(function(){
              $scope.hideCollapseControls = false;
            });
          }
        };
      }
    };
  }]);
