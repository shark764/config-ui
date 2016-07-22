'use strict';

angular.module('liveopsConfigPanel')
    .controller('queryBuilderController', ['$rootScope', '$timeout', '$translate', '$q', '$scope', 'Modal', 'ZermeloService', function($rootScope, $timeout, $translate, $q, $scope, Modal, ZermeloService) {
    var vm = this;
    vm.isAdvancedMode = false;
    vm.advancedQuery = $scope.queryString;
    vm.query = ZermeloService.parseString(vm.advancedQuery);
    vm.loading = true;

    console.log('SCOPE: ', $scope)

    vm.skills = $scope.entities[0];
    vm.groups = $scope.entities[1];
    vm.users = $scope.entities[2];

    var promises = [vm.skills, vm.groups, vm.users];

    $q.all(promises).then(function() {
      vm.loading = false;
    });

    $rootScope.$on('queue.query.reset', function() {
      vm.query = ZermeloService.resetQuery();
    });

    vm.basicMode = function() {
      vm.query = ZermeloService.parseString(vm.advancedQuery);

      if (!vm.query) {
        return Modal.showConfirm(
          {
            message: $translate.instant('queue.details.version.query.basic.invalid'),
            okCallback: function () {
              vm.query = ZermeloService.getQuery();
              vm.isAdvancedMode = false;
            }
          }
        );
      }

      vm.isAdvancedMode = false;
    };

    vm.advancedMode = function() {
      vm.advancedQuery = ZermeloService.toEdnString(ZermeloService.getQuery());
      vm.isAdvancedMode = true;
    };

    vm.addLevel = function() {
      vm.query = ZermeloService.addQueryLevel();
      vm.advancedQuery = ZermeloService.toEdnString(ZermeloService.getQuery());
    };

    vm.removeLevel = function(level) {
      vm.query = ZermeloService.removeQueryLevel(level);
      vm.advancedQuery = ZermeloService.toEdnString(ZermeloService.getQuery());
    };

    vm.updateQueryLevel = function(level, time, form, multiplier) {
      var newTime = time * multiplier;
      var validity = vm.query.at(level - 1).at(ZermeloService.keywordEnum.ASIQ) < newTime;
      form.amount.$setValidity('minTime', validity);

      if(!validity) {
        form.amount.$setTouched();
        return;
      }

      vm.query = ZermeloService.updateQueryLevel(level, newTime);
      vm.advancedQuery = ZermeloService.toEdnString(ZermeloService.getQuery());
    };

    vm.getDisplay = function(group, item) {
      switch(group) {
        case ':user-id':
          return vm.users.filter(function(user) {
            return user.id === item;
          })[0].getDisplay();
        case ':groups':
          return vm.groups.filter(function(group) {
            return group.id === item;
          })[0].getDisplay();
        case ':skills':
          return vm.skills.filter(function(skill) {
            return skill.id === item;
          })[0].name;
      }
    };

  }]);
