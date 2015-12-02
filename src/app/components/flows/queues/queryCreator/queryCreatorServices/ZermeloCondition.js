(function () {
  'use strict';

  angular
    .module('liveopsConfigPanel')
    .factory('ZermeloCondition', function ($rootScope, jsedn) {
      function Condition(tag, identifier) {
        this.tag = tag;
        this.identifier = identifier;
        this.filter = null;
      };

      Condition.prototype.toEdn = function () {
        var ednFilter = this.filter instanceof Array ?
          new jsedn.List([new jsedn.sym(this.filter[0]), this.filter[1]]) :
          this.filter;

        return new jsedn.Map([new jsedn.Tagged(new jsedn.Tag(this.tag), this.identifier), ednFilter]);
      };

      Condition.fromEdn = function (edn) {
        if(edn instanceof jsedn.Map) {
          var condition = new Condition();

          // jsedn requires at least two elements for a valid tag; and
          // throws away invalid tags; we have to manually inject it
          condition.tag = 'uuid';
          condition.identifier = edn.keys[0];
          condition.filter = edn.vals[0];

          if(condition.filter instanceof jsedn.List) {
            condition.filter = [condition.filter.val[0].val, condition.filter.val[1].val];
          }

          return condition;
        }

        return null;
      };

      return Condition;
    });

})();
