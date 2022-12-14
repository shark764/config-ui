'use strict';

angular.module('liveopsConfigPanel')
  .directive('baSetTwilioRegion', ['BulkAction', 'Session', 'GlobalRegionsList',
    function(BulkAction, Session, GlobalRegionsList) {
      return {
        restrict: 'E',
        scope: {
          users: '='
        },
        require: '?^bulkActionExecutor',
        templateUrl: 'app/components/management/users/bulkActions/twilioRegion/twilioRegionBulkAction.html',
        link: function($scope, elem, attr, bulkActionExecutor) {
          $scope.bulkAction = new BulkAction();
          $scope.twilioRegions = GlobalRegionsList;
          $scope.selectedRegion = $scope.twilioRegions[0].twilioId;

          if (bulkActionExecutor) {
            bulkActionExecutor.register($scope.bulkAction);
          }

          $scope.bulkAction.apply = function apply(tenantUser) {
            // only save a region if the user has a Twilio extension
            var twilioIndex = _.findIndex(tenantUser.extensions, {'provider': 'twilio'});
            if (twilioIndex !== -1) {
              tenantUser.extensions[twilioIndex].region = $scope.selectedRegion;
              tenantUser.activeExtension = tenantUser.extensions[0];
              return tenantUser.save({
                tenantId: Session.tenant.tenantId
              });
            }
          };
        }
      };
    }
  ]);
