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
            if(this.parentMap.at(this.keyword).exists(jsedn.sym(this.operator))) {
              var set = this.parentMap.at(this.keyword).at(jsedn.sym(this.operator));
              
              for(var setIndex = 0; setIndex < set.val.length; setIndex++) {
                
                var options = this.options
                if(angular.isFunction(this.options)) {
                  options = options.call(options);
                }
                
                for(var optionIndex = 0; optionIndex < options.length; optionIndex++) {
                  if(set.val[setIndex] === options[optionIndex].id) {
                    operands.push(options[optionIndex]);
                  }
                }
              }
            }
          }
          
          return operands;
        }
        
        BasicExpressionModifier.prototype.add = function(item) {
          if(this.parentMap.exists(this.keyword)) {
            if(this.parentMap.at(this.keyword).exists(jsedn.sym(this.operator))) {
              var set = this.parentMap.at(this.keyword).at(jsedn.sym(this.operator))
              set.val.push(item.id);
            } else {
              var set = new jsedn.Set([item.id]);
              
              this.parentMap.at(this.keyword).set(jsedn.sym(this.operator), set);
            }
          } else {
            var set = new jsedn.Set([item.id]);
            var map = new jsedn.Map([jsedn.sym(this.operator), set]);
            
            this.parentMap.set(this.keyword, map);
          }
        };

        BasicExpressionModifier.prototype.remove = function(item) {
          if(this.parentMap.exists(this.keyword)) {
            if(this.parentMap.at(this.keyword).exists(jsedn.sym(this.operator))) {
              var set = this.parentMap.at(this.keyword).at(jsedn.sym(this.operator))
              set.val.removeItem(item.id);
            }
          }
        };
        
        return BasicExpressionModifier;
      }
    ]);
