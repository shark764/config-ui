'use strict';

angular.module('liveopsConfigPanel')
  .controller('QueueQueryCreatorController', ['$scope', 'jsedn', 'Alert', '$translate', 'queueQueryComponents',
    function($scope, jsedn, Alert, $translate, queueQueryComponents) {
      var self = this;
      
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
        self.initComponentState();
      });
      
      $scope.queryComponents = queueQueryComponents;
      
      $scope.add = function(selectedComponent){
        $scope.selectedComponent = null;
        $scope[selectedComponent.name] = selectedComponent;
        selectedComponent.enabled = true;
      };
      
      $scope.remove = function(selectedComponent){
        var keyword = jsedn.kw(selectedComponent.keyword);
        
        function doRemove(){
          $scope[selectedComponent.name] = null;
          selectedComponent.enabled = false;
          if ($scope.rootMap.exists(keyword)){
            selectedComponent.remove($scope.rootMap);
          }
        }
        
        if ($scope.rootMap.exists(keyword) && $scope.rootMap.at(keyword).val.length > 0){
          Alert.confirm($translate.instant('queue.query.builder.remove.filter.confirm'), function(){
            doRemove();
          });
        } else {
          doRemove();
        }
      };
      
      this.initComponentState = function(){
        angular.forEach($scope.queryComponents, function(component){
          var keyword = jsedn.kw(component.keyword);
          if ($scope.rootMap.exists(keyword)){
            $scope.add(component);
          }
        });
      };
    }
  ]);
