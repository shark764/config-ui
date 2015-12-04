(function () {
  'use strict';

  angular
    .module('liveopsConfigPanel')
    .factory('ZermeloObjectGroup', function (jsedn, _, ZermeloConditionGroup) {

      function ObjectGroup() {
        this.andConditions = new ZermeloConditionGroup('and');
        this.orConditions = new ZermeloConditionGroup('or');
      }

      ObjectGroup.prototype.toEdn = function (allowEmpty) {
        var list = new jsedn.List([new jsedn.sym('and')]),
            conditionGroups = [this.andConditions, this.orConditions];

        for (var i = 0; i < conditionGroups.length; i++) {
          var conditionGroup = conditionGroups[i].toEdn(allowEmpty);

          if(allowEmpty || conditionGroup) {
            list.val.push(conditionGroup);
          }
        }

        return list.val.length > 1 ? list : null;
      };

      ObjectGroup.fromEdn = function (list) {
        if(list instanceof jsedn.List) {
            var og = new ObjectGroup();

            if(list.val[0].val !== 'and') {
              throw new Exception('object group must start with and');
            }

            list.map(function (i) {
              if(i instanceof jsedn.List) {
                switch (i.at(0).val) {
                  case 'and':
                    og.andConditions = ZermeloConditionGroup.fromEdn(i);
                    break;
                  case 'or':
                    og.orConditions = ZermeloConditionGroup.fromEdn(i);
                    break;
                  default:
                    throw new Exception('condition group must start with \'and\' or \'or\'');
                }
              }
            });

            return og;
        }

        return null;
      };

      return ObjectGroup;
    });

})();
