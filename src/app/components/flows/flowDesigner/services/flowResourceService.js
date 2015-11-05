(function() {
  'use strict';

  function FlowResourceService($q, Session, Media, Queue, Flow) {
    function loadMedia(){
      var deferred = $q.defer();
      Media.query({tenantId : Session.tenant.tenantId}, function(data){
        deferred.resolve(data);
      });
      return deferred.promise;
    }

    function loadQueue(){
      var deferred = $q.defer();
      Queue.query({tenantId : Session.tenant.tenantId}, function(data){
        deferred.resolve(data);
      });
      return deferred.promise;
    }

    function loadReusableFlows(){
      var deferred = $q.defer();
      Flow.query({tenantId: Session.tenant.tenantId}, function(data){
        var filtered = _.where(data, {type: 'reusable'});
        deferred.resolve(_.reject(filtered, {activeFlow: null}));
      });
      return deferred.promise;
    }
    return {
      loadResources: function(){
        var self = this;
        return $q.all({
          media: loadMedia(),
          queues: loadQueue(),
          flows: loadReusableFlows()
        }).then(function(data){
          angular.extend(self, data);
        });
      },
      getActiveQueues: function(){
        var self = this;
        return _.where(self.queues, {active: true});
      },
      getAllMedia: function(){
        var self = this;
        return self.media;
      },
      getFlows: function() {
        var self = this;
        return self.flows;
      }
    };
  }

  angular.module('liveopsConfigPanel').service('FlowResource', FlowResourceService);
})();
