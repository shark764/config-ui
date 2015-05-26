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
  	  $scope.hasChecked = $scope.filteredUsers.length;
  	  angular.forEach($scope.filteredUsers, function(user) {
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
        if (user.checked && ! user.filtered){
          $scope.updateUser(user.id, {'status' : true});
          user.status = true;
        }
      });
    };
    
    $scope.disableChecked = function(){
      angular.forEach($scope.filteredUsers, function(user) {
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

    $scope.successResponse = function () {
      $scope.showError = false;
      $scope.showModal = false;
      // Updates the user list
      UserService.query(function (data) {
        $scope.users = data.result;
      });
      // Tells the children that it was successful in creating a user. (So the form can be cleared)
      $scope.$broadcast('createUser:success');
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
          $scope.$broadcast('userList:' + args.fieldName + ':save', data);
        }, function (data) {
          $scope.$broadcast('userList:' + args.fieldName + ':save:error', data);
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
          user.filtered = false; //TODO: What if it was also filtered somewhere else? This will clobber it.
          filtered.push(user);
        } else {
          user.filtered = true;
        }
      });

      return filtered;
    };
  });
