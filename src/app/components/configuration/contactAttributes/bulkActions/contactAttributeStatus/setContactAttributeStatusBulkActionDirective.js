'use strict';

angular.module('liveopsConfigPanel')
  .directive('baSetContactAttributeStatus', ['ContactAttribute', 'Session', 'BulkAction', 'statuses',
    function(ContactAttribute, Session, BulkAction, statuses) {
      return {
        restrict: 'E',
        scope: {
          items: '='
        },
        require: '?^bulkActionExecutor',
        templateUrl: 'app/components/configuration/contactAttributes/bulkActions/contactAttributeStatus/setContactAttributeStatusBulkAction.html',
        link: function($scope, elem, attr, bulkActionExecutor) {
          var ContactAttributeSvc = new ContactAttribute();

          $scope.bulkAction = new BulkAction();
          $scope.statuses = statuses();

          if (bulkActionExecutor) {
            bulkActionExecutor.register($scope.bulkAction);
          }

          $scope.bulkAction.apply = function(contactAttribute) {
            if (contactAttribute.hasOwnProperty('labelVal')) {
              delete contactAttribute.labelVal;
            }

            var contactAttributeCopy = new ContactAttribute();
            contactAttributeCopy.id = contactAttribute.id;
            contactAttributeCopy.name = contactAttribute.name;
            contactAttributeCopy.tenantId = Session.tenant.tenantId;
            contactAttributeCopy.active = $scope.active;

            return contactAttributeCopy.save().then(function(contactAttributeCopy) {
              angular.copy(contactAttributeCopy, contactAttribute);
              contactAttribute.checked = true;
              ContactAttributeSvc.renderLabelList($scope.items);
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
