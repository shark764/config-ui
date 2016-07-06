'use strict';

angular.module('liveopsConfigPanel')
  .controller('CampaignVersionsController', ['$scope', 'Session', 'CampaignVersion',
    function($scope, Session, CampaignVersion) {

      var cvc = this;

      var version1 = new CampaignVersion({
          id: "0d0ff512-9080-4be1-8bf9-0a978cdc3431",
          version: 1,
          name:"Sports",
          description: "Version 1",
          createdOn: "May 26, 2016",
          createdBy: "Clint Cameron"
      })

      var version2 = new CampaignVersion({
        id: "0d0ff512-9080-4be1-8bf9-0a978cdc3431",
        version: 2,
        name:"Politics",
        description: "Version 2",
        createdOn: "May 26, 2016",
        createdBy: "Clint Eastwood"
      })

       cvc.versions = [version1, version2];

       console.log(cvc.versions);


      // $scope.getVersions = function() {
      //   if (!$scope.flow || $scope.flow.isNew()) {
      //     return [];
      //   }
      //
      //   return FlowVersion.cachedQuery({
      //     tenantId: Session.tenant.tenantId,
      //     flowId: $scope.flow.id
      //   }, 'FlowVersion' + $scope.flow.id);
      // };

      $scope.saveVersion = function() {
        return $scope.version.save(function() {
          $scope.createVersion();
          $scope.createVersionForm.$setPristine();
          $scope.createVersionForm.$setUntouched();
          $scope.createNewVersion = false;
        });
      };

      $scope.createVersion = function() {
        $scope.version = new CampaignVersion({
          flowId: $scope.flow.id,
          versions: '[]',
          tenantId: Session.tenant.tenantId
        });
      };

      $scope.pushNewItem = function(event, item) {
        $scope.getVersions().unshift(item);
        $scope.selectedVersion = item;
      };

      $scope.$watch('flow', function() {
        if (!$scope.flow) {
          return;
        }

        $scope.createVersion();

        if ($scope.cleanHandler) {
          $scope.cleanHandler();
        }

        $scope.cleanHandler = $scope.$on(
          'created:resource:tenants:' + Session.tenant.tenantId + ':campaigns:' + $scope.campaign.id + ':versions',
          $scope.pushNewItem);
      });
    }
  ]);
