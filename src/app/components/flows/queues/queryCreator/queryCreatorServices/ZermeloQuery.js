(function () {
  'use strict';

  angular
    .module('liveopsConfigPanel')
    .factory('ZermeloQuery', function ($rootScope, _, ZermeloObjectGroup, jsedn) {

      var ALLOWED_KEYS = [':groups', ':skills'];

      function Query() {
        this.groups = [];
        this.afterSecondsInQueue = null;
      }

      Query.prototype.getGroup = function (key) {
        return _.findWhere(this.groups, {key: key});
      };

      Query.prototype.setGroup = function (key, objectGroup) {
        this.groups.push({
          key: key,
          objectGroup: objectGroup
        });
      };

      Query.prototype.removeGroup = function (key) {
        this.groups = _.filter(this.groups, function (item) {
          return item.key !== key;
        });
      };

      Query.prototype.toEdn = function (allowEmpty) {
        var map = new jsedn.Map();

        for (var i = 0; i < this.groups.length; i++) {
          var group = this.groups[i],
              key = group.key,
              list = group.objectGroup.toEdn(allowEmpty);

          if(allowEmpty || list) {
            map.set(new jsedn.Keyword(key), list);
          }

          if(this.afterSecondsInQueue) {
            map.set(new jsedn.Keyword(':afterSecondsInQueue'), this.afterSecondsInQueue);
          }
        }

        return map;
      };

      Query.fromEdn = function (map) {
        if (angular.isString(map)) {
          map = jsedn.parse(map);
        }

        if(map instanceof jsedn.Map) {
          var query = new Query(),
              keys = map.keys;

          for(var i = 0; i < keys.length; i++) {
            var key = keys[i];

            if(key.val === ':afterSecondsInQueue') {
              query.afterSecondsInQueue = map[key];
            } else if (_.includes(ALLOWED_KEYS, key.val)) {
              query.setGroup(key.val, ZermeloObjectGroup.fromEdn(map.at(key)));
            } else {
              throw 'invalid key in query; must be :afterSecondsInQueue OR in ' + angular.toJson(ALLOWED_KEYS);
            }
          }

          return query;
        }

        return null;
      };

      return Query;
    });

})();
