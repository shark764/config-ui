'use strict';

/*global jsedn: false */

angular.module('liveopsConfigPanel')
  .controller('QueueQueryCreatorController', ['$scope',
    function($scope) {
      $scope.$watch('rootMap', function(newMap) {
        if(!newMap || !$scope.version) {
          return;
        }
        
        $scope.version.query = jsedn.encode(newMap);
      }, true);
      
      $scope.$watch('version.query', function(newQuery) {
        if(!newQuery) {
          return;
        }
        
        $scope.rootMap = jsedn.parse(newQuery);
      });
      
      $scope.queryComponents = {
        'skillcomponent': {
          display:'Skills',
          key: 'skillcomponent'
        }, 
        'groupcomponent': {
          display:'Groups',
          key: 'groupcomponent'
        }
      };
      
      $scope.add = function(selectedComponent){
        $scope.selectedComponent = null;
        $scope[selectedComponent.key] = true;
        delete $scope.queryComponents[selectedComponent.key];
      };
    }
  ]);
