'use strict';

angular.module('liveopsConfigPanel')
  .controller('DesignerPageController', ['$scope', '$window', '$state', '$sce', 'Session', 'UserPermissions', 'apiHostname', 'designerHostname',
    function($scope, $window, $state, $sce, Session, UserPermissions, apiHostname, designerHostname) {
    
      $scope.designerHostname = $sce.trustAsResourceUrl(designerHostname);

      function ProcessMessage(event){
        switch(event.data.message){
          case 'FlowDesigner.ready':
            console.log('Flow Designer is ready');
            event.source.postMessage({
              message: 'FlowDesigner.start',
              data: {
                apiToken: Session.token,
                apiHostName: apiHostname,
                apiVersion: 'v1',
                tenantId: Session.tenant.tenantId,
                flowId: $state.params.flowId,
                draftId: $state.params.draftId
              }
            }, '*')
            break;
          case 'FlowDesigner.versionPublished':
            $state.go('content.flows.flowManagement', {}, {reload: true});
            break;
        }
      }
    
      window.addEventListener('message', ProcessMessage);

      $scope.$on('$destroy', function(){
        window.removeEventListener('message', ProcessMessage)
      })
    }
  ]);
