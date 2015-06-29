'use strict';

/* global localStorage: false */

angular.module('liveopsConfigPanel')
  .service('UUIDCache', ['$rootScope', 'uuidcacheKey',
    function ($rootScope, uuidcacheKey) {
      this.items = {};
      var self = this;

      this.store = function () {
        localStorage.setItem(uuidcacheKey, JSON.stringify(self.items));
      };

      this.destroy = function () {
        this.items = {};

        localStorage.removeItem(uuidcacheKey);
      };

      this.restore = function () {
        angular.extend(self.items, JSON.parse(localStorage.getItem(uuidcacheKey)));
      };

      this.put = function(key, value){
        this.items[key] = value;
        this.store();
      };

      this.get = function(key){
        return this.items[key];
      };

      this.remove = function(key){
        delete this.items[key];
        this.store();
      };

      this.restore();
    }
  ]);
