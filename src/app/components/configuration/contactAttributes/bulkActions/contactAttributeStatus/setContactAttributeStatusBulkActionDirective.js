'use strict';

angular.module('liveopsConfigPanel')
  .directive('baSetContactAttributeStatus', ['ContactAttribute', 'Session', 'BulkAction', 'statuses',
    function(ContactAttribute, Session, BulkAction, statuses) {
      return {
        restrict: 'E',
        scope: {},
        require: '?^bulkActionExecutor',
        templateUrl: 'app/components/configuration/contactAttributes/bulkActions/contactAttributeStatus/setContactAttributeStatusBulkAction.html',
        link: function($scope, elem, attr, bulkActionExecutor) {
          $scope.bulkAction = new BulkAction();
          $scope.statuses = statuses();

          if (bulkActionExecutor) {
            bulkActionExecutor.register($scope.bulkAction);
          }

          $scope.bulkAction.apply = function(contactAttribute) {
            var contactAttributeCopy = new ContactAttribute();
            contactAttributeCopy.id = contactAttribute.id;
            contactAttributeCopy.tenantId = Session.tenant.tenantId;
            contactAttributeCopy.active = $scope.active;
            contactAttributeCopy.properties = contactAttribute.properties;
            return contactAttributeCopy.save().then(function(contactAttributeCopy) {
              angular.copy(contactAttributeCopy, contactAttribute);
              contactAttribute.checked = true;
              return contactAttribute;
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
