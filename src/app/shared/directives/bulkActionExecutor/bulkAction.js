'use strict';

angular.module('liveopsConfigPanel')
  .service('BulkAction', [
    function () {
      var BulkAction = function() {
        this.checked = false;
      };
      
      BulkAction.prototype.execute = function() {
      };
      
      BulkAction.prototype.canExecute = function() {
        return true;
      };
      
      return BulkAction;
    }
  ]);