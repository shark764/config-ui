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
          operator: 'every',
          labelKey: 'queue.query.builder.skills.all',
          placeholderKey: 'queue.query.builder.skills.placeholder',
          template: 'app/components/flows/queues/queueQueryCreator/skillsQuery.html'
        }, {
          keyword: ':skills',
          options: fetchSkills,
          operator: 'some',
          labelKey: 'queue.query.builder.skills.some',
          placeholderKey: 'queue.query.builder.skills.placeholder',
          template: 'app/components/flows/queues/queueQueryCreator/skillsQuery.html'
        }];
    }
  ]);
