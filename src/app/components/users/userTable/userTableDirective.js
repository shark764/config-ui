'use strict';

angular.module('liveopsConfigPanel')
  .directive('userTable', ['userStates', 'userStatuses', function(userStates, userStatuses) {
    return {
      restrict: 'E',
      scope: {
        users: '=',
        selectUser: '='
      },
      templateUrl: 'app/components/users/userTable/userTable.html',
      link : function(scope){
        scope.states = userStates;
        scope.statuses = userStatuses;
      }
    };
  }])
  .filter('userFilter', function() {
    return function( users, items, field) {
      if (items.all && items.all.checked){
        return users;
      }

      var selectedFilters = [];
      angular.forEach(items.filters, function(item) {
        if(item.checked) {
          selectedFilters.push(String(item.value));
        }
      });

      var filtered = [];
      angular.forEach(users, function(user) {
        if(selectedFilters.indexOf(String(user[field])) > -1) {
          filtered.push(user);
        } else {
          //Uncheck users that have been excluded by the filter, so they are not included in batch operations:
          user.checked = false;
        }
      });

      return filtered;
    };
  })
 ;
