'use strict';

angular.module('liveopsConfigPanel')
  .service('Modal', ['$document', '$rootScope', '$compile', function ($document, $rootScope, $compile) {
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
      newScope.okCallback = options.okCallback;
      newScope.cancelCallback = options.cancelCallback;
      
      var element = $compile('<modal><div><h3>{{title}}</h3><p>{{message}}</p><a class="btn" ng-click="cancelCallback()">Cancel</a><a ng-click="okCallback()" class="btn btn-primary">Ok</a></div></modal>')(newScope);
      $document.find('body').append(element);
    };
    
    this.close = function(){
      $document.find('modal').remove();
    };
  }]);