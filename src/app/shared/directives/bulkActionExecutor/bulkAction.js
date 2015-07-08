'use strict';

angular.module('liveopsConfigPanel')
  .service('BulkAction', [
    function () {
      var BulkAction = function(title, action) {
        this.action = action;
        this.checked = false;
      };
      
      return BulkAction;
    }
  ]);