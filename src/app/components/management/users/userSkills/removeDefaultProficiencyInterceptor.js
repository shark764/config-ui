'use strict';

angular.module('liveopsConfigPanel')
  .service('removeDefaultProficiencyInterceptor', ['queryCache', 'Skill', 'Session', 'filterFilter',
    function (queryCache, Skill, Session, filterFilter) {
      this.response = function (response) {
        var skillId = response.resource.skillId;
        var skills = Skill.cachedQuery({
          tenantId: Session.tenant.tenantId
        });
        
        var matching = filterFilter(skills, {
          id: skillId
        }, true);
        
        if (matching.length > 0){
          if (! matching[0].hasProficiency){
            delete response.resource.proficiency;
          }
        }

        return response.resource;
      };
    }
  ]);
