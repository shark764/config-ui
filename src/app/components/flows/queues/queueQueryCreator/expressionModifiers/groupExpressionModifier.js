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
          var andList, operationList, groupSet;
          if(this.parentMap.exists(this.keyword) &&
            (andList = this.parentMap.at(this.keyword)).val.length > 1) {
            
            var groupSet;
            for(var andListIndex = 1; andListIndex < andList.val.length; andListIndex++) {
              if(andList.val[andListIndex].val.length > 1 &&
                andList.val[andListIndex].val[0] === this.operator) {
                groupSet = andList.val[andListIndex].val[1];
              }
            }
            
            if(!groupSet) {
              return;
            }
              
            var options = this.options
            if(angular.isFunction(this.options)) {
              options = options.call(options);
            }
            
            for(var groupSetIndex = 0; groupSetIndex < groupSet.val.length; groupSetIndex++) {
              for(var optionIndex = 0; optionIndex < options.length; optionIndex++) {
                if(groupSet.val[groupSetIndex] === options[optionIndex].id) {
                  operands.push(options[optionIndex]);
                }
              }
            }
          }
          
          return operands;
        }
        
        GroupExpressionModifier.prototype.add = function(item) {
          if(this.parentMap.exists(this.keyword) &&
            (andList = this.parentMap.at(this.keyword)).val.length > 1) {
            
            var groupSet;
            for(var andListIndex = 1; andListIndex < andList.val.length; andListIndex++) {
              if(andList.val[andListIndex].val.length &&
                andList.val[andListIndex].val[0] === this.operator) {
                groupSet = andList.val[andListIndex].val[1];
              }
            }
            
            if(!groupSet) {
              var groupSet = new jsedn.Set([item.id]);
              var operationList = new jsedn.List([this.operator, groupSet]);
              andList.val.push(operationList);
            } else {
              groupSet.val.push(item.id);
            }
          } else {
            var groupSet = new jsedn.Set([item.id]);
            var operationList = new jsedn.List([this.operator, groupSet]);
            var andList = new jsedn.List([jsedn.sym('and'), operationList]);
            
            this.parentMap.set(jsedn.kw(this.keyword), andList);
          }
        };

        GroupExpressionModifier.prototype.remove = function(item) {
          var andList;
          if(this.parentMap.exists(this.keyword) &&
            (andList = this.parentMap.at(this.keyword)).val.length > 1) {
            
            var groupSet;
            for(var andListIndex = 1; andListIndex < andList.val.length; andListIndex++) {
              if(andList.val[andListIndex].val.length &&
                andList.val[andListIndex].val[0] === this.operator) {
                groupSet = andList.val[andListIndex].val[1];
                
                groupSet.val.removeItem(item.id);
                
                if(groupSet.val.length === 0) {
                  andList.val.splice(andListIndex, 1);
                  
                  if(andList.val.length <= 1) {
                    this.parentMap.remove(this.keyword);
                  }
                }
              }
            }
          }
        };
        
        return GroupExpressionModifier;
      }
    ]);
