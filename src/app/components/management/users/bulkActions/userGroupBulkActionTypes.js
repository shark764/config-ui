'use strict';

angular.module('liveopsConfigPanel')
  .service('userGroupBulkActionTypes', ['$filter', 'TenantGroupUsers', 'Session', 'isMember',
    function ($filter, TenantGroupUsers, Session, isMember) {
      return [{
        display: $filter('translate')('bulkActions.userGroups.add'),
        doesQualify: function(user, group) {
          return !isMember(user, group.members);
        },
        execute: function(user, group) {
          var tenantGroupUser = new TenantGroupUsers();
          tenantGroupUser.userId = user.id;
          
          return tenantGroupUser.$save({
            groupId: group.id,
            tenantId: Session.tenant.tenantId
          });
        }
      }, {
        display: $filter('translate')('bulkActions.userGroups.remove'),
        doesQualify: function(user, group) {
          return isMember(user, group.members);
        },
        execute: function(user, group) {
          var tenantGroupUser = new TenantGroupUsers();
          var promise = tenantGroupUser.$delete({
            groupId: group.id,
            tenantId: Session.tenant.tenantId,
            memberId: user.id
          });
          
          promise = promise.catch(function(error) {
            if(error.code === 400) {
              //most likely means the user doesn't have that group
              return $q.when();
            }
          });
          
          return promise
        }
      }];
    }
  ])
  .service('isMember', function() {
    return function(user, members) {
      var isMember = false;
      angular.forEach(members, function(member) {
        if(member.memberId === user.id) {
          isMember = true;
        }
      });
      
      return isMember;
    };
  });