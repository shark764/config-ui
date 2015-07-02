'use strict';

angular.module('liveopsConfigPanel')
  .controller('UserProfileController', ['$scope', 'Session', 'User', 'Alert', '$translate', function ($scope, Session, User, Alert, $translate, Modal) {
    $scope.user = User.get({id : Session.user.id});

    $scope.save = function() {
      $scope.user.save(function(result){
        Alert.success($translate.instant('user.profile.save.success'));
        Session.setUser(result);
      }, function(){
        Alert.error($translate.instant('user.profile.save.fail'));
      });
    };
    
    Modal.showConfirm({
      title: 'my first modal',
      message: 'This is a basic modal with some basic text inside it. Click OK to hide it.',
      okCallback: function(){
        Modal.close();
      }
    });
  }]);
