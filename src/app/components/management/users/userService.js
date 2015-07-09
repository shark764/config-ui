'use strict';

angular.module('liveopsConfigPanel')
  .factory('User', ['LiveopsResourceFactory', function (LiveopsResourceFactory) {
      var User = LiveopsResourceFactory.create('/v1/users/:id', [
        {name: 'firstName'},
        {name: 'lastName'},
        {name: 'role', optional: true},
        {name: 'displayName'},
        {name: 'status'},
        {name: 'password'},
        {name: 'externalId', optional: true},
        {name: 'personalTelephone', optional: true}
      ]);
      
      User.prototype.fullName = function(){
        if (this.firstName){
          return this.firstName + ' ' + this.lastName;
        } else if (this.displayName){
          return this.displayName;
        } else {
          return '';
        }
      };
      
      return User;
  }]);
