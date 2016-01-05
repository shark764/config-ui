'use strict';

angular.module('liveopsConfigPanel')
  .directive('baSetDispatchMappingStatus', ['DispatchMapping', 'Session', 'BulkAction', 'statuses',
    function(DispatchMapping, Session, BulkAction, statuses) {
      return {
        restrict: 'E',
        scope: {},
        require: '?^bulkActionExecutor',
        templateUrl: 'app/components/flows/dispatchMappings/bulkActions/dispatchMappingStatus/setDispatchMappingStatusBulkAction.html',
        link: function($scope, elem, attr, bulkActionExecutor) {
          $scope.bulkAction = new BulkAction();

          if (bulkActionExecutor) {
            bulkActionExecutor.register($scope.bulkAction);
          }
          
          $scope.$evalAsync(function() {
            $scope.statuses = statuses();
          });

          $scope.bulkAction.apply = function(mapping) {
            var mappingCopy = new DispatchMapping();
            mappingCopy.id = mapping.id;
            mappingCopy.tenantId = Session.tenant.tenantId;
            mappingCopy.active = $scope.active;
            mappingCopy.properties = mapping.properties;
            return mappingCopy.save().then(function(mappingCopy) {
              angular.copy(mappingCopy, mapping);
              mapping.checked = true;
              return mapping;
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
