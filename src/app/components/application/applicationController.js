'use strict';

angular.module('liveopsConfigPanel')
  .controller('ApplicationController', function ($scope) {
    $scope.setCurrentUser = function (user) {
        $scope.currentUser = user;
    };
  });
