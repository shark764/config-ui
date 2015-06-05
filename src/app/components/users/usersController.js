'use strict';

angular.module('liveopsConfigPanel')
  .controller('UsersController', ['$scope', '$location', '$routeParams', '$filter', 'userStates', 'userStatuses', 'columns', 'User', 'Session',
      function ($scope, $location, $routeParams, $filter, userStates, userStatuses, columns, User, Session) {
    $scope.states = userStates;
    $scope.statuses = userStatuses;
    $scope.columns = columns;
    $scope.filteredUsers = [];
	  $scope.Session = Session;

    $scope.users = User.query(function () {

      if($routeParams.id) {
        var activeUser = $filter('filter')($scope.users, {
          id: $routeParams.id
        }, true);

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

  }]);
