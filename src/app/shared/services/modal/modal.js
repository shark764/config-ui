'use strict';

angular.module('liveopsConfigPanel')
  .service('Modal', ['$document', '$rootScope', '$compile', '$translate', function ($document, $rootScope, $compile, $translate) {
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
      
      var html = '<modal class="confirm"><div><h3 class="header">{{title}}</h3><p>{{message}}</p><div class="footer"><a id="modal-cancel" class="btn" ng-click="cancelCallback()">' +
        $translate.instant('value.cancel') + 
        '</a><a ng-click="okCallback()" class="btn btn-primary" id="modal-ok">' +
        $translate.instant('value.ok') + 
        '</a></div></div></modal>';
      
      var element = $compile(html)(newScope);
      $document.find('body').append(element);
    };
    
    this.close = function(){
      $document.find('modal').remove();
    };
  }]);