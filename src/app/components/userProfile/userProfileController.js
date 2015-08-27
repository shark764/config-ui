'use strict';

angular.module('liveopsConfigPanel')
  .controller('UserProfileController', ['$scope', 'Session', 'User', 'Alert', '$translate', function ($scope, Session, User, Alert, $translate) {
    $scope.user = User.get({id : Session.user.id});

    $scope.save = function() {
      delete $scope.user.status; //User cannot edit their own status
      delete $scope.user.roleId; //User cannot edit their own platform roleId
      
      $scope.user.save(function(result){
        Alert.success($translate.instant('user.profile.save.success'));
        Session.setUser(result);
      }, function(){
        Alert.error($translate.instant('user.profile.save.fail'));
      });
    };
  }]);
