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
          'id': 'user-skills-table-column',
          'resolve': function(user){
            return user.skills.length;
          },
          'options': getSkillOptions(),
          'sortOn': 'skills.length',
          'filterOrderBy': 'display'
        }, {
          'header': $translate.instant('user.table.groups'),
          'name': 'groups:id',
          'id': 'user-groups-table-column',
          'resolve': function(user){
            return user.groups.length;
          },
          'options': getGroupOptions(),
          'sortOn': 'groups.length',
          'filterOrderBy': 'display'
        }, {
          'header': $translate.instant('user.table.state'),
          'name': 'state',
          'transclude': true,
          'checked': false,
          'options': userStates,
          'id': 'user-states-table-column'
        }, {
          'header': $translate.instant('value.status'),
          'name': 'status',
          'transclude': true,
          'checked': false,
          'options': userStatuses(),
          'id': 'user-status-table-column'
        }],
        'searchOn': ['firstName', 'lastName'],
        'orderBy': 'lastName',
        'title': $translate.instant('user.table.title')
      };
    }
  ]);
