'use strict';

angular.module('liveopsConfigPanel')
  .controller('afterSecondsInQueueController', ['$element', '$translate', '$scope', 'ZermeloService', function($element, $translate, $scope, ZermeloService) {
    var vm = this;

    vm.multiplier = 1;
    vm.timeAmount = $element.controller('queryBuilder').query.at($scope.level).at(ZermeloService.keywordEnum.ASIQ);
    vm.timeOptions = [
      {
        label: $translate.instant('queue.details.priorityUnit.seconds'),
        value: 1
      },
      {
        label: $translate.instant('queue.details.priorityUnit.minutes'),
        value: 60
      }
    ];

    if (vm.timeAmount % 60 === 0) {
      vm.timeAmount = vm.timeAmount / 60;
      vm.multiplier = 60;
    }

    vm.updateQueryLevel = $element.controller('queryBuilder').updateQueryLevel;

    $scope.$watch(function() {
      return ZermeloService.getQuery();
    }, function() {
      vm.updateQueryLevel($scope.level, vm.timeAmount, vm.timeAfterForm, vm.multiplier);
    }, true);

  }]);
