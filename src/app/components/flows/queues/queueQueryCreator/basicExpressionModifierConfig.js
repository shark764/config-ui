'use strict';

angular.module('liveopsConfigPanel')
  .service('basicExpressionModifierConfig', ['Session', 'Group', 'Skill', 'jsedn',
    function (Session, Group, Skill, jsedn) {

      var fetchGroups = function(){
        return Group.cachedQuery({
          tenantId: Session.tenant.tenantId
        });
      };

      var fetchSkills = function(){
        return Skill.cachedQuery({
          tenantId: Session.tenant.tenantId
        });
      };

      return [{
          keyword: ':skills',
          options: fetchSkills,
          operator: 'every',
          labelKey: 'queue.query.builder.skills.all',
          placeholderKey: 'queue.query.builder.skills.placeholder'
        }, {
          keyword: ':skills',
          options: fetchSkills,
          operator: 'some',
          labelKey: 'queue.query.builder.skills.some',
          placeholderKey: 'queue.query.builder.skills.placeholder'
        }, {
          keyword: ':groups',
          options: fetchGroups,
          operator: 'every',
          labelKey: 'queue.query.builder.groups.all',
          placeholderKey: 'queue.query.builder.groups.placeholder'
        }, {
          keyword: ':groups',
          options: fetchGroups,
          operator: 'some',
          labelKey: 'queue.query.builder.groups.some',
          placeholderKey: 'queue.query.builder.groups.placeholder'
        }
      ];
    }
  ]);
