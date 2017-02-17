'use strict';

angular.module('liveopsConfigPanel')
  .directive('baSetContactAttributeStatus', ['ContactAttribute', 'Session', 'BulkAction', 'Alert', 'statuses', '$translate', '$q',
    function(ContactAttribute, Session, BulkAction, Alert, statuses, $translate, $q) {
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
            if (Session.tenant.tenantId !== contactAttribute.tenantId) {
              Alert.error($translate.instant('bulkActions.contactAttributes.fail', {contactAttributeName: contactAttribute.objectName}));
              var deferred = $q.defer();
              deferred.reject('Cannot edit shared status of inherited contact attribute');
              return deferred.promise;
            }


            if (contactAttribute.hasOwnProperty('labelVal')) {
              delete contactAttribute.labelVal;
            }

            var contactAttributeCopy = new ContactAttribute();
            contactAttributeCopy.id = contactAttribute.id;
            contactAttributeCopy.label = contactAttribute.label;
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
