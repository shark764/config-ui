'use strict';

angular.module('liveopsConfigPanel')
.controller('customStatsEditorController', ['$scope', '$interval', '$document', '$state', '$moment', '$compile', 'Session', 'FullscreenService', 'TableMiddlewareService', 'CustomStat', 'CustomStatDraft', 'CustomStatVersion', 'customStat', 'draft', 'Alert',
  function($scope, $interval, $document, $state, $moment, $compile, Session, FullscreenService, TableMiddlewareService, CustomStat, CustomStatDraft, CustomStatVersion, customStat, draft, Alert) {

    $scope.draft = draft;
    $scope.customStat = customStat;

    $scope.saveStatus = 'Last saved ' + $moment.utc($scope.draft.updated).fromNow();
    $scope.enablePublish = true;

    $scope.$on('$destroy', function(){
      $interval.cancel(update);
    });

    $scope.editorHTML = {
      lineNumbers: true,
      indentUnit: 2,
      smartIndent: true,
      tabSize: 2,
      mode: "clojure",
      theme: "mdn-like",
      keyMap: "sublime",
      lint: true,
      scrollbarStyle: "null",
      matchBrackets: true,
      autoCloseTags: true,
      autoCloseBrackets: true,
      indentWithTabs: false
    };

    var update = $interval(function(){
      $scope.saveStatus = 'Saving...';
      $scope.editorHTML.readOnly = true;
      $scope.enablePublish = false;

      var request = $scope.draft.save();

      request.then(function(draft) {
        $scope.editorHTML.readOnly = false;
        $scope.enablePublish = true;
        $scope.draft = draft;
        $scope.saveStatus = 'Last saved ' + moment.utc($scope.draft.updated).fromNow();
      });
    }, 30000);

    $scope.publishNewStatVersion = function() {
      if ($scope.draft.customStat.length === 0) { return; }

      var newScope = $scope.$new();

      newScope.modalBody = 'app/components/reporting/customStatsEditor/publish.modal.html';
      newScope.title = 'Publish';
      newScope.stat = {
        name: $scope.draft.name,
        active: true
      };
      newScope.version = {
        name: '',
        description: ''
      };

      newScope.okCallback = function(stat, version){

        var _version = new CustomStatVersion({
          customStat: $scope.draft.customStat,
          name: version.name,
          tenantId: Session.tenant.tenantId,
          customStatId: $scope.draft.customStatId
        });

        _version.save(function(v){
          $document.find('modal').remove();
          Alert.success('New stat version successfully created.');
          $scope.draft.$delete().then(function(){
            $scope.customStat.$update({
              name: customStat.name,
              activeVersion: (customStat.active) ? v.version : customStat.activeVersion
            }).then(function(){
              $state.go('content.reporting.custom-stats', {}, {reload: true});
            });
          });

        }, function(error) {
          if (error.data.error.attribute === null) {
            Alert.error('API rejected this stat.', JSON.stringify(error, null, 2));
          }
        });
      };
      newScope.cancelCallback = function(){
        $document.find('modal').remove();
      };

      var element = $compile('<modal></modal>')(newScope);
      $document.find('html > body').append(element);
    };
  }
]);
