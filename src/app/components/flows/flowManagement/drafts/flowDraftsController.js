'use strict';

angular.module('liveopsConfigPanel')
  .controller('FlowDraftsController', ['$scope', 'Session', 'FlowDraft', 'Alert', function ($scope, Session, FlowDraft, Alert) {
      $scope.fetch = function () {
        $scope.drafts = FlowDraft.query({
          tenantId: Session.tenant.tenantId,
          flowId: $scope.flow.id
        });
      };

      $scope.saveDraft = function () {
        $scope.draft.save(function(draft) {
          $scope.drafts.push(draft);
          $scope.createDraft();
          $scope.createDraftForm.$setPristine();
          $scope.createDraftForm.$setUntouched();
          $scope.createNewDraft = false;
        });
      };

      $scope.createDraft = function () {
        $scope.draft = new FlowDraft({
          flowId: $scope.flow.id,
          tenantId: Session.tenant.tenantId
        });
      };

      $scope.$watch('flow', function () {
        $scope.fetch();
        $scope.createDraft();
      });
      
      $scope.deleteDraft = function(draft){
        Alert.confirm('Deleting this draft cannot be undone. Continue?', function(){
          $scope.drafts.removeItem(draft);
          draft.$delete();
        });
      };
  }]);
