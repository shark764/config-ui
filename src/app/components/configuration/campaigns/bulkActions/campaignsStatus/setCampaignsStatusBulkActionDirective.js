'use strict';

angular.module('liveopsConfigPanel')
  .directive('baSetCampaignsStatus', ['Campaign', 'Session', 'BulkAction', 'statuses',
    function(Campaign, Session, BulkAction, statuses) {
      return {
        restrict: 'E',
        scope: {
          flows: '='
        },
        require: '?^bulkActionExecutor',
        templateUrl: 'app/components/configuration/campaigns/bulkActions/campaignsStatus/setCampaignsStatusBulkAction.html',
        link: function($scope, elem, attr, bulkActionExecutor) {
          $scope.bulkAction = new BulkAction();
          $scope.statuses = statuses();

          if (bulkActionExecutor) {
            bulkActionExecutor.register($scope.bulkAction);
          }

          $scope.bulkAction.apply = function(campaigns) {
            var campaignsCopy = new Campaign();

            campaignsCopy.id = campaigns.id;
            campaignsCopy.tenantId = Session.tenant.tenantId;
            campaignsCopy.active = $scope.active;
            campaignsCopy.properties = campaigns.properties;
            return campaignsCopy.save().then(function(campaignsCopy) {
              angular.copy(campaignsCopy, campaigns);

              var flowName = _.find($scope.flows, function(val){
                  if(campaignsCopy.flowId){
                    return campaignsCopy.flowId === val.id;
                  }
              });

              if(angular.isDefined(flowName)){
                campaigns.flowName = flowName.name;
              }
                campaigns.checked = true;

                return campaigns;
            });
          };

          $scope.bulkAction.reset = function() {
            $scope.bulkAction.checked = false;
            $scope.active = false;
          };

          $scope.bulkAction.reset();
        }
      };
    }
  ]);
