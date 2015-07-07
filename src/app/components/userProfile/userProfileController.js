'use strict';

angular.module('liveopsConfigPanel')
  .controller('UserProfileController', ['$scope', 'Session', 'User', 'Alert', '$translate', function ($scope, Session, User, Alert, $translate) {
    $scope.user = User.get({id : Session.user.id});

    $scope.save = function() {
      $scope.user.save(function(){
        Alert.success($translate.instant('user.profile.save.success'));
      }, function(){
        Alert.error($translate.instant('user.profile.save.fail'));
      });
    };
  }]);
