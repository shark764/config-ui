'use strict';

angular.module('liveopsConfigPanel')
  .service('Chain', ['$cacheFactory', function ($cacheFactory) {
    $cacheFactory('chains');
    
    var Chain = function(name) {
      this.name = name;
    };
    
    Chain.get = function(name) {
      var chains = $cacheFactory.get('chains');
      
      if(!chains.get(name)) {
        chains.put(name, []);
      }
      
      return new Chain(name);
    };
    
    Chain.prototype.register = function(id, callback, priority) {
      var chains = $cacheFactory.get('chains');
      var callbacks = chains.get(this.name);
      callbacks.push({
        id: id,
        callback: callback,
        priority: priority
      });
    };
    
    Chain.prototype.execute = function(param) {
      var chains = $cacheFactory.get('chains');
      var chain = chains.get(this.name);
      
      var promise;
      angular.forEach(chain, function (link) {
        if (promise) {
          if (angular.isFunction(link.callback)) {
            promise.then(link.callback);
          } else if (angular.isObject(link.callback)) {
            promise.then(
              link.callback.success,
              link.callback.failure);
          }
        } else {
          promise = link.callback(param);
        }
      });
    };
    
    return Chain;
  }]);