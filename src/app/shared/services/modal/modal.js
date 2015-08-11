'use strict';

angular.module('liveopsConfigPanel')
  .service('Modal', ['$document', '$rootScope', '$compile', '$q', function ($document, $rootScope, $compile, $q) {
    var self = this;
    
    this.showConfirm = function(config){
      var defaults = {
        title: '',
        message: '',
        okCallback: angular.noop,
        cancelCallback: angular.noop
      };
      
      var deferred = $q.defer();
      
      var options = angular.extend(defaults, config);
      var newScope = $rootScope.$new();
      
      //Set scope properties for the template to use
      newScope.modalBody = 'app/shared/services/modal/confirmModal.html';
      newScope.title = options.title;
      newScope.message = options.message;
      newScope.okCallback = function(){
        self.close();
        deferred.resolve('true');
        options.okCallback();
      };
      newScope.cancelCallback = function(){
        self.close();
        deferred.reject('false');
        options.cancelCallback();
      };
      
      var element = $compile('<modal></modal>')(newScope);
      $document.find('body').append(element);
      
      return deferred.promise;
    };
    
    this.close = function(){
      $document.find('modal').remove();
    };
  }]);