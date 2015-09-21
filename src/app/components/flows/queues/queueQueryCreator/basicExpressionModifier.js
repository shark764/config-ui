'use strict';

angular.module('liveopsConfigPanel')
  .service('BasicExpressionModifier', ['jsedn',
      function (jsedn) {
        var BasicExpressionModifier = function(parentMap, params) {
          this.parentMap = parentMap;
          this.keyword = params.keyword;
          this.operator = params.operator;
          
          this.options = params.options;
          this.labelKey = params.labelKey;
          this.placeholderKey = params.placeholderKey;
        };
        
        BasicExpressionModifier.prototype.operands = function() {
          var operands = [];
          if(this.parentMap.exists(this.keyword)) {
            if(this.parentMap.at(this.keyword).exists(this.operator)) {
              var set = this.parentMap.at(this.keyword).at(this.operator)
              
              for(var setIndex = 0; setIndex < set.length; setIndex++) {
                for(var optionIndex = 0; optionIndex < this.options.length; optionIndex++) {
                  if(set[setIndex] === this.options[optionIndex].id) {
                    operands.push(this.options[optionIndex]);
                  }
                }
              }
            }
          }
          
          return operands;
        }
        
        BasicExpressionModifier.prototype.add = function(item) {
          if(this.parentMap.exists(this.keyword)) {
            if(this.parentMap.at(this.keyword).exists(this.operator)) {
              var set = this.parentMap.at(this.keyword).at(this.operator)
              set.push(jsedn.sym(item.id));
            } else {
              var set = new jsedn.Set([jsedn.sym(item.id)]);
              var map = new jsedn.Map(jsedn.sym(this.operator), set);
              
              this.parentMap.at(this.keyword).set(map);
            }
          } else {
            var set = new jsedn.Set([item.id]);
            var map = new jsedn.Map(jsedn.sym(this.operator), set);
            
            this.parentMap.set(this.keyword, map);
          }
        };

        BasicExpressionModifier.prototype.remove = function(item) {
          if(this.parentMap.exists(this.keyword)) {
            if(this.parentMap.at(this.keyword).exists(this.operator)) {
              var set = this.parentMap.at(this.keyword).at(this.operator)
              set.removeItem(jsedn.sym(item.id));
            }
          }
        };
        
        return BasicExpressionModifier;
      }
    ]);
