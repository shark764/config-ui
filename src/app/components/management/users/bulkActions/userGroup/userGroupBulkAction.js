'use strict';

angular.module('liveopsConfigPanel')
  .service('UserGroupBulkAction', ['userGroupBulkActionTypes',
    function(userGroupBulkActionTypes) {
      var UserGroupBulkAction = function() {
        this.selectedType = userGroupBulkActionTypes[0];
        this.usersAffected = [];
        this.params = {};
      };

      UserGroupBulkAction.prototype.execute = function(user) {
        return this.selectedType.execute(user, this);
      };

      UserGroupBulkAction.prototype.canExecute = function() {
        return this.selectedType.canExecute(this);
      };

      return UserGroupBulkAction;
    }
  ])
  .service('userGroupBulkActionTypes', ['$filter', 'TenantGroupUsers', 'Session', 'hasGroup',
    function($filter, TenantGroupUsers, Session, hasGroup) {
      return [{
        value: 'add',
        display: $filter('translate')('bulkActions.userGroups.add'),
        doesQualify: function(user, action) {
          return !hasGroup(action.selectedGroup, user.$groups);
        },
        execute: function(user, action) {
          var tenantGroupUser = new TenantGroupUsers();
          tenantGroupUser.userId = user.id;

          return tenantGroupUser.$save({
            groupId: action.selectedGroup.id,
            tenantId: Session.tenant.tenantId
          }, function(groupUser) {
            user.$groups.push({
              id: groupUser.groupId,
              name: groupUser.groupName
            });
          });
        },
        canExecute: function(action) {
          return action.selectedGroup;
        }
      }, {
        value: 'remove',
        display: $filter('translate')('bulkActions.userGroups.remove'),
        doesQualify: function(user, action) {
          return hasGroup(action.selectedGroup, user.$groups);
        },
        execute: function(user, action) {
          var tenantGroupUser = new TenantGroupUsers();
          return tenantGroupUser.$delete({
            groupId: action.selectedGroup.id,
            tenantId: Session.tenant.tenantId,
            memberId: user.id
          }, function(deletedGroup) {
            for (var i = 0; i < user.$groups.length; i++) {
              if (user.$groups[i].id === deletedGroup.groupId) {
                user.$groups.removeItem(user.$groups[i]);
                break;
              }
            }
          });
        },
        canExecute: function(action) {
          return action.selectedGroup;
        }
      }];
    }
  ])
  .service('hasGroup', function() {
    return function(group, userGroups) {
      var hasGroup = false;
      angular.forEach(userGroups, function(userGroup) {
        hasGroup = hasGroup || group.id === userGroup.id;
      });

      return hasGroup;
    };
  });
