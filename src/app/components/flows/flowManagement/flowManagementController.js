'use strict';

angular.module('liveopsConfigPanel')
  .controller('FlowManagementController', ['$scope', '$state', 'Session', 'Flow', 'flowTableConfig', 'flowTypes', 'FlowVersion',
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
          tenantId: Session.tenant.tenantId,
          active: true
        });
      });

      $scope.$watch('Session.tenant.tenantId', $scope.fetch, true);

      $scope.additional = {
          versions: $scope.versions,
          flowTypes: flowTypes,
          postSave: function(childScope, result, creatingNew){
            if (creatingNew){
              var initialVersion = new FlowVersion({
                flowId: result.id,
                flow: '[]',
                tenantId: Session.tenant.tenantId,
                name: 'v1'
              });

              initialVersion.save(function(versionResult){
                //Update the displays
                childScope.originalResource.activeVersion = versionResult.version;
                childScope.resource.activeVersion = versionResult.version;

                result.activeVersion = versionResult.version;
                result.save(function(){
                  $scope.updateVersionName(childScope.originalResource);
                });
              });
              $scope.versions.push(initialVersion);
            } else {
              $scope.updateVersionName(childScope.originalResource);
            }
          }
        };

      $scope.fetch();
      $scope.tableConfig = flowTableConfig;
    }
  ]);
