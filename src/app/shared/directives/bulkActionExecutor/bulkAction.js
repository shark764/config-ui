'use strict';

angular.module('liveopsConfigPanel')
  .service('BulkAction', [
    function () {
      var BulkAction = function(title, execute, canExecute) {
        this.execute = execute;
        this.canExecute = canExecute;
        this.checked = false;
      };
      
      return BulkAction;
    }
  ]);