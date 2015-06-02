'use strict';

angular.module('liveopsConfigPanel')
  .controller('UserProfileController', ['$scope', 'Session', 'UserService', function ($scope, Session, UserService) {
    UserService.get({id : Session.id}, function (data) {
      $scope.user = data.result;
    });
  }]);
