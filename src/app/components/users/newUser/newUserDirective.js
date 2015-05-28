'use strict';

angular.module('liveopsConfigPanel')
.directive('newUser', function() {
  return {

    templateUrl: 'app/components/users/newUser/newUser.html',

    link:  function (scope) {
      scope.data = {};
      scope.data.status = false;
      scope.data.state = 'Offline';

      scope.$watch('data.firstName', function() {
        scope.updateDisplayName();
      });
      
      scope.$watch('data.lastName', function() {
        scope.updateDisplayName();
      });
      
      scope.updateDisplayName = function(){
        if (! scope.createUserForm.displayName.$touched){
          var firstName = (scope.data.firstName ? scope.data.firstName : '');
          var lastName = (scope.data.lastName ? scope.data.lastName : '');
          var name = firstName + ' ' + lastName
          scope.data.displayName =  name.trim();
        }
      }
      
      // Passes data via emit to usersController in order to make api call.
      scope.ok = function(){
        if(scope.createUserForm.$valid){
          scope.$emit('createUser:save', {
            data: scope.data
          });
        }
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
      scope.$on('createUser:success', function () {
        scope.data = {};
        scope.data.status = false;
        scope.data.state = 'Offline';
      });

    }
  };
});
