'use strict';

angular.module('liveopsConfigPanel')
  .directive('baSetFlowStatus', ['Flow', 'Session',
    function (Flow, Session) {
      return {
        restrict: 'AE',
        scope: {
          bulkAction: '='
        },
        templateUrl: 'app/components/flows/flowManagement/bulkActions/setFlowStatus/setFlowStatusBulkAction.html',
        link: function ($scope) {
          $scope.bulkAction.apply = function(flow) {
            var flowCopy = new Flow();
            flowCopy.id = flow.id;
            flowCopy.tenantId = Session.tenant.tenantId;
            flowCopy.active = $scope.active;
            return flowCopy.save().then(function(flowCopy) {
              angular.copy(flowCopy, flow);
              flow.checked = true;
              return flow;
            });
          };
          
          $scope.bulkAction.reset = function() {
            $scope.bulkAction.checked = false;
            $scope.active = false;
          };
        }
      };
    }
  ]);
