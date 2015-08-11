'use strict';

angular.module('liveopsConfigPanel')
  .directive('loSubmitChainExecutor', ['$parse', 'Chain', function ($parse, Chain) {
    return {
      restrict: 'A',
      require: ['^loFormSubmit'],
      link: function ($scope, $elem, $attrs, $ctrl) {
        var chainName = $attrs.loSubmitChainExecutor;
        var chain = Chain.get(chainName);

        chain.hook('post form submit', {
          success: function(resource) {
            $ctrl[0].resetForm();
            return resource;
          },
          failure: function(error) {
            $ctrl[0].populateApiErrors(error);
            return error;
          }
        });

        chain.hook('emit event', {
          success: function(resource) {
            $scope.$emit('form:submit:success', resource);
          },
          failure: function(error) {
            $scope.$emit('form:submit:failure', error);
          }
        });

        $attrs.event = angular.isDefined($attrs.event) ? $attrs.event : 'click';

        $elem.bind($attrs.event, function () {
          Chain.get(chainName).execute();
          $scope.$apply();
        });
      }
    };
  }]);
