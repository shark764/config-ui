(function () {
  'use strict';

  angular
    .module('liveopsConfigPanel')
    .factory('ZermeloConditionGroup', function (jsedn, ZermeloCondition ) {

      function ConditionGroup(operator) {
        this.operator = operator;
        this.conditions = [];
      };

      ConditionGroup.prototype.getConditionIdentifiers = function () {
        var ids = [];

        for(var i = 0; i < this.conditions.length; i++) {
          ids.push(this.conditions[i].identifier);
        }

        return ids;
      };

      ConditionGroup.prototype.addCondition = function (condition) {
        this.conditions.push(condition);
      };

      ConditionGroup.prototype.removeCondition = function (condition) {
        this.conditions.splice(this.conditions.indexOf(condition), 1);
      };

      ConditionGroup.prototype.toEdn = function () {
        var list = new jsedn.List([new jsedn.sym(this.operator)]);

        for (var i = 0; i < this.conditions.length; i++) {
          var condition = this.conditions[i].toEdn();

          if(condition) {
            list.val.push(condition);
          }
        }

        return list.val.length > 1 ? list : null;
      };

      ConditionGroup.fromEdn = function (edn) {
        if(edn instanceof jsedn.List) {
          var conditionGroup = new ConditionGroup();

          conditionGroup.operator = edn.at(0).val;

          for(var i = 1; i < edn.val.length; i++) {
            conditionGroup.conditions.push(ZermeloCondition.fromEdn(edn.val[i]));
          }

          return conditionGroup;
        }

        return null;
      };

      return ConditionGroup;
    });

})();
