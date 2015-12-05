(function () {
  'use strict';

  angular
    .module('liveopsConfigPanel')
    .factory('ZermeloQueryList', function (ZermeloQuery, jsedn) {

      function QueryList() {
        this.queries = [];
      }

      QueryList.prototype.addQuery = function (query) {
        this.queries.push(query);
      };

      QueryList.prototype.removeQuery = function (query) {
        this.queries.splice(this.queries.indexOf(query), 1);
      };

      QueryList.prototype.toEdn = function () {
        var list = new jsedn.List();

        for(var i = 0; i < this.queries.length; i++) {
          var query = this.queries[i],
              map = query.toEdn();

          if(map) {
            list.val.push(map);
          }
        }

        return list;
      };

      QueryList.fromEdn = function (edn) {
        if(edn instanceof jsedn.List) {
          var queryList = new QueryList();

          for(var i = 0; i < edn.val.length; i++) {
            queryList.addQuery(ZermeloQuery.fromEdn(edn.val[i]));
          }

          return queryList;
        }

        return null;
      };

      return QueryList;
    });

})();
