'use strict';

angular.module('liveopsConfigPanel')
  .factory('Skill', ['LiveopsResourceFactory', function (LiveopsResourceFactory) {
    var Skill = LiveopsResourceFactory.create('/v1/tenants/:tenantId/skills/:id', [
      {name: 'name'},
      {name: 'description', optional: true},
      {name: 'hasProficiency'},
      {name: 'status', optional: true}
    ]);
    
    Skill.prototype.getDisplay = function () {
      return this.name;
    };
    
    Skill.resourceName = 'Skill';
    return Skill;
  }]);
