'use strict';

angular.module('liveopsConfigPanel')
  .controller('UserListController', ['$scope', 'Session', 'UserService', 'filterFilter', '$filter', function ($scope, Session, UserService, filterFilter, $filter) {
    $scope.showModal = false;
    $scope.showError = false;
    $scope.errorMsg = 'Input required data';
    
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
      $scope.filteredUsers = $scope.users;
      $scope.selectedUserContext = {};

      if (data.result) {
        // Watch the search value so we can update the filteredUsers list which
        // gets passed to the table directive
        $scope.$watch(function() {return $scope.queryUser;}, function() {
          $scope.filteredUsers = $filter('UserSearchFilter')($scope.users, $scope.queryUser);
        });
        
        //Watch for changes to filteredUsers that are caused by searching.
        $scope.$watchCollection('filteredUsers', function(newList) {
          angular.forEach($scope.users, function(user) {
            if (newList.indexOf(user) === -1) {
              user.filtered = true;
              if (user.checked) {
                user.checked = false;
                $scope.hasChecked = $scope.hasChecked > 0 ? $scope.hasChecked - 1 : 0;
              }
            } else {
              user.filtered = false;
            }
          });
        });
      }
  	});

    $scope.$on('userTable:user:selected', function (event, selectedUser) {
      $scope.selectedUser = selectedUser;
      $scope.$broadcast('userList:user:selected', selectedUser);
    });
    
    $scope.hasChecked = 0;
    $scope.$on('userList:user:checked', function () {
      $scope.hasChecked++;
    });
    
    $scope.$on('userList:user:unchecked', function () {
      $scope.hasChecked = $scope.hasChecked > 0 ? $scope.hasChecked - 1 : 0;
    });
    
  	$scope.selectOptions = [{
    	  label : 'All',
    	  onClick : function(){
    	      $scope.selectAll();
    	  }
    	}, 
    	{
    	 label : 'None',
       onClick : function(){
         $scope.selectNone();
        }
    }];
  	
  	$scope.selectAll = function(){
  	  $scope.hasChecked = $scope.users.length;
  	  angular.forEach($scope.users, function(user) {
  	    if (!user.filtered){
  	      user.checked = true;
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
      angular.forEach($scope.filteredUsers, function(user) {
        if (user.checked){
          $scope.saveUser({'status' : true}, user.id);
          user.status = true;
        }
      });
    };
    
    $scope.disableChecked = function(){
      angular.forEach($scope.filteredUsers, function(user) {
        if (user.checked){
          $scope.saveUser({'status' : false}, user.id);
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

    $scope.saveUser = function (data, userId) {
      userId = userId || null;

      if (!userId) { // if userId is null
        data.createdBy = Session.id;
        $scope.createUser(data)
          .then(
            $scope.successResponse,
            $scope.errorResponse);
      } else {
        data.updatedBy = Session.id;
        $scope.updateUser(userId, data)
          .then(
            $scope.successResponse,
            $scope.errorResponse);
      }
    };

    $scope.createUser = function (data) {
      return UserService.save(data).$promise;
    };

    $scope.updateUser = function (userId, data) {
      return UserService.update({
        id: userId
      }, data).$promise;
    };
    
    $scope.$on('editField:save', function (event, args) {
      var saveObject = {};
      saveObject.updatedBy = '1c838030-f772-11e4-ac37-45b2e1245d4b';
      saveObject[args.fieldName] = args.fieldValue;

      $scope.updateUser(args.objectId, saveObject)
        .then(function (data) {
          $scope.$broadcast('userList:' + args.fieldName + ':save', data);
        }, function (data) {
          $scope.$broadcast('userList:' + args.fieldName + ':save:error', data);
        });
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
          user.filtered = false;
          filtered.push(user);
        } else {
          user.filtered = true;
        }
      });

      return filtered;
    };
  });