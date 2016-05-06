'use strict';

angular.module('liveopsConfigPanel')
  .controller('addQueryFilterController', ['_', '$q', '$scope', '$translate', 'Group', 'Modal', 'Session', 'Skill', 'TenantUser', 'ZermeloService', function(_, $q, $scope, $translate, Group, Modal, Session, Skill, TenantUser, ZermeloService) {

    var vm = this;

    vm.query = $scope.query;

    vm.possibleGroups = [
      {
        key: ':skills',
        title: $translate.instant('queues.query.builder.:skills'),
        zermeloKey: 'SKILLS'
      },
      {
        key: ':groups',
        title: $translate.instant('queues.query.builder.:groups'),
        zermeloKey: 'GROUPS'
      },
      {
        key: ':user-id',
        title: $translate.instant('queues.query.builder.:user-id'),
        zermeloKey: 'USERS'
      }
    ];

    vm.possibleGroups[0].items = Skill.cachedQuery({tenantId: Session.tenant.tenantId});
    vm.possibleGroups[1].items = Group.cachedQuery({tenantId: Session.tenant.tenantId});
    vm.possibleGroups[2].items = TenantUser.cachedQuery({tenantId: Session.tenant.tenantId});

    vm.groups = [];

    vm.initialize = function() {
      vm.query.at($scope.level).at(ZermeloService.keywordEnum.QUERY).keys.forEach(function(key) {
        vm.groups.push(_.remove(vm.possibleGroups, function(val) {
          return val.key === key.name;
        })[0]);
      });
    };

    vm.addGroup = function() {
      var group = JSON.parse(vm.currentGroup);
      vm.groups.push(_.remove(vm.possibleGroups, function(val) {
        return val.key === group.key;
      })[0]);
      vm.currentGroup = undefined;
    };

    vm.verifyRemoveGroup = function (key) {
      if (key === ':user-id') {
        key = ':users';
      }
      key = key.slice(1).toUpperCase();

      var hasConditions = ZermeloService.getQuery().at($scope.level).at(ZermeloService.keywordEnum.QUERY).exists(ZermeloService.keywordEnum[key]);
      if(hasConditions) {
        return Modal.showConfirm(
          {
            message: $translate.instant('queue.query.builder.remove.filter.confirm'),
            okCallback: function () {
              vm.query = ZermeloService.removeType($scope.level, key);
              vm.removeGroup(key);
            }
          }
        );
      }

      return vm.removeGroup(key);
    };

    vm.removeGroup = function(key) {
      if (key === 'USERS') {
        key = 'USER-ID';
      }
      key = ':' + key.toLowerCase();

      vm.possibleGroups.push(_.remove(vm.groups, function(val) {
        return val.key === key;
      })[0]);
    };

    vm.initialize();

  }]);
