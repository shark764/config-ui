'use strict';

angular.module('liveopsConfigPanel')
  .directive('tenantDetails', ['Tenant', 'User', 'Region', '$routeParams',
    function (Tenant, User, Region, $routeParams) {
      return {
        scope: {
          tenant: '='
        },
        templateUrl: 'app/components/tenants/tenantDetails.html',

        link: function ($scope) {
          $scope.users = User.query();
          
          $scope.regions = Region.query(function (){});
          
          $scope.save = function () {
            $scope.tenant.save({id : $scope.tenant.id}, null, function(error) {
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
