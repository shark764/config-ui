'use strict';

angular.module('liveopsConfigPanel')
  .directive('userGroups', ['TenantUserGroups', 'TenantGroupUsers', 'Group', 'Session', function (TenantUserGroups, TenantGroupUsers, Group, Session) {
    return {
      restrict: 'E',

      scope: {
        user: '='
      },

      templateUrl: 'app/components/management/users/user-groups/userGroups.html',

      link: function ($scope) {
        $scope.add = function (groupId) {
          $scope.groupId = null;

          var tgu = new TenantGroupUsers({
            userId: $scope.user.id,
            groupId: groupId,
            tenantId: Session.tenant.tenantId
          });

          tgu.$save(function () {
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
          });
        };

        $scope.fetch = function () {
          $scope.userGroups = TenantUserGroups.query({ tenantId: Session.tenant.tenantId, userId: $scope.user.id });
        };

        $scope.$watch('user', function () {
          $scope.groupId = null;

          $scope.groups = Group.query({tenantId: Session.tenant.tenantId }, function () {
            $scope.fetch();
          })
        });
        
        $scope.collapsed = true;
        
        //This is just for presentation, to only show the expander thing when there is more than three rows of data
        var tagWrapper = angular.element(document.querySelector('#tag-wrapper'));
        $scope.$watch(function () {return tagWrapper.height();}, function (newValue) {
          if (newValue !== 0){ //TODO: figure out why watch isn't firing on first fetch
            $scope.updateCollapseState(newValue);
          }
        });
        
        $scope.updateCollapseState = function(wrapperHeight){
          var maxCollapsedHeight = 91; //TODO: This should be dynamically determined
          if (wrapperHeight < maxCollapsedHeight){
            $scope.hideCollapseControls = true;
          } else {
            $scope.hideCollapseControls = false;
          }
        }
      }
    };
  }]);
