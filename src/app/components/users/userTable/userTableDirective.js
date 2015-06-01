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
        $scope.filteredUsers = [];
        
        UserService.query(function (data) {
          $scope.users = data.result;
          
          if($routeParams.id) {
            var activeUser = $filter('filter')($scope.users, {
              id: $routeParams.id
            }, true)[0];

            $scope.selectedUser = activeUser;
          }
        });

        $scope.$watchCollection(function(){ return $scope.filteredUsers;}, function(newList){
          //Only replace the selected user if the old one got excluded via filtering.
          if (newList && newList.indexOf($scope.selectedUser) === -1){
            $scope.selectedUser = $scope.filteredUsers[0];
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
