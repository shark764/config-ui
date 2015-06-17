'use strict';

angular.module('liveopsConfigPanel')
  .controller('UserProfileController', ['$scope', 'Session', 'User', function ($scope, Session, User) {
    $scope.user = User.get({id : Session.user.id});

    $scope.save = function() {
      $scope.user.save();
    };
  }]);
