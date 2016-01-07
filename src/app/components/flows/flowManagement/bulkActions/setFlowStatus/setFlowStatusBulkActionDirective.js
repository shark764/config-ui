'use strict';

angular.module('liveopsConfigPanel')
  .directive('baSetFlowStatus', ['Flow', 'Session', 'BulkAction', 'statuses',
    function(Flow, Session, BulkAction, statuses) {
      return {
        restrict: 'E',
        scope: {},
        require: '?^bulkActionExecutor',
        templateUrl: 'app/components/flows/flowManagement/bulkActions/setFlowStatus/setFlowStatusBulkAction.html',
        link: function($scope, elem, attr, bulkActionExecutor) {
          $scope.bulkAction = new BulkAction();

          if (bulkActionExecutor) {
            bulkActionExecutor.register($scope.bulkAction);
          }
          
          $scope.$evalAsync(function() {
            $scope.statuses = statuses();
          });
          
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
            $scope.active = '';
          };
        }
      };
    }
  ]);
