'use strict';

angular.module('liveopsConfigPanel')
  .controller('FlowDraftsController', ['$scope', 'Session', 'FlowDraft', 'Alert', function ($scope, Session, FlowDraft, Alert) {
      $scope.fetch = function () {
        $scope.drafts = FlowDraft.query({
          tenantId: Session.tenant.tenantId,
          flowId: $scope.flow.id
        });
      };

      $scope.$watch('flow', function () {
        $scope.fetch();
      });
      
      $scope.deleteDraft = function(draft){
        Alert.confirm('Deleting this draft cannot be undone. Continue?', function(){
          $scope.drafts.removeItem(draft);
          draft.$delete();
        });
      };
  }]);
