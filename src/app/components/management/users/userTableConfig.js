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
            return user.$original.getDisplay();
          },
          'sortOn': '$original.lastName'
        }, {
          'header': $translate.instant('value.email'),
          'name': '$original.email'
        }, {
          'header': $translate.instant('user.table.externalId'),
          'name': '$original.externalId'
        }, {
          'header': $translate.instant('user.table.skills'),
          'name': 'skills:id',
          'resolve': function(user){
            return user.skills.length;
          },
          'options': getSkillOptions(),
          'sortOn': 'skills.length',
          'filterOrderBy': 'display'
        }, {
          'header': $translate.instant('user.table.groups'),
          'name': 'groups:id',
          'resolve': function(user){
            return user.groups.length;
          },
          'options': getGroupOptions(),
          'sortOn': 'groups.length',
          'filterOrderBy': 'display'
        }, {
          'header': $translate.instant('user.table.state'),
          'name': '$original.state',
          'transclude': true,
          'checked': false,
          'options': userStates
        }, {
          'header': $translate.instant('value.status'),
          'name': '$original.status',
          'transclude': true,
          'checked': false,
          'options': userStatuses()
        }],
        'searchOn': ['firstName', 'lastName', {
          path: '$original.skills',
          inner: {
            path: 'name'
          }
        }],
        'orderBy': '$original.lastName',
        'title': $translate.instant('user.table.title')
      };
    }
  ]);
