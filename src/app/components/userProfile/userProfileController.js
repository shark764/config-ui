'use strict';

angular.module('liveopsConfigPanel')
  .controller('UserProfileController', ['$scope', 'Session', 'UserService', function ($scope, Session, UserService) {
    UserService.get({id : Session.id}, function (data) {
      $scope.user = data.result;
    });
    
    $scope.save = function(){
      UserService.update({id : $scope.user.id}, {
        firstName: $scope.user.firstName,
        lastName: $scope.user.lastName,
        displayName: $scope.user.displayName
      });
    };
  }]);
