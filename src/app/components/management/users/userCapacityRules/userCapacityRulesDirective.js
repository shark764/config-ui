'use strict';

angular.module('liveopsConfigPanel')
.directive('userCapacityRules', ['TenantUserCapacityRules', 'CapacityRule', 'TenantUser', 'Session', '$timeout', '$translate', 'Alert',
  function (TenantUserCapacityRules, CapacityRule, TenantUser, Session, $timeout, $translate, Alert) {
    return {
      restrict: 'E',
      scope: {
        user: '='
      },
      templateUrl: 'app/components/management/users/userCapacityRules/userCapacityRules.html',
      link: function ($scope) {

        $scope.fetchCapacityRules = function(){
          return CapacityRule.cachedQuery({
            tenantId: Session.tenant.tenantId
          }, 'CapacityRule' + Session.tenant.tenantId);
        };

        var initialId;

        function reset(){
          TenantUser.cachedGet({
            tenantId: Session.tenant.tenantId,
            id: $scope.user.id
          }, 'User' +  $scope.user.id, true)
          .$promise.then(function(user){
            $timeout(function(){
              if(user.$capacityRules[0]){
                $scope.currentCapacityRule.id = user.$capacityRules[0].id;
                initialId = user.$capacityRules[0].id;
              }
              $scope.ready = true;
            });
          });

          $scope.ready = false;
          $scope.disabled = false;
          $scope.currentCapacityRule = {
            id: undefined
          };
        }

        $scope.removeRule = function(){
          new TenantUserCapacityRules({
            tenantId: Session.tenant.tenantId,
            userId: $scope.user.id,
            id: $scope.currentCapacityRule.id
          }).$delete().then(function(){
            $timeout(function(){
              $scope.currentCapacityRule.id = undefined;
              Alert.success($translate.instant('capacityRule.removal.success'));
            });
          });
        };

        $scope.$watch('user', reset);
        $scope.$watch('currentCapacityRule.id', function(newVal, oldVal){

          if(newVal === oldVal || newVal === undefined || (oldVal === undefined && newVal === initialId)){
            return;
          }

          $scope.disabled = true;

          if(!oldVal){
            new TenantUserCapacityRules({
              tenantId: Session.tenant.tenantId,
              userId: $scope.user.id,
              capacityRuleId: newVal
            }).save().then(function(){
              $timeout(function(){
                $scope.disabled = false;
                Alert.success($translate.instant('capacityRule.set.success'));
              });
            });
          }
          else{
            new TenantUserCapacityRules({
              tenantId: Session.tenant.tenantId,
              userId: $scope.user.id,
              id: oldVal
            }).$remove().finally(function(){
              new TenantUserCapacityRules({
                tenantId: Session.tenant.tenantId,
                userId: $scope.user.id,
                capacityRuleId: newVal
              }).save().then(function(){
                $timeout(function(){
                  $scope.disabled = false;
                  Alert.success($translate.instant('capacityRule.set.success'));
                });
              });
            });
          }
        }, true);
      }
    };
  }]
);
