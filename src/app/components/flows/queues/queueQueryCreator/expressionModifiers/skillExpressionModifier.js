'use strict';

var operatorMap = {
  gt: '>',
  lt: '<',
  equal: '='
}

angular.module('liveopsConfigPanel')
  .service('SkillExpressionModifier', ['jsedn',
      function (jsedn) {
        var SkillExpressionModifier = function(parentMap, params) {
          this.parentMap = parentMap;
          this.keyword = jsedn.kw(params.keyword);
          this.operator = jsedn.sym(params.operator);
          
          this.options = params.options;
          this.labelKey = params.labelKey;
          this.placeholderKey = params.placeholderKey;
          this.template = params.template;
        };
        
        //TODO add #uuid
        SkillExpressionModifier.prototype.operands = function() {
          var operands = [];
          
          if(this.parentMap.exists(this.keyword)) {
            var operatorList = this.parentMap.at(this.keyword);
            if(operatorList.val.length) {
              if(operatorList.val[0] !== this.operator) {
                return;
              }
              
              for(var operatorListIndex = 1; operatorListIndex < operatorList.val.length; operatorListIndex++) {
                
                var skillMap = operatorList.val[operatorListIndex];
                
                var skillKeyword = skillMap.keys[0].val;
                skillKeyword = skillKeyword.substring(1, skillKeyword.length);
                
                var skillExpression = skillMap.vals[0];
                
                var options = this.options
                if(angular.isFunction(this.options)) {
                  options = options.call(options);
                }
                
                for(var optionIndex = 0; optionIndex < options.length; optionIndex++) {
                  if(skillKeyword === options[optionIndex].id) {
                    var skillOperator = skillExpression.at(0);
                    var skillOperand = skillExpression.at(1);
                    operands.push([options[optionIndex].name, skillOperator, skillOperand].join(' '));
                    break;
                  }
                }
              }
            }
          }
          
          return operands;
        }
        
        SkillExpressionModifier.prototype.add = function(item) {
          if(this.parentMap.exists(this.keyword)) {
            if(this.parentMap.at(this.keyword).exists(this.operator)) {
              
            } else {
              
            }
          } else {
            var proficiencyList = new jsedn.List([operatorMap[item.proficiencyOperator], item.proficiency]);
            var skillProficiencyMap = new jsedn.Map([jsedn.kw(':' + item.id), proficiencyList]);
            var operationList = new jsedn.List([this.operator, skillProficiencyMap]);
            
            this.parentMap.set(this.keyword, operationList);
          }
        };

        SkillExpressionModifier.prototype.remove = function(item) {
          if(this.parentMap.exists(this.keyword)) {
            if(this.parentMap.at(this.keyword).exists(this.operator)) {
              var set = this.parentMap.at(this.keyword).at(this.operator)
              set.val.removeItem(item.id);
              
              if(set.val.length === 0) {
                this.parentMap.remove(this.keyword);
              }
            }
          }
        };
        
        return SkillExpressionModifier;
      }
    ]);
