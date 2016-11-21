'use strict';

angular.module('liveopsConfigPanel')
  .directive('baSetMessageTemplateStatus', ['MessageTemplate', 'Session', 'BulkAction', 'statuses',
    function(MessageTemplate, Session, BulkAction, statuses) {
      return {
        restrict: 'E',
        scope: {},
        require: '?^bulkActionExecutor',
        templateUrl: 'app/components/configuration/messageTemplates/bulkActions/messageTemplateStatus/setMessageTemplateStatusBulkAction.html',
        link: function($scope, elem, attr, bulkActionExecutor) {
          $scope.bulkAction = new BulkAction();
          $scope.statuses = statuses();

          if (bulkActionExecutor) {
            bulkActionExecutor.register($scope.bulkAction);
          }

          $scope.bulkAction.apply = function(messageTemplate) {
            var messageTemplateCopy = new MessageTemplate();
            messageTemplateCopy.id = messageTemplate.id;
            messageTemplateCopy.tenantId = Session.tenant.tenantId;
            messageTemplateCopy.active = $scope.active;
            messageTemplateCopy.properties = messageTemplate.properties;
            return messageTemplateCopy.save().then(function(messageTemplateCopy) {
              angular.copy(messageTemplateCopy, messageTemplate);
              messageTemplate.checked = true;
              return messageTemplate;
            });
          };

          $scope.bulkAction.reset = function() {
            $scope.bulkAction.checked = false;
            $scope.active = false;
          };

          $scope.bulkAction.reset();
        }
      };
    }
  ]);
