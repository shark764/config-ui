'use strict';

angular.module('liveopsConfigPanel')
  .controller('UserListController', ['$scope', 'Session', 'UserService', 'filterFilter', function ($scope, Session, UserService, filterFilter) {
    $scope.showModal = false;
    $scope.showError = false;
    $scope.errorMsg = 'Input required data';
    $scope.checkedUsers = [];
    
    
    $scope.selectUser = function (user) {
      $scope.selectedUserContext = {
        user: user
      };

      $scope.selectedUserContext.display = {
        firstName: user.firstName,
        lastName: user.lastName,
        displayName: user.displayName
      };
    };

  	UserService.query(function(data){
      $scope.users = data.result;
      $scope.selectedUserContext = {};

      if (data.result) {
        //Binding form to first result. Putting this in for now.
        $scope.selectUser(data.result[0]);
          
        //TODO: Can this be accomplished without an explicit watch set on every user item?
        //Imagining poor performance with a select-all or select-none operation
        //What happens when a user is added?
        angular.forEach($scope.users, function(user) {
          $scope.$watch(function() {return user.checked;}, function(newValue, oldValue) {
            $scope.checkedUsers = filterFilter($scope.users, {'checked' : true})
          });
        });
      }
    });
    
  	$scope.selectAll = function(){
  	  angular.forEach($scope.users, function(user) {
        user.checked = true;
      });
  	}
  	
  	$scope.selectNone = function(){
  	  angular.forEach($scope.users, function(user) {
        user.checked = false;
      });
  	}
  	
  	$scope.searchUser = function (user) {
      if (!$scope.queryUser){
        return true;
      }
      var wildCardQuery = new RegExp($scope.regExpReplace($scope.queryUser), 'i');

      // Search by displayName and location; location not defined yet
      // return (wildCardQuery.test(user.firstName + ' ' + user.lastName) || wildCardQuery.test(user.location));
      return (wildCardQuery.test(user.firstName + ' ' + user.lastName));
    };

    $scope.regExpReplace = function(string){
      // Allow all characters in user search, use * as wildcard
      string.replace(/([.+?^=!:${}()|\[\]\/\\])/g, '\\$1');
      return string.replace(/([*])/g, '.*');
    };
  	
    $scope.showModalSection = function(){
    	$scope.showModal = true;
    }

    $scope.saveUser = function(data, userId) {
      userId = userId || null;

      if (!userId){ // if userId is null
        data.createdBy = Session.id;
        $scope.createUser(data);
      } else {
        data.updatedBy = Session.id;
        $scope.updateUser(userId, data);
      }

    }

  	$scope.createUser = function(data){
      UserService.save(data)
        .$promise.then(
          $scope.successResponse,
          $scope.errorResponse
        );
    }

    $scope.updateUser = function(userId, data){
      UserService.update( { id:userId }, data)
        .$promise.then(
          $scope.successResponse,
          $scope.errorResponse
        );
    }

    $scope.enableChecked = function(){
      angular.forEach($scope.checkedUsers, function(user) {
        $scope.saveUser({'status' : true}, user.id)
        user.status = true;
      });
    }
    
    $scope.disableChecked = function(){
      angular.forEach($scope.checkedUsers, function(user) {
        $scope.saveUser({'status' : false}, user.id)
        user.status = false;
      });
    }

    $scope.successResponse = function(data) {
      $scope.showError = false;
      $scope.showModal = false;
    }

    $scope.errorResponse = function(data) {
      $scope.showError = true;
      $scope.errorMsg = data.statusText;
    }
  }]);
