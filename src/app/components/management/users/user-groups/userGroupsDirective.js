'use strict';

/*jshint browser:true */

angular.module('liveopsConfigPanel')
  .directive('userGroups', ['TenantUserGroups', 'TenantGroupUsers', 'Group', 'Session', '$timeout', function (TenantUserGroups, TenantGroupUsers, Group, Session, $timeout) {
    return {
      restrict: 'E',

      scope: {
        user: '='
      },

      templateUrl: 'app/components/management/users/user-groups/userGroups.html',

      link: function ($scope) {
        $scope.add = function (selectedGroup) {
          $scope.selectedGroup = null;

          var tgu = new TenantGroupUsers({
            userId: $scope.user.id,
            groupId: selectedGroup.id,
            tenantId: Session.tenant.tenantId
          });

          tgu.$save(function (result) {

            $scope.userGroups.push(new TenantUserGroups({
              tenantId: result.tenantId,
              groupId: result.groupId,
              memberId: result.memberId,
              groupName: selectedGroup.name
            }));
          }, function () {
            $scope.fetch();
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

          $scope.userGroups = TenantUserGroups.query({ tenantId: Session.tenant.tenantId, userId: $scope.user.id });
          $scope.userGroups.$promise.then(function(){
            $timeout(function(){ //Timeout prevents simultaneous $digest cycles
              $scope.updateCollapseState(tagWrapper.height());
            }, 200);
          });
          $scope.groups = Group.query({tenantId: Session.tenant.tenantId });
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
