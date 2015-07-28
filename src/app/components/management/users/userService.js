'use strict';

angular.module('liveopsConfigPanel')
  .factory('User', ['LiveopsResourceFactory',
    function (LiveopsResourceFactory) {
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
      
      User.prototype.getDisplay = function(){
        if (this.firstName || this.lastName){
          var name = (this.firstName ? this.firstName : '') + ' ' + (this.lastName ? this.lastName : '');
          return name.trim();
        } else if (this.displayName){
          return this.displayName;
        } else {
          return '';
        }
      };
      
      User.resourceName = 'User';
      
      return User;
  }]);
