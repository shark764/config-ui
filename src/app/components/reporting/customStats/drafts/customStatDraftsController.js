'use strict';

angular.module('liveopsConfigPanel')
  .controller('CustomStatDraftsController', ['$scope', '$state', 'Session', 'CustomStatDraft', 'Alert', function($scope, $state, Session, CustomStatDraft, Alert) {
    $scope.fetch = function() {
      if (!$scope.stat || $scope.stat.isNew()) {
        return [];
      }

      $scope.drafts = CustomStatDraft.query({
        tenantId: Session.tenant.tenantId,
        customStatId: $scope.stat.id
      });
    };

    $scope.saveDraft = function() {
      return $scope.draft.save().then(function() {
        $scope.fetch();
        $scope.createDraft();
        $scope.createDraftForm.$setPristine();
        $scope.createDraftForm.$setUntouched();
        $scope.createNewDraft = false;
      });
    };

    $scope.createDraft = function() {
      $scope.draft = new CustomStatDraft({
        customStatId: $scope.stat.id,
        customStat: '[]',
        tenantId: Session.tenant.tenantId
      });
    };

    $scope.deleteDraft = function(draft) {
      Alert.confirm('Deleting this draft cannot be undone. Continue?', function() {
        $scope.drafts.removeItem(draft);
        draft.$delete();
      });
    };

    $scope.pushNewItem = function(event, item) {
      $scope.drafts.unshift(item);
      $scope.selectedDraft = item;
    };

    $scope.viewDraft = function(draft) {
      $state.go('content.reporting.custom-stats-editor', {
        customStatId: draft.customStatId,
        draftId: draft.id
      });
    };

    $scope.$watch('stat', function() {
      if (!$scope.stat) {
        return;
      }

      $scope.fetch();
      $scope.createDraft();

      if ($scope.cleanHandler) {
        $scope.cleanHandler();
      }

      $scope.cleanHandler = $scope.$on(
        'created:resource:tenants:' + Session.tenant.tenantId + ':customStat:' + $scope.stat.id + ':drafts',
        $scope.pushNewItem);
    });

  }]);
