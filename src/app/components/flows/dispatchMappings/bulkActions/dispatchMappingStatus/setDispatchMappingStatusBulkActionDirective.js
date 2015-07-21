'use strict';

angular.module('liveopsConfigPanel')
  .directive('baSetDispatchMappingStatus', ['DispatchMapping', 'Session',
    function (DispatchMapping, Session) {
      return {
        restrict: 'AE',
        scope: {
          bulkAction: '='
        },
        templateUrl: 'app/components/flows/dispatchMappings/bulkActions/dispatchMappingStatus/setDispatchMappingStatusBulkAction.html',
        link: function ($scope) {
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
            $scope.active = false;
          };
        }
      };
    }
  ]);
