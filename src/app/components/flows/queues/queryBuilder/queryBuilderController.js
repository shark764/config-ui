'use strict';

angular.module('liveopsConfigPanel')
    .controller('queryBuilderController', ['$q', '$rootScope', '$translate', '$scope', 'Modal', 'ZermeloService', 'Skill', 'Group', 'TenantUser', 'Session', function($q, $rootScope, $translate, $scope, Modal, ZermeloService, Skill, Group, TenantUser, Session) {
    var vm = this;
    vm.isAdvancedMode = false;
    vm.advancedQuery = $scope.queryString;
    vm.query = ZermeloService.parseString(vm.advancedQuery);
    vm.loading = true;

    vm.skills = Skill.cachedQuery({tenantId: Session.tenant.tenantId});
    vm.groups = Group.cachedQuery({tenantId: Session.tenant.tenantId});
    vm.users = TenantUser.cachedQuery({tenantId: Session.tenant.tenantId});

    $q.all([vm.skills.$promise, vm.groups.$promise, vm.users.$promise]).then(function() {
      vm.loading = false;
    });

    $rootScope.$on('queue.query.reset', function() {
      if (!$scope.readOnly) {
        vm.query = ZermeloService.resetQuery();
      }
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

    vm.getDisplay = function(group, item, advancedQuery, level, someEvery) {
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
          var skill = vm.skills.filter(function(skill) {
            return item === skill.id;
          })[0];

          return skill.name + ZermeloService.displayProficiency(skill, advancedQuery, level, someEvery);
      }
    };

  }]);
