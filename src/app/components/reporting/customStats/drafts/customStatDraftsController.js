'use strict';

angular.module('liveopsConfigPanel')
  .controller('CustomStatDraftsController', ['$scope', 'Session', 'CustomStatDraft', 'Alert', function($scope, Session, CustomStatDraft, Alert) {
    $scope.fetch = function() {
      if (!$scope.customStat || $scope.customStat.isNew()) {
        return [];
      }

      $scope.drafts = CustomStatDraft.query({
        tenantId: Session.tenant.tenantId,
        customStatId: $scope.customStat.id
      });
    };

    $scope.saveDraft = function() {
      return $scope.draft.save(function() {
        $scope.createDraft();
        $scope.createDraftForm.$setPristine();
        $scope.createDraftForm.$setUntouched();
        $scope.createNewDraft = false;
      });
    };

    $scope.createDraft = function() {
      $scope.draft = new CustomStatDraft({
        customStatId: $scope.customStat.id,
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

    $scope.$watch('customStat', function() {
      if (!$scope.customStat) {
        return;
      }

      $scope.fetch();
      $scope.createDraft();

      if ($scope.cleanHandler) {
        $scope.cleanHandler();
      }

      $scope.cleanHandler = $scope.$on(
        'created:resource:tenants:' + Session.tenant.tenantId + ':customStats:' + $scope.customStat.id + ':drafts',
        $scope.pushNewItem);
    });

  }]);
