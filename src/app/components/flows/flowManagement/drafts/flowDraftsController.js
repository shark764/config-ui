'use strict';

angular.module('liveopsConfigPanel')
  .controller('FlowDraftsController', ['$scope', 'Session', 'FlowDraft', 'Alert', function ($scope, Session, FlowDraft, Alert) {
      $scope.fetch = function () {
        if (! $scope.flow || $scope.flow.isNew()){
          return [];
        }

        $scope.drafts = FlowDraft.query({
          tenantId: Session.tenant.tenantId,
          flowId: $scope.flow.id
        });
      };

      $scope.saveDraft = function () {
        return $scope.draft.save(function() {
          $scope.createDraft();
          $scope.createDraftForm.$setPristine();
          $scope.createDraftForm.$setUntouched();
          $scope.createNewDraft = false;
        });
      };

      $scope.createDraft = function () {
        $scope.draft = new FlowDraft({
          flowId: $scope.flow.id,
          flow: '[]',
          tenantId: Session.tenant.tenantId
        });
      };

      $scope.deleteDraft = function(draft){
        Alert.confirm('Deleting this draft cannot be undone. Continue?', function(){
          $scope.drafts.removeItem(draft);
          draft.$delete();
        });
      };

      $scope.pushNewItem = function(event, item) {
        $scope.drafts.unshift(item);
        $scope.selectedDraft = item;
      };

      $scope.$watch('flow', function () {
        if(!$scope.flow) {return;}

        $scope.fetch();
        $scope.createDraft();

        if($scope.cleanHandler){
          $scope.cleanHandler();
        }

        $scope.cleanHandler = $scope.$on(
          'created:resource:tenants:' + Session.tenant.tenantId + ':flows:' + $scope.flow.id + ':drafts',
          $scope.pushNewItem);
      });

  }]);
