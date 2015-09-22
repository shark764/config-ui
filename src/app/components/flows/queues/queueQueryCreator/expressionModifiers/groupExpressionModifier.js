'use strict';

angular.module('liveopsConfigPanel')
  .service('GroupExpressionModifier', ['jsedn',
      function (jsedn) {
        var GroupExpressionModifier = function(parentMap, params) {
          this.parentMap = parentMap;
          this.keyword = jsedn.kw(params.keyword);
          this.operator = jsedn.sym(params.operator);
          
          this.options = params.options;
          this.labelKey = params.labelKey;
          this.placeholderKey = params.placeholderKey;
          this.template = params.template;
        };
        
        GroupExpressionModifier.prototype.operands = function() {
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
        
        GroupExpressionModifier.prototype.add = function(item) {
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
            
            this.parentMap.set(jsedn.kw(this.keyword), map);
          }
        };

        GroupExpressionModifier.prototype.remove = function(item) {
          if(this.parentMap.exists(this.keyword)) {
            if(this.parentMap.at(this.keyword).exists(jsedn.sym(this.operator))) {
              var set = this.parentMap.at(this.keyword).at(jsedn.sym(this.operator))
              set.val.removeItem(item.id);
              
              if(set.val.length === 0) {
                this.parentMap.remove(this.keyword);
              }
            }
          }
        };
        
        return GroupExpressionModifier;
      }
    ]);
