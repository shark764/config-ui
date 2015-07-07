'use strict';

angular.module('liveopsConfigPanel')
  .directive('baSetSkills', [
    function () {
      return {
        restrict: 'AE',
        scope: {
          bulkAction: '='
        },
        templateUrl: 'app/components/management/users/bulkActions/setSkillsBulkAction.html',
        link: function ($scope) {
          $scope.skills = Skill.query({
            tenantId: Session.tenant.tenantId
          });

          $scope.bulkAction.action = function(user) {
            user.skills = $scope.skills
            var promise = user.$update();
            return promise;
          }
        }
      };
    }
  ]);