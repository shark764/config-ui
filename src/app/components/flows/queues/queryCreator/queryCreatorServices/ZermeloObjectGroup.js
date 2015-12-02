(function () {
  'use strict';

  angular
    .module('liveopsConfigPanel')
    .factory('ZermeloObjectGroup', function (jsedn, _, ZermeloConditionGroup) {
      function ObjectGroup() {
        this.andConditions = new ZermeloConditionGroup('and');
        this.orConditions = new ZermeloConditionGroup('or');
      }

      ObjectGroup.prototype.toEdn = function () {
        var list = new jsedn.List([new jsedn.sym('and')]),
            conditionGroups = [this.andConditions, this.orConditions];

        for (var i = 0; i < conditionGroups.length; i++) {
          var conditionGroup = conditionGroups[i].toEdn();

          if(conditionGroup) {
            list.val.push(conditionGroup);
          }
        }

        return list.val.length > 1 ? list : null;
      };

      ObjectGroup.fromEdn = function (list) {
        if(list instanceof jsedn.List) {
            var og = new ObjectGroup();

            list.map(function (i) {
              if(i instanceof jsedn.List) {
                switch (i.at(0).val) {
                  case 'and':
                    og.andConditions = ZermeloConditionGroup.fromEdn(i);
                    break;
                  case 'or':
                    og.orConditions = ZermeloConditionGroup.fromEdn(i);
                    break;
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
