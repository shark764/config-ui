'use strict';

angular.module('liveopsConfigPanel')
  .service('Modal', ['$document', '$rootScope', '$compile', function ($document, $rootScope, $compile) {
    var self = this;
    
    this.showConfirm = function(config){
      var defaults = {
        title: '',
        message: '',
        okCallback: angular.noop,
        cancelCallback: angular.noop
      };
      
      var options = angular.extend(defaults, config);
      var newScope = $rootScope.$new();
      
      //Set scope properties for the template to use
      newScope.modalBody = 'app/shared/services/modal/confirmModal.html';
      newScope.title = options.title;
      newScope.message = options.message;
      newScope.okCallback = function(){
        self.close();
        options.okCallback();
      };
      newScope.cancelCallback = function(){
        self.close();
        options.cancelCallback();
      };
      
      var element = $compile('<modal></modal>')(newScope);
      $document.find('body').append(element);
    };
    
    this.close = function(){
      $document.find('modal').remove();
    };
  }]);