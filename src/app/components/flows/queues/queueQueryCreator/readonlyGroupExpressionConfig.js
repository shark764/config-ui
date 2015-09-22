'use strict';

angular.module('liveopsConfigPanel')
  .service('readonlyGroupExpressionConfig', ['Session', 'Group', 'jsedn',
    function (Session, Group, jsedn) {

      var fetchGroups = function(){
        return Group.cachedQuery({
          tenantId: Session.tenant.tenantId
        });
      };

      return [{
          keyword: ':groups',
          options: fetchGroups,
          operator: 'every',
          labelKey: 'queue.query.builder.groups.all',
          placeholderKey: 'queue.query.builder.groups.placeholder',
          template: 'app/components/flows/queues/queueQueryCreator/queryModifierTemplates/readonlyGroupsQuery.html'
        }, {
          keyword: ':groups',
          options: fetchGroups,
          operator: 'some',
          labelKey: 'queue.query.builder.groups.some',
          placeholderKey: 'queue.query.builder.groups.placeholder',
          template: 'app/components/flows/queues/queueQueryCreator/queryModifierTemplates/readonlyGroupsQuery.html'
        }
      ];
    }
  ]);
