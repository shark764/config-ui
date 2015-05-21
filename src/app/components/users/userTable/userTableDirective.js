'use strict';

angular.module('liveopsConfigPanel')
  .directive('userTable', function() {
    return {
      scope: {
        users: '=users'
      },
      restrict:'E',

      link : function (scope) {
        scope.searchUser = function (user) {
          if (!scope.queryUser) return true;
          var wildCardQuery = new RegExp(scope.regExpReplace(scope.queryUser), 'i');

          // Search by displayName and location; location not defined yet
          // return (wildCardQuery.test(user.displayName) || wildCardQuery.test(user.location));
          return (wildCardQuery.test(user.displayName));
        };

        scope.regExpReplace = function (string){
          // Allow all characters in user search, use * as wildcard
          string.replace(/([.+?^=!:${}()|\[\]\/\\])/g, '\\$1');
          return string.replace(/([*])/g, '.*');
        };

      },
      templateUrl: 'app/components/users/userTable/userTable.html'
    };
 });
