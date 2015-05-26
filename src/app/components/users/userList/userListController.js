'use strict';

angular.module('liveopsConfigPanel')
  .controller('UserListController', ['$scope', 'Session', 'UserService', 'filterFilter', '$filter', '$document', function ($scope, Session, UserService, filterFilter, $filter, $document) {
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
      $scope.filteredUsers = $scope.users;
      $scope.selectedUserContext = {};

      if (data.result) {
        //Binding form to first result. Putting this in for now.
        $scope.selectUser(data.result[0]);
          
        //Watch the checked value for items in the users list, so we can autoupdate the checkedUsers list when needed
        angular.forEach($scope.users, function(user) {
          $scope.$watch(function() {return user.checked;}, function(newValue, oldValue) {
            $scope.checkedUsers = filterFilter($scope.filteredUsers, {'checked' : true})
          });
        });
        
        //Watch the search value so we can update the filteredUsers list which gets passed to the table directive
        $scope.$watch(function() {return $scope.queryUser}, function(newValue, oldValue) {
          $scope.filteredUsers = $filter('UserSearchFilter')($scope.users, $scope.queryUser);
        });
        
        //Watch for additions to the users list
        $scope.$watchCollection("users", function(newList, oldList) {
            if (newList < oldList){
              return;
            }
            
            var newItems = [];
            angular.forEach(newList, function(user) {
              if (oldList.indexOf(user) === -1) {
                newItems.push(user);
              }
            });
            
            //Add a watch to the new user(s) checked attribute
            angular.forEach(newItems, function(user) {
              $scope.$watch(function() {return user.checked;}, function(newValue, oldValue) {
                $scope.checkedUsers = filterFilter($scope.filteredUsers, {'checked' : true})
              });
            });
        });
      }
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
  	  angular.forEach($scope.users, function(user) {
        user.checked = true;
      });
  	}
  	
  	$scope.selectNone = function(){
  	  angular.forEach($scope.users, function(user) {
        user.checked = false;
      });
  	}
  	
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
  }])
  .filter('UserSearchFilter', function() {
   function regExpReplace(string){
      // Allow all characters in user search, use * as wildcard
      string.replace(/([.+?^=!:${}()|\[\]\/\\])/g, '\\$1');
      return string.replace(/([*])/g, '.*');
    };
    
    return function(users, query) {
      if (! query){
        return users;
      }
      
      var wildCardQuery = new RegExp(regExpReplace(query), 'i');

      var filtered = [];
      angular.forEach(users, function(user) {
        if ((wildCardQuery.test(user.firstName + ' ' + user.lastName))){
          filtered.push(user);
        } else {
          //Uncheck users that have been excluded by the search, so they are not included in batch operations:
          user.checked = false;
        }
      });

      return filtered;
    };
  });
