'use strict';

angular.module('liveopsConfigPanel')
  .directive('tenantDetails', ['Tenant', 'User', 'Region', 'Session',
    function (Tenant, User, Region, Session) {
      return {
        scope: {
          tenant: '='
        },
        templateUrl: 'app/components/tenants/tenantDetails.html',

        link: function ($scope) {
          $scope.users = User.query();
          
          $scope.regions = Region.query(function (){});
          
          $scope.save = function () {
            $scope.tenant.save({id : $scope.tenant.id, regionId: Session.activeRegionId}, null, function(error) {
              $scope.error = error.data;
            });
          };
          
          $scope.cancel = function () {
            $scope.$emit('tenant:cancel');
          };
        }
      };
    }
  ]);
