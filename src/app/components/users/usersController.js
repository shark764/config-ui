'use strict';

angular.module('liveopsConfigPanel')
  .controller('UsersController', ['$scope', 'Session', function ($scope, _Session_) {
    $scope.Session = _Session_;
  }]);
