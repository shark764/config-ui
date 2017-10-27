'use strict';

angular.module('liveopsConfigPanel')
  .directive('baSetIdentityProvidersStatus', ['IdentityProviders', 'Session', 'BulkAction', 'statuses',
    function(IdentityProviders, Session, BulkAction, statuses) {
      return {
        restrict: 'E',
        scope: {},
        require: '?^bulkActionExecutor',
        templateUrl: 'app/components/configuration/identityProviders/bulkActions/setIdentityProvidersStatusBulkAction.html',
        link: function($scope, elem, attr, bulkActionExecutor) {
          $scope.bulkAction = new BulkAction();
          $scope.statuses = statuses();

          if (bulkActionExecutor) {
            bulkActionExecutor.register($scope.bulkAction);
          }

          $scope.bulkAction.apply = function(identityProviders) {
            var identityProvidersCopy = new IdentityProviders();
            identityProvidersCopy.id = identityProviders.id;
            identityProvidersCopy.name = identityProviders.name;
            identityProvidersCopy.tenantId = Session.tenant.tenantId;
            identityProvidersCopy.active = $scope.active;

            return identityProvidersCopy.save().then(function(identityProvidersCopy) {
              angular.copy(identityProvidersCopy, identityProviders);
              identityProviders.checked = true;
              return identityProviders;
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
