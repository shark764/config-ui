'use strict';

angular.module('liveopsConfigPanel')
  .service('userTableConfig', ['userStatuses', 'userStates', '$translate', 'Skill', 'Group', 'Session',
    function(userStatuses, userStates, $translate, Skill, Group, Session) {
      Skill.prototype.value = function () {
        return this.id;
      }
      Skill.prototype.display = function () {
        return this.name;
      }

      Group.prototype.value = function () {
        return this.id;
      }
      Group.prototype.display = function () {
        return this.name;
      }

      function getSkillOptions(){
        return Skill.cachedQuery({
          tenantId: Session.tenant.tenantId
        });
      }

      function getGroupOptions(){
        return Group.cachedQuery({
          tenantId: Session.tenant.tenantId
        });
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
          'options': getSkillOptions,
          'sortOn': 'skills.length',
          'filterOrderBy': 'display'
        }, {
          'header': $translate.instant('user.table.groups'),
          'name': 'groups:id',
          'resolve': function(user){
            return user.groups.length;
          },
          'options': getGroupOptions,
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
