'use strict';

angular.module('liveopsConfigPanel')
.directive('baUserSkills', [ '$q', 'UserSkillsBulkAction', 'userSkillsBulkActionTypes', 'Skill', 'Session',
  function ($q, UserSkillsBulkAction, userSkillsBulkActionTypes, Skill, Session) {
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
            angular.forEach($scope.bulkAction.userSkillsBulkActions, function(userSkillsBulkAction) {
              if(userSkillsBulkAction.selectedType.doesQualify(user, userSkillsBulkAction)) {
                promises.push(userSkillsBulkAction.execute(user));
              }
            });
          });

          return $q.all(promises);
        };

        $scope.bulkAction.canExecute = function() {
          var canExecute = !!$scope.bulkAction.userSkillsBulkActions.length;
          angular.forEach($scope.bulkAction.userSkillsBulkActions, function(userSkillsBulkAction) {
            canExecute = canExecute && userSkillsBulkAction.selectedType.canExecute(userSkillsBulkAction);
          });

          return canExecute;
        };
        
        $scope.bulkAction.reset = function() {
          $scope.bulkAction.checked = false;
          $scope.bulkAction.userSkillsBulkActions = [];
          $scope.addBulkSkill();
        };

        $scope.fetchSkills = function () {

          $scope.availableSkills = [];

            if ($scope.currSelectedType === 'update' || $scope.currSelectedType === 'remove'){

              angular.forEach($scope.users, function (user) {
                if (user.checked){
                  angular.forEach(user.skills, function (skill){
                    var fullSkill = Skill.cachedGet({id: skill.id});
                    if (fullSkill.hasProficiency){
                      if ($scope.availableSkills.length === 0){
                        $scope.availableSkills.push(fullSkill);
                      } else {
                        // Checks if the current user skills is already in the list, if it is, we skip.  If not we add it to the list.
                        if ($scope.availableSkills.map(function(e) { return e.id; }).indexOf(skill.id) < 0){
                          $scope.availableSkills.push(fullSkill);
                        }
                      }
                    }
                    
                  });
                }
              });
            } else {
              $scope.availableSkills = Skill.cachedQuery({
                tenantId: Session.tenant.tenantId
              });
            }

        };

        $scope.removeBulkSkill = function(item) {
          $scope.bulkAction.userSkillsBulkActions.removeItem(item);
        };

        $scope.addBulkSkill = function() {
          $scope.bulkAction.userSkillsBulkActions.push(
            new UserSkillsBulkAction());
        };

        $scope.onChangeType = function(action) {

          $scope.currSelectedType = action.selectedType.value;
          $scope.fetchSkills();

        };

        $scope.onChangeSkill = function(action) {
          if(action.selectedSkill) {
            action.params.skillId = action.selectedSkill.id;
          }
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
        
        $scope.$watch('bulkAction.params', function() {
          $scope.bulkAction.reset();
        });
          
        $scope.userSkillsBulkActionTypes = userSkillsBulkActionTypes;
        $scope.fetchSkills();
      }
    };
  }
]);
