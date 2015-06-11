'use strict';

angular.module('liveopsConfigPanel')
  .controller('VersionsController', ['$scope', 'Session', 'Version',
    function ($scope, Session, Version) {

      $scope.version = new Version({
        flowId : $scope.flow.id,
        flow: '[]'
      });

      $scope.fetch = function () {
        $scope.versions = Version.query( { tenantId: Session.tenant.id, flowId: $scope.flow.id });
      };

      $scope.saveVersion = function () {
        $scope.version.save({tenantId : Session.tenant.id, flowId : $scope.flow.id});
      };
      
      $scope.$on('created:resource:tenants:' + Session.tenant.id + ':flows:' + $scope.flow.id + ':versions', function (event, item) {
        $scope.versions.push(item);
        $scope.selectedVersion = item;
      });
      
      $scope.$watch('flow', function(){
        $scope.fetch();
      });
      
      $scope.fetch();
  }])
  .directive('flowVersions', [function() {
    return {
      scope : {
        flow : '='
      },
      templateUrl : 'app/components/flows/versions/versions.html',
      controller : 'VersionsController'
    };
   }])
;
