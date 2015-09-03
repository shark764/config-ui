'use strict';

angular.module('liveopsConfigPanel')
.controller('QueueQueryCreatorController', ['$scope', 'Session', 'QueueVersion', function($scope, Session, QueueVersion){
  var queryBuilder = [{}];
  $scope.querytypes = [{'label': 'Skills', 'value': 'skills'}, {'label': 'Groups', 'value': 'groups'}];


  $scope.fetch = function() {

  };

  $scope.queryTypes = function(){
    return $scope.querytypes;
  };

}]);