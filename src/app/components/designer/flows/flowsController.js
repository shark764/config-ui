'use strict';

angular.module('liveopsConfigPanel')
  .controller('FlowsController', ['$scope', '$state', 'Session', 'Flow', 'flowTableConfig', 'flowTypes', 'FlowVersion',
    function ($scope, $state, Session, Flow, flowTableConfig, flowTypes, FlowVersion) {

      $scope.redirectToInvites();
      $scope.versions = [];

      $scope.fetch = function () {
        $scope.versions = [];

        $scope.flows = Flow.query({
          tenantId: Session.tenant.tenantId
        }, function(){
          angular.forEach($scope.flows, function(value){
            if (value.activeVersion){
              $scope.updateVersionName(value);
            }
          });
        });
      };

      $scope.updateVersionName = function(flow){
        FlowVersion.get({version : flow.activeVersion, flowId : flow.id, tenantId: Session.tenant.tenantId}, function(data){
          flow.activeVersionName = data.name;
        });
      };
      
      $scope.$on('on:click:create', function() {
        $scope.selectedFlow = new Flow({
          tenantId: Session.tenant.tenantId
        });
      });

      $scope.$watch('Session.tenant', function () {
        $scope.fetch();
      });

      $scope.additional = {
          versions: $scope.versions,
          flowTypes: flowTypes,
          postSave: function(childScope, result){
            $scope.updateVersionName(childScope.originalResource);
            
            if (! childScope.originalResource.id){
              var initialVersion = new FlowVersion({
                flowId: result.id,
                flow: '[]',
                tenantId: Session.tenant.tenantId,
                name: 'v1'
              });
              
              initialVersion.save(function(versionResult){
                childScope.resource.activeVersion = versionResult.version; //Update the display
                result.activeVersion = versionResult.version;
                result.save();
              });
              $scope.versions.push(initialVersion);
            }
          }
        };

      $scope.fetch();
      $scope.tableConfig = flowTableConfig;
    }
  ]);
