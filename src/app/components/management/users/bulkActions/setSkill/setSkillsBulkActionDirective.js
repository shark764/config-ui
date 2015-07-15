'use strict';

angular.module('liveopsConfigPanel')
.directive('baUserSkills', [ '$q', 'UserSkillsBulkAction', 'userSkillsBulkActionTypes', 'Skill', 'Session', '$translate', 'TenantSkillUsers',
  function ($q, UserSkillsBulkAction, userSkillsBulkActionTypes, Skill, Session, $translate, TenantSkillUsers) {
    return {
      restrict: 'AE',
      scope: {
        bulkAction: '=',
        users: '='
      },
      templateUrl: 'app/components/management/users/bulkActions/setSkill/setSkillsBulkAction.html',
      link: function ($scope) {
        $scope.bulkAction.execute = function (users) {
          var promises = [];
          angular.forEach(users, function(user) {
            angular.forEach($scope.userSkillsBulkActions, function(userSkillsBulkAction) {
              if(userSkillsBulkAction.selectedType.doesQualify(user, userSkillsBulkAction)) {
                promises.push(userSkillsBulkAction.execute(user));
              }
            });
          });

          return $q.all(promises).then(function(userSkills) {
            var skills = [];
            angular.forEach(userSkills, function(userSkill) {
              var skill = $scope.findSkillForId($scope.skills, userSkill.skillId);

              if(skills.indexOf(skill) < 0) {
                skills.push(skill);
                $scope.fetchSkillUsers(skill);
              }
            });

            return userSkills;
          });
        };

        $scope.bulkAction.canExecute = function() {
          var canExecute = !!$scope.userSkillsBulkActions.length;
          angular.forEach($scope.userSkillsBulkActions, function(userSkillsBulkAction) {
            canExecute = canExecute && userSkillsBulkAction.selectedType.canExecute(userSkillsBulkAction);
          });

          return canExecute;
        };

        $scope.fetch = function () {
          if (!Session.tenant.tenantId) {
            return;
          }

          $scope.skills = Skill.query({
            tenantId: Session.tenant.tenantId
          });
        };

        $scope.fetchSkillUsers = function(skill) {
          skill.users = TenantSkillUsers.query({
            tenantId: Session.tenant.tenantId,
            skillId: skill.id
          });

          return skill.users
        }

        $scope.removeBulkSkill = function(item) {
          $scope.userSkillsBulkActions.removeItem(item);
        };

        $scope.addBulkSkill = function() {
          $scope.userSkillsBulkActions.push(
            new UserSkillsBulkAction());
        };

        $scope.onSelectSkill = function(action) {
          var skill = action.selectedSkill;
          $scope.fetchSkillUsers(skill);

          skill.users.$promise.then(function() {
            action.params.skillId = action.selectedSkill.id;
            $scope.refreshAffectedUsers(action);
          })
        };

        $scope.refreshAffectedUsers = function(userSkillsBulkAction) {
          if(!userSkillsBulkAction.canExecute()) {
            return;
          }

          userSkillsBulkAction.usersAffected = [];

          angular.forEach($scope.users, function(user) {
            if(!user.checked) {
              return;
            }

            if(userSkillsBulkAction.selectedType.doesQualify(user, userSkillsBulkAction)){
              userSkillsBulkAction.usersAffected.push(user);
            }
          });
        };

        $scope.refreshAllAffectedUsers = function() {
          angular.forEach($scope.userSkillsBulkActions, function(action) {
            $scope.refreshAffectedUsers(action);
          });
        };

        $scope.findSkillForId = function(skills, id) {
          var foundSkill;
          angular.forEach(skills, function(skill) {
            if(skill.id === id) {
              foundSkill = skill;
            }
          });

          return foundSkill;
        };

        $scope.$on('table:resource:checked', $scope.refreshAllAffectedUsers);
        $scope.$on('dropdown:item:checked', $scope.refreshAllAffectedUsers);

        $scope.userSkillsBulkActionTypes = userSkillsBulkActionTypes;
        $scope.userSkillsBulkActions = [];
        $scope.addBulkSkill();
        $scope.fetch();
      }
    };
  }
]);
