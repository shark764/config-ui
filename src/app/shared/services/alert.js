'use strict';

angular.module('liveopsConfigPanel')
  .service('Alert', ['toastr', '$window', function (toastr, $window) {
    this.confirm = function(message, onOk, onCancel){
      if ($window.confirm(message)){
        if (onOk){
          onOk();
        }
      } else {
        if (onCancel){
          onCancel();
        }
      }
    };
    
    this.warning = function(){
      toastr.warning.apply(this, arguments);
    };
    
    this.success = function(){
      toastr.success.apply(this, arguments);
    };
    
    this.error = function(){
      toastr.error.apply(this, arguments);
    };
  }]);