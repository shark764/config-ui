'use strict';

/* global localStorage: false */

angular.module('liveopsConfigPanel')
  .service('UUIDCache', ['$rootScope', 'uuidcacheKey', '$translate',
    function ($rootScope, sessionKey, uuidcacheKey, $translate) {
      this.items = {};
      var self = this;

      this.store = function () {
        localStorage.setItem(this.uuidcacheKey, JSON.stringify(self.items));
      };

      this.destroy = function () {
        this.items = {};

        localStorage.removeItem(this.uuidcacheKey);
      };

      this.restore = function () {
        angular.extend(this, JSON.parse(localStorage.getItem(uuidcacheKey)));
      };
      
      this.put = function(key, value){
        this.items[key] = value;
        this.store();
      };
      
      this.get = function(key){
        return this.items[key];
      }
      
      this.remove = function(key){
        delete items[key];
        this.store();
      };
      
      this.restore();
    }
  ]);
