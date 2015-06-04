'use strict';

angular.module('liveopsConfigPanel')
  .controller('UserProfileController', ['$scope', 'Session', 'User', function ($scope, Session, User) {
    $scope.user = User.get({id : Session.id});

    $scope.save = function() {
      $scope.user.save({id : $scope.user.id});
    };
  }]);
