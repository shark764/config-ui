'use strict';

angular.module('liveopsConfigPanel')
  .directive('flowVersionName', ['FlowVersion', 'Session', function (FlowVersion, Session) {
    return {
      restrict: 'E',
      scope: {
        flow: '='
      },
      template: '{{name}}',
      link: function ($scope) {
        $scope.fetch = function() {
          if(!$scope.flow.activeVersion){
            return;
          }
          
          FlowVersion.get({
            version: $scope.flow.activeVersion,
            flowId: $scope.flow.id,
            tenantId: Session.tenant.tenantId
          }, function (version) {
            $scope.name = version.name;
          });
        };
        
        $scope.$watch('flow', function() {
          $scope.fetch();
        }, true)
      }
    };
  }]);