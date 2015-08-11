'use strict';

angular.module('liveopsConfigPanel')
  .service('userTableConfig', ['userStatuses', 'userStates', '$translate', 'Skill', 'Group', 'Session',
    function(userStatuses, userStates, $translate, Skill, Group, Session) {
      function getSkillOptions(){
        var options = [];
        
        Skill.cachedQuery({
          tenantId: Session.tenant.tenantId
        }).$promise.then(function(skills){
          angular.forEach(skills, function(skill){
            options.push({
              display: skill.name,
              value: skill.id
            });
          });
        });
        
        return options;
      }
      
      function getGroupOptions(){
        var options = [];
        
        Group.cachedQuery({
          tenantId: Session.tenant.tenantId
        }).$promise.then(function(groups){
          angular.forEach(groups, function(group){
            options.push({
              display: group.name,
              value: group.id
            });
          });
        });
        
        return options;
      }
      
      return {
        'fields': [{
          'header': $translate.instant('value.name'),
          'resolve': function(user) {
            return user.getDisplay();
          },
          'sortOn': 'lastName'
        }, {
          'header': $translate.instant('value.email'),
          'name': 'email'
        }, {
          'header': $translate.instant('user.table.externalId'),
          'name': 'externalId'
        }, {
          'header': $translate.instant('user.table.skills'),
          'name': 'skills:id',
          'resolve': function(user){
            return user.skills.length;
          },
          'options': getSkillOptions(),
          'sortOn': 'skills.length'
        }, {
          'header': $translate.instant('user.table.groups'),
          'name': 'groups:id',
          'resolve': function(user){
            return user.groups.length;
          },
          'options': getGroupOptions(),
          'sortOn': 'groups.length'
        }, {
          'header': $translate.instant('user.table.state'),
          'name': 'state',
          'transclude': true,
          'checked': false,
          'options': userStates
        }, {
          'header': $translate.instant('value.status'),
          'name': 'status',
          'transclude': true,
          'checked': false,
          'options': userStatuses()
        }],
        'searchOn': ['firstName', 'lastName', {
          path: 'skills',
          inner: {
            path: 'name'
          }
        }],
        'orderBy': 'lastName',
        'title': $translate.instant('user.table.title')
      };
    }
  ]);
