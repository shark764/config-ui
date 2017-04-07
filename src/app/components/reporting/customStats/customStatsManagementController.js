'use strict';

angular.module('liveopsConfigPanel')
  .controller('customStatsManagementController', ['$scope', '$state', '$document', '$compile', 'Session', 'CustomStat', 'customStatsManagementTableConfig', 'CustomStatDraft', 'CustomStatVersion', 'loEvents', '$q','Alert',
    function ($scope, $state, $document, $compile, Session, CustomStat, customStatsManagementTableConfig, CustomStatDraft, CustomStatVersion, loEvents, $q, Alert) {

      $scope.getVersions = function(){

        if (! $scope.selectedStat || $scope.selectedStat.isNew()){
          return [];
        }

        var versions = CustomStatVersion.cachedQuery({
          tenantId: Session.tenant.tenantId,
          customStatId: $scope.selectedStat.id
        }, 'CustomStatVersion' + $scope.selectedStat.id);

        angular.forEach(versions, function(version, index){
          version.fakeVersion = 'v' + (versions.length - index);
        });

        return versions;
      };

      $scope.fetchStats = function () {

        var stats = CustomStat.cachedQuery({
          tenantId: Session.tenant.tenantId
        });

        _.remove(stats, function (stat) {
          return stat.tenantId !== Session.tenant.tenantId;
        });

        return stats;
      };

      $scope.newDraftModal = function(version){
        var newScope = $scope.$new();

        newScope.modalBody = 'app/components/reporting/customStats/newDraft.modal.html';
        newScope.title = 'New Draft';
        newScope.draft = {
          name: version.name + ' - draft'
        };

        newScope.cancelCallback = function() {
          $document.find('modal').remove();
        };

        newScope.okCallback = function(draft) {
          var newStat = new CustomStatDraft({
            customStatId: version.customStatId,
            customStat: version.customStat,
            tenantId: Session.tenant.tenantId,
            name: draft.name,
            metadata: version.metadata
          });

          return newStat.save().then(function(draft){
            $document.find('modal').remove();
            $state.go('content.reporting.custom-stats-editor', {
              customStatId: draft.customStatId,
              draftId: draft.id
            });
          }).catch(function(err){
            Alert.error(err.data.error.attribute.name.capitalize());
          });
        };

        var element = $compile('<modal></modal>')(newScope);
        $document.find('html > body').append(element);
      };

      $scope.create = function() {
        var newScope = $scope.$new();

        newScope.modalBody = 'app/components/reporting/customStats/newStat.modal.html';
        newScope.title = 'New Custom Stat';
        newScope.customStat = {
          name: 'Untitled Stat'
        };

        newScope.cancelCallback = function() {
          $document.find('modal').remove();
        };

        newScope.okCallback = function(newStat) {
          var newStatCopy = new CustomStat({
            tenantId: Session.tenant.tenantId,
            active: true,
            name: newStat.name,
            type: newStat.type
          });

          return newStatCopy.save(function(stat){
            $document.find('modal').remove();
            var initialDraft = new CustomStatDraft({
              customStatId: stat.id,
              customStat: '{}',
              tenantId: Session.tenant.tenantId,
              name: 'Initial Draft'
            });

            var promise = initialDraft.save();
            return promise.then(function(draft){
              $state.go('content.reporting.custom-stats-editor', {
                customStatId: stat.id,
                draftId: draft.id
              });
            });
          });
        };

        var element = $compile('<modal></modal>')(newScope);
        $document.find('html > body').append(element);

      };

      $scope.saveStat = function(){
        return $scope.selectedStat.save().then(function(stat){
          return stat;
        });
      };

      $scope.updateActive = function(){
        var statCopy = new CustomStat({
          id: $scope.selectedStat.id,
          tenantId: $scope.selectedStat.tenantId,
          active: !$scope.selectedStat.active
        });

        return statCopy.save().then(function(result){
          $scope.selectedStat.$original.active = result.active;
        }, function(errorResponse){
          return $q.reject(errorResponse.data.error.attribute.active);
        });
      };

      $scope.$on(loEvents.tableControls.itemCreate, function () {
        $scope.create();
      });

      $scope.$watch('selectedStat', function(newValue){
        if (newValue){
          $scope.getVersions();
          $scope.selectedStat.reset(); //TODO: figure out why this is needed
        }
      });

      $scope.tableConfig = customStatsManagementTableConfig;

      $scope.submit = function(){
        return $scope.selectedStat.save();
      };
    }
  ]);
