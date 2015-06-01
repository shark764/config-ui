'use strict';

angular.module('liveopsConfigPanel')
  .directive('userTable', ['$location', '$routeParams', '$filter', 'userStates', 'userStatuses', 'columns', 'UserService', 
    function ($location, $routeParams, $filter, userStates, userStatuses, columns, UserService) {
    return {
      restrict: 'E',
      link: function ($scope) {
        $scope.states = userStates;
        $scope.statuses = userStatuses;
        $scope.columns = columns;
        
        UserService.query(function (data) {
          $scope.users = data.result;
          
          if($routeParams.id) {
            var activeUser = $filter('find')($scope.users, {
              id: $routeParams.id
            })[0];

            $scope.selectedUser = activeUser;
          }
        });

        $scope.selectUser = function (user) {
          $scope.selectedUser = user;
          $location.search({
            id: user.id
          });
        };

        $scope.createUser = function () {
          $scope.$broadcast('user:create');
        };

        $scope.$on('user:created', function (event, user) {
          $scope.users.push(user);
        });
      },
      templateUrl: 'app/components/users/userTable/userTable.html'
    };
  }])
  .filter('userFilter', function () {
    return function (users, items, field) {
      if (items.all && items.all.checked) {
        return users;
      }

      var selectedFilters = [];
      angular.forEach(items.filters, function (item) {
        if (item.checked) {
          selectedFilters.push(String(item.value));
        }
      });

      var filtered = [];
      angular.forEach(users, function (user) {
        if (selectedFilters.indexOf(String(user[field])) > -1) {
          filtered.push(user);
        }
      });

      return filtered;
    };
  });
