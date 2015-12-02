(function () {
  'use strict';

  angular
    .module('liveopsConfigPanel')
    .factory('ZermeloQuery', function ($rootScope, _, ZermeloObjectGroup) {
      function Query() {
        this.groups = {};
      }

      Query.prototype.addGroup = function (key, objectGroup) {
        this.groups[key] = objectGroup;
      };

      Query.prototype.removeGroup = function (key) {
        delete this.groups[key];
      };

      Query.prototype.toEdn = function () {
        var map = new jsedn.Map();

        for(var key in this.groups) {
          var group = this.groups[key],
              list = group.toEdn();

          if(list) {
            map.set(new jsedn.Keyword(key), list);
          }
        };

        return map;
      };

      Query.fromEdn = function (map) {
        if(map instanceof jsedn.Map) {
          var query = new Query(),
              keys = map.keys;

          for(var i = 0; i < keys.length; i++) {
            var key = keys[i];
            query.addGroup(key, ZermeloObjectGroup.fromEdn(map.at(key)));
          }

          return query;
        }

        return null;
      };

      return Query;
    });

})();
