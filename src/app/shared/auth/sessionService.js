'use strict';

angular.module('liveopsConfigPanel')
    .service('sessionService', function () {
      this.create = function (token) {
        this.token = token;
      };
      this.destroy = function () {
        this.token = null;
      };
    })