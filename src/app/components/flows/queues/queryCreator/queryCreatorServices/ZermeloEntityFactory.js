(function () {
  'use strict';

  angular
    .module('liveopsConfigPanel')
    .provider('ZermeloEntityFactory', EDNEntityFactory)

    function ZermelloEntityFactory(jsedn) {

      this.$get = function () {

        function queryFactory() {
          function Query() {
            this.map = new jsedn.Map();
          }

          Query.prototype.addGroup = function (objectGroup) {
            this.map.set(objectGroup.pair.key, objectGroup.pair.value);
          };

          Query.prototype.removeGroup = function (objectGroup) {
            this.map.remove(objectGroup.pair.key);
          };

          return Query;
        }

        function objectGroupFactory(objectName) {
          function ObjectGroup() {
            this.keyword = jsedn.Keyword(objectName);
            this.orList = jsedn.List([new jsedn.sym('or')]);
            this.andList = jsedn.List([new jsedn.sym('and')]);
            this.list = jsedn.List([new jsedn.sym('and')]);
            this.pair = jsedn.Pair(this.keyword, this.list);
          }

          ObjectGroup.prototype.addOrCondition = function (condition) {
            this.orList.val.push(condition.map);
          };

          ObjectGroup.prototype.addAndCondition = function (condition) {
            this.andList.val.push(condition.map);
          };

          ObjectGroup.prototype.removeOrCondition = function (condition) {
            var i = this.orList.val.indexOf(condition.map);
            this.orList.splice(i, 1);
          };

          ObjectGroup.prototype.removeAndCondition = function (condition) {
            var i = this.andList.val.indexOf(condition.map);
            this.orList.splice(i, 1);
          };

          return ObjectGroup;
        }

        function ConditioFactory(type) {
          function Condition(val) {
            this.filter = new jsedn.List();
            this.map = new jsedn.Map([new jsedn.Tagged(new jsedn.Tag(type), val), this.filter]);
          }

          Condition.prototype.setFilter = function () {
            if(arguments.legnth === 1) {
              this.filter.val = [arguments]
            } else {
              this.filter.val = [new jsedn.sym(arugments[0]), arguments[1]];
            }
          };
        };


        return {
          query: queryFactory,
          objectGroup: objectGroupFactory,
          condition: conditionFactory
        };
      };


    };

})();
