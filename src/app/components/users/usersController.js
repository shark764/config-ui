'use strict';

angular.module('liveopsConfigPanel')
  .controller('UsersController', ['$scope', 'Session', 'UserService', 'filterFilter', '$filter', function ($scope, Session, UserService, filterFilter, $filter) {
    $scope.showModal = false;
    $scope.showError = false;
    $scope.errorMsg = 'Input required data';
    
    $scope.$on('userTable:user:selected', function (event, selectedUser) {
      $scope.selectedUser = selectedUser;
    });
    
  	UserService.query(function(data){
      $scope.users = data.result;
      $scope.$broadcast('user:selected', $scope.users[0]);
  	});
    
  	$scope.doSearchFilter = function(users){
  	  return $filter('UserSearchFilter')(users, $scope.queryUser);
  	};
    
    $scope.hasChecked = 0;
    function decreaseCheckedCount(){
      $scope.hasChecked = $scope.hasChecked > 0 ? $scope.hasChecked - 1 : 0;
    }
    
    $scope.decreaseCheckedCount = decreaseCheckedCount;
    
    $scope.$on('userList:user:checked', function () {
      $scope.hasChecked++;
    });
    
    $scope.$on('userList:user:unchecked', function () {
      decreaseCheckedCount();
    });
    
  	$scope.selectOptions = [
  	                        {label : 'All', onClick : function(){$scope.selectAll();}}, 
  	                        {label : 'None', onClick : function(){$scope.selectNone();}}
  	                       ];
  	
  	$scope.selectAll = function(){
  	  $scope.hasChecked = 0;
  	  angular.forEach($scope.users, function(user) {
  	    if (! user.filtered){
  	      user.checked = true;
  	      $scope.hasChecked++;
  	    }
      });
  	};
  	
  	$scope.selectNone = function(){
  	  $scope.hasChecked = 0;
  	  angular.forEach($scope.users, function(user) {
        user.checked = false;
      });
  	};
  	
  	$scope.enableChecked = function(){
      angular.forEach($scope.users, function(user) {
        if (user.checked && ! user.filtered){
          $scope.updateUser(user.id, {'status' : true});
          user.status = true;
        }
      });
    };
    
    $scope.disableChecked = function(){
      angular.forEach($scope.users, function(user) {
        if (user.checked && ! user.filtered){
          $scope.updateUser(user.id, {'status' : false});
          user.status = false;
        }
      });
    };
    
    $scope.showModalSection = function(){
    	$scope.showModal = true;
    };

    $scope.showModalSection = function () {
      $scope.showModal = true;
    };

    $scope.createUser = function (data) {
      return UserService.save(data).$promise;
    };

    $scope.updateUser = function (userId, data) {
      return UserService.update({
        id: userId
      }, data).$promise;
    };

    $scope.successResponse = function (data) {
      $scope.showError = false;
      $scope.showModal = false;
      // Updates the user list
      UserService.query(function (data) {
        $scope.users = data.result;
      });
      // Tells the children that it was successful in creating a user. (So the form can be cleared)
      $scope.$broadcast('createUser:success', data.result);
    };

    $scope.errorResponse = function (data) {
      $scope.showError = true;
      $scope.errorMsg = data.data.message;
    };
    
    $scope.$on('editField:save', function (event, args) {
      var saveObject = {};
      saveObject[args.fieldName] = args.fieldValue;

      $scope.updateUser(args.objectId, saveObject)
        .then(function (data) {
          $scope.$broadcast(args.fieldName + ':save', data);
        }, function (data) {
          $scope.$broadcast(args.fieldName + ':save:error', data);
      });
    });
    
    $scope.$on('createUser:save', function (event, args) {
      $scope.createUser(args.data)
        .then(
          $scope.successResponse,
          $scope.errorResponse
        );
    });
  }])
  .filter('UserSearchFilter', function() {
    function regExpReplace(string){
      // Allow all characters in user search, use * as wildcard
      string.replace(/([.+?^=!:${}()|\[\]\/\\])/g, '\\$1');
      return string.replace(/([*])/g, '.*');
    }
    
    return function(users, query) {
      if (! query){
        return users;
      }
      
      var wildCardQuery = new RegExp(regExpReplace(query), 'i');

      var filtered = [];
      angular.forEach(users, function(user) {
        if ((wildCardQuery.test(user.firstName + ' ' + user.lastName))){
          filtered.push(user);
        }
      });

      return filtered;
    };
  });
