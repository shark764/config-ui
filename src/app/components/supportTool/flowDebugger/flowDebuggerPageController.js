'use strict';

angular.module('liveopsConfigPanel')
  .controller('DebuggerPageController', ['$scope', '$window', '$state', '$sce', 'Session', 'UserPermissions', 'PermissionGroups', 'apiHostname', 'debuggerHostname',
    function($scope, $window, $state, $sce, Session, UserPermissions, PermissionGroups, apiHostname, debuggerHostname) {
      /* globals window */

      $scope.debuggerHostname = $sce.trustAsResourceUrl(debuggerHostname);

      function ProcessMessage(event) {
        switch(event.data.message) {
          case 'FlowDebugger.ready':
          event.source.focus();
          event.source.postMessage({
            message: 'FlowDebugger.start',
            data: {
              apiToken: Session.token,
              apiHostname: apiHostname
            }
          }, '*');
          break;
        }
      }
      
      window.addEventListener('message', ProcessMessage);

      $scope.$on('$destroy', function() {
        window.removeEventListener('message', ProcessMessage);
      })
      
    } 
]);