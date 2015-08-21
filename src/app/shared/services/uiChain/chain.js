'use strict';

angular.module('liveopsConfigPanel')
  .service('Chain', ['$cacheFactory', function ($cacheFactory) {
    $cacheFactory('chains');

    var Chain = function(name) {
      this.name = name;
    };
    
    Chain.create = function(name, callback) {
      var chain = Chain.get(name);
      chain.hook('init', callback, 0);
      return chain;
    };
    
    Chain.get = function(name) {
      var chains = $cacheFactory.get('chains');

      if(!chains.get(name)) {
        chains.put(name, {});
      }

      return new Chain(name);
    };

    Chain.prototype.hook = function(id, callback, priority) {
      var chains = $cacheFactory.get('chains');
      var links = chains.get(this.name);
      
      links[id] = {
        id: id,
        callback: callback,
        priority: priority
      };
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
          } else {
            throw new Error('Invalid callback type "' + typeof link.callback + '"');
          }
        } else if(angular.isFunction(link.callback)) {
          promise = link.callback(param);
        } else {
          throw new Error('Invalid callback type "' + typeof link.callback + '"');
        }
      });
    };

    return Chain;
  }]);
