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

      Condition.prototype.setFilter = function () {
        if(arguments.length === 1) {
          this.filter = arguments[0];
        }

        if(arguments.length === 2) {
          this.filter = [arguments[0], arguments[1]]
        }
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

          // jsedn seems to ignore the #uuid tag? will have to investigate
          // the library to find out why. most other things work fine.
          // for now, manually inject uuid
          condition.tag = 'uuid';
          condition.identifier = edn.keys[0];
          condition.filter = edn.vals[0];

          if(!angular.isString(condition.identifier)) {
            throw 'condition must start with #uuid';
          }

          if(condition.filter instanceof jsedn.List) {

            if(condition.filter.val.length !== 2) {
              throw 'condition filter must be exactly length 2 if it is a list';
            }

            condition.filter = [condition.filter.val[0].val, condition.filter.val[1]];

          } else if(condition.filter != true) {
            throw 'if condition filter is not a list, it must be true';
          }

          return condition;
        }

        return null;
      };

      return Condition;
    });

})();
