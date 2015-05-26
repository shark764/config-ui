'use strict';

angular.module('liveopsConfigPanel')
.directive('newUser', function() {
  return {

    templateUrl: 'app/components/users/newUser/newUser.html',

    link:  function (scope) {
      scope.data = {};
      scope.data.status = false;
      scope.data.state = 'Offline';

      // Passes data via emit to usersController in order to make api call.
      scope.ok = function(){
        scope.$emit('createUser:save', {
            data: scope.data
          });
      };

      // Clears form upon cancel
      scope.cancel = function(){
        scope.data = {};
        scope.data.status = false;
        scope.data.state = 'Offline';
        scope.showError = false;
        scope.showModal = false;
      };

      // Clears form for next create user.
      scope.$on('createUser:success', function (event, args) {
        scope.data = {};
        scope.data.status = false;
        scope.data.state = 'Offline';
      });

    }
  };
});