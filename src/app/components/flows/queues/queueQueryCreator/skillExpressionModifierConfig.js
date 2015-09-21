'use strict';

angular.module('liveopsConfigPanel')
  .service('skillExpressionModifierConfig', ['Session', 'Skill', 'jsedn',
    function (Session, Skill, jsedn) {

      var fetchSkills = function(){
        return Skill.cachedQuery({
          tenantId: Session.tenant.tenantId
        });
      };

      return [{
          keyword: ':skills',
          options: fetchSkills,
          operator: 'and',
          labelKey: 'queue.query.builder.skills.all',
          placeholderKey: 'queue.query.builder.skills.placeholder',
          template: 'app/components/flows/queues/queueQueryCreator/queryModifierTemplates/skillsQuery.html'
        }, {
          keyword: ':skills',
          options: fetchSkills,
          operator: 'or',
          labelKey: 'queue.query.builder.skills.some',
          placeholderKey: 'queue.query.builder.skills.placeholder',
          template: 'app/components/flows/queues/queueQueryCreator/queryModifierTemplates/skillsQuery.html'
        }];
    }
  ]);
