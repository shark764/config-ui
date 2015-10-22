'use strict';

angular.module('liveopsConfigPanel')
  .controller('QueueQueryCreatorController', ['$scope', 'jsedn', 'Alert', '$translate',
    function($scope, jsedn, Alert, $translate) {
      var self = this;
      
      $scope.$watch('rootMap', function(newMap) {
        if(!newMap || !$scope.version) {
          return;
        }
        
        $scope.version.query = jsedn.encode(newMap);
      }, true);
      
      $scope.$watch('version.query', function(newQuery, oldQuery) {
        if(!newQuery) {
          return;
        }
        
        $scope.rootMap = jsedn.parse(newQuery);
        if (!oldQuery){
          //Only change component visibility on initial load
          self.initComponentState();
        }
      });
      
      $scope.queryComponents = [{
        display: $translate.instant('queues.query.builder.skills'),
        enabled: false,
        name: 'skillcomponent',
        keyword: ':skills',
        remove: function(rootMap){
          var keyword = jsedn.kw(':skills');
          rootMap.remove(keyword);
        }
      }, {
        display: $translate.instant('queues.query.builder.groups'),
        enabled: false,
        name: 'groupcomponent',
        keyword: ':groups',
        remove: function(rootMap){
          var keyword = jsedn.kw(':groups');
          rootMap.remove(keyword);
        }
      }];
      
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
