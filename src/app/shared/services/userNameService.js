'use strict';

angular.module('liveopsConfigPanel')
  .factory('UserName', ['LiveopsResourceFactory', function (LiveopsResourceFactory) {
    var Service = LiveopsResourceFactory.create('/v1/users/:id');
    Service.prototype.get = function (params, success, failure) {
      //caching logic
      return this.$get(params, success, failure)
    }
  }]);

