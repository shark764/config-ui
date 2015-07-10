'use strict';

angular.module('liveopsConfigPanel')
  .service('UserGroupBulkAction', ['userGroupBulkActionTypes',
    function (userGroupBulkActionTypes) {
      var UserGroupBulkAction = function () {
        this.selectedType = userGroupBulkActionTypes[0];
        this.usersAffected = []
        this.params = {};
      }

      UserGroupBulkAction.prototype.execute = function (user) {
        return this.selectedType.execute(user, this);
      }

      UserGroupBulkAction.prototype.canExecute = function () {
        return this.selectedType.canExecute(this);
      }

      return UserGroupBulkAction;
    }
  ])
  .service('userGroupBulkActionTypes', ['$filter', 'TenantGroupUsers', 'Session', 'isMember',
    function ($filter, TenantGroupUsers, Session, isMember) {
      return [{
        display: $filter('translate')('bulkActions.userGroups.add'),
        doesQualify: function (user, action) {
          return !isMember(user, action.selectedGroup.members);
        },
        execute: function (user, action) {
          var tenantGroupUser = new TenantGroupUsers();
          tenantGroupUser.userId = user.id;
          
          return tenantGroupUser.$save({
            groupId: action.selectedGroup.id,
            tenantId: Session.tenant.tenantId
          });
        },
        canExecute: function (action) {
          return action.selectedGroup;
        }
      }, {
        display: $filter('translate')('bulkActions.userGroups.remove'),
        doesQualify: function (user, action) {
          return isMember(user, action.selectedGroup.members);
        },
        execute: function (user, action) {
          var tenantGroupUser = new TenantGroupUsers();
          return tenantGroupUser.$delete({
            groupId: action.selectedGroup.id,
            tenantId: Session.tenant.tenantId,
            memberId: user.id
          });
        },
        canExecute: function (action) {
          return action.selectedGroup;
        }
      }];
    }
  ])
  .service('isMember', function () {
    return function (user, members) {
      var isMember = false;
      angular.forEach(members, function (member) {
        isMember = isMember || member.memberId === user.id;
      });

      return isMember;
    };
  });