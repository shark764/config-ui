'use strict';

angular.module('liveopsConfigPanel')
  .controller('VersionsController', ['$scope', '$routeParams', '$filter', 'Session', 'Tenant', 'Flow', 'Version', 'User',
    function ($scope, $routeParams, $filter, Session, Tenant, Flow, Version, User) {

      $scope.version = new Version({});

      $scope.$on('$routeUpdate', function () {
        $scope.setVersion($routeParams.id);
        console.log($scope.version);
      });

      $scope.versions = Version.query( { tenantId: Session.tenantId, flowId: $routeParams.flowId }, function(data) {
        console.log("hello");
        console.log(data);
      } );

      $scope.setVersion = function (id) {
        var activeFlow = $filter('filter')($scope.versions, {id : id})[0];
        $scope.version = id ? activeFlow : {  } ;
      };

      $scope.fetch = function (regionId) {
        $scope.versions = Version.query( { tenantId: Session.tenantId, flowId: $routeParams.flowId });
      };

      $scope.saveSuccess = function (response) {
        $scope.version = {};
      };

      $scope.saveFailure = function (reason) {
        $scope.error = reason.data;
      };

      $scope.save = function () {
        $scope.version.save({id : $scope.version.id, tenantId : Session.tenantId, flowId : $routeParams.flowId}, $scope.saveSuccess, $scope.saveFailure);
      };

    }]);
