'use strict';

angular.module('liveopsConfigPanel')
  .service('UserPermissions', ['Session', '$state', '$q', '$timeout', function (Session, $state, $q, $timeout) {
      var self = this;
    
      this.hasPermission = function(permissionKey){
        var permissions = [];
        permissions.push.apply(permissions, Session.platformPermissions);
        permissions.push.apply(permissions, Session.tenant.tenantPermissions);
        
        for (var i = 0; i < permissions.length; i++){
          //TODO: remove testing conditional :)
          if (permissionKey === 'VIEW_ALL_FLOWS' || permissionKey === 'MAP_ALL_CONTACT_POINTS' || permissionKey === 'MANAGE_ALL_FLOWS' || permissionKey === 'MANAGE_ALL_QUEUES'){
            return false;
          }
          
          if (permissions[i] === permissionKey){
            return true;
          }
        }
        
        return false;
      };
      
      this.hasPermissionInList = function(permissionList){
        for (var i = 0; i < permissionList.length; i++){
          if (this.hasPermission(permissionList[i])){
            return true;
          }
        }
        
        return false;
      };
      
      this.resolvePermissions = function(permissionList){
        var deferred = $q.defer();
        
        $timeout(function(){
          if (! self.hasPermissionInList(permissionList)){
            $state.go('content.userprofile', {
              messageKey: 'permissions.unauthorized.message'
            }); 
            deferred.reject();
          } else {
            deferred.resolve();
          }
        });
        
        return deferred.promise;
      }
    }
  ]);
