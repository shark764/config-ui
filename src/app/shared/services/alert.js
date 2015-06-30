'use strict';

angular.module('liveopsConfigPanel')
  .service('Alert', ['toastr', function (toastr) {
    this.confirm = function(message, onOk, onCancel){
      if (window.confirm(message)){
        onOk();
      } else {
        onCancel();
      }
    };
    
    this.warning = function(){
      toastr.warning.apply(this, arguments);
    };
    
    this.success = function(){
      toastr.success.apply(this, arguments);
    };
  }]);