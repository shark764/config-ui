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
        $scope.reset = function() {
          $scope.saving = false;
          $scope.selectedGroup = null;
          $scope.addGroup.name.$setUntouched();

          $scope.newGroupUser = new TenantGroupUsers({
            groupId: null,
            tenantId: Session.tenant.tenantId,
            userId: $scope.user.id
          });
        };
        
        $scope.save = function () {
          $scope.saving = true;

          if(!$scope.selectedGroup.id){
            $scope.createGroup($scope.selectedGroup.name, $scope.saveUserGroup, function(){$scope.saving = false;});
          } else {
            $scope.saveUserGroup();
          }
        };
        
        $scope.createGroup = function(groupName, onComplete, onError){
          new Group({
            name: groupName,
            tenantId: Session.tenant.tenantId,
            description: '',
            status: true,
            owner: Session.user.id
          }).save(function(result){
            $scope.selectedGroup = result;
            $scope.groups.push(result);
            if (typeof onComplete !== 'undefined' && onComplete !== null){
              onComplete();
            }
          }, function(){
            if (typeof onError !== 'undefined' && onError !== null){
              onError();
            }
          });
        };
        
        $scope.saveUserGroup = function () {
          $scope.newGroupUser.groupId = $scope.selectedGroup.id;
          
          $scope.newGroupUser.$save(function(){
            var newUserGroup = angular.copy($scope.newGroupUser);
            newUserGroup.groupName = $scope.selectedGroup.name;
            $scope.userGroups.push(newUserGroup);
            $scope.reset();
          }, function () {
            toastr.error('Failed to save user group');
            $scope.saving = false;
          });
        };

        $scope.remove = function (userGroup) {
          var tgu = new TenantGroupUsers({
            memberId: $scope.user.id,
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
          
          $scope.userGroups = TenantUserGroups.query({ tenantId: Session.tenant.tenantId, memberId: $scope.user.id }, $scope.reset);
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
          $scope.reset();
          $scope.fetch();
        });

        //This is just for presentation, to only show the expander thing when there is more than three rows of data
        $scope.collapsed = true;
        
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
