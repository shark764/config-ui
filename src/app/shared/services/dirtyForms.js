'use strict';

angular.module('liveopsConfigPanel')
  .service('DirtyForms', ['Alert', function (Alert) {
    var self = this;
    this.forms = [];
    
    this.hasDirty = function(){
      var hasDirty = false;
      angular.forEach(self.forms, function(form){
        if (form.$dirty){
          hasDirty = true;
        }
      });
      
      return hasDirty;
    };
    
    this.registerForm = function(form){
      self.forms.push(form);
    };
    
    this.removeForm = function(form){
      self.forms.removeItem(form);
    };
    
    this.confirmIfDirty = function(actionFunction){
      if (self.hasDirty()){
        Alert.confirm('You have unsaved changes! Click OK to discard, or cancel to continue editing.',
          actionFunction,
          angular.noop);
      } else {
        actionFunction();
      }
    };
  }]);