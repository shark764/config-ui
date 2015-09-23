'use strict';

angular.module('liveopsConfigPanel')
  .service('SkillExpressionModifier', ['jsedn',
      function (jsedn) {
        var operatorMap = {
          gt: '>',
          lt: '<',
          equal: '='
        }
        
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
          
          var andList;
          if(!this.parentMap.exists(this.keyword) ||
            (andList = this.parentMap.at(this.keyword)).val.length <= 1) {
            return;
          }
            
          var operationList;
          for(var andListIndex = 1; andListIndex < andList.val.length; andListIndex++) {
            if(andList.val[andListIndex].val.length > 1 &&
              andList.val[andListIndex].val[0] === this.operator) {
              operationList = andList.val[andListIndex];
              break;
            }
          }
          
          if(!operationList) {
            return;
          }
          
          for(var operationListIndex = 1; operationListIndex < operationList.val.length; operationListIndex++) {
            var skillMap = operationList.val[operationListIndex];
            
            var skillKeyword = skillMap.keys[0];
            skillKeyword.id = skillKeyword.val.substring(1, skillKeyword.length);
            
            var skillExpression = skillMap.vals[0];
            
            var options = this.options
            if(angular.isFunction(this.options)) {
              options = options.call(options);
            }
            
            for(var optionIndex = 0; optionIndex < options.length; optionIndex++) {
              if(skillKeyword.id === options[optionIndex].id) {
                if(options[optionIndex].hasProficiency) {
                  var skillOperator = skillExpression.at(0);
                  var skillOperand = skillExpression.at(1);
                
                  skillKeyword.display =
                    [options[optionIndex].name, skillOperator, skillOperand].join(' ');
                } else {
                  skillKeyword.display = options[optionIndex].name;
                }
                
                operands.push(skillKeyword);
                break;
              }
            }
          }
          
          return operands;
        }
        
        SkillExpressionModifier.prototype.add = function(item) {
          var andList;
          if(this.parentMap.exists(this.keyword) &&
            (andList = this.parentMap.at(this.keyword)).val.length > 1) {
              
            var operationList;
            for(var andListIndex = 1; andListIndex < andList.val.length; andListIndex++) {
              if(andList.val[andListIndex].val.length > 1 &&
                andList.val[andListIndex].val[0] === this.operator) {
                operationList = andList.val[andListIndex];
                break;
              }
            }
            
            if(!operationList || operationList.length <= 1) {
              if(item.hasProficiency) {
                var proficiencyOperator = jsedn.sym(operatorMap[item.proficiencyOperator]);
                var proficiencyList = new jsedn.List([proficiencyOperator, item.proficiency]);
                var skillProficiencyMap = new jsedn.Map([jsedn.kw(':' + item.id), proficiencyList]);
              } else {
                var skillProficiencyMap = new jsedn.Map([jsedn.kw(':' + item.id), true]);
              }
              
              var operationList = new jsedn.List([this.operator, skillProficiencyMap]);
              
              andList.val.push(operationList);
              return;
            }
            
            for(var operationListIndex = 1; operationListIndex < operationList.val.length; operationListIndex++) {
              var skillMap = operationList.val[operationListIndex];
              
              if(skillMap.exists(jsedn.kw(':' + item.id))) {
                return;
              }
            }
            
            if(item.hasProficiency) {
              var proficiencyOperator = jsedn.sym(operatorMap[item.proficiencyOperator]);
              var proficiencyList = new jsedn.List([proficiencyOperator, item.proficiency]);
              operationList.val.push(new jsedn.Map([jsedn.kw(':' + item.id), proficiencyList]));
            } else {
              operationList.val.push(new jsedn.Map([jsedn.kw(':' + item.id), true]));
            }
          } else {
            if(item.hasProficiency) {
              var proficiencyOperator = jsedn.sym(operatorMap[item.proficiencyOperator]);
              var proficiencyList = new jsedn.List([proficiencyOperator, item.proficiency]);
              var skillProficiencyMap = new jsedn.Map([jsedn.kw(':' + item.id), proficiencyList]);
            } else {
              var skillProficiencyMap = new jsedn.Map([jsedn.kw(':' + item.id), true]);
            }
            
            var operationList = new jsedn.List([this.operator, skillProficiencyMap]);
            var andList = new jsedn.List([jsedn.sym('and'), operationList]);
            
            this.parentMap.set(jsedn.kw(this.keyword), andList);
          }
        };

        SkillExpressionModifier.prototype.remove = function(operand) {
          var andList;
          if(this.parentMap.exists(this.keyword) &&
            (andList = this.parentMap.at(this.keyword)).val.length > 1) {
            
            var operationList;
            for(var andListIndex = 1; andListIndex < andList.val.length; andListIndex++) {
              if(andList.val[andListIndex].val.length > 1 &&
                andList.val[andListIndex].val[0] === this.operator) {
                operationList = andList.val[andListIndex];
                break;
              }
            }
            
            if(!operationList) {
              return;
            }
              
            for(var operationListIndex = 1; operationListIndex < operationList.val.length; operationListIndex++) {
              var skillMap = operationList.val[operationListIndex];
              
              if(skillMap.exists(jsedn.kw(':' + operand.id))) {
                operationList.val.splice(operationListIndex, 1);
                
                if(operationList.val.length <= 1) {
                  this.parentMap.remove(this.keyword);
                }
              }
            }
          }
        };
        
        return SkillExpressionModifier;
      }
    ]);
