(function() {
  'use strict';

  function SubflowCommunicationService () {
    return {

      add: function(newSubflow) {
        var filteredSubflows = _.filter(this.subflows, function(subflow) {
          return newSubflow.id === subflow.id;
        });

        if (filteredSubflows.length > 0) {
          this.remove(newSubflow.id);
        }

        this.subflows.push(newSubflow);
        return this.retrieve(newSubflow.id);
      },

      retrieve: function(subflowId) {
        var filteredSubflows = _.filter(this.subflows, function(subflow) {
          return subflowId === subflow.notationId;
        });
        return filteredSubflows.length === 0 ? undefined : filteredSubflows[0];
      },

      remove: function(subflowId) {
        this.subflows = _.filter(this.subflows, function(subflow) { return subflow.id !== subflowId; });
      },

      subflows: []
    };
  }

  angular.module('liveopsConfigPanel').service('SubflowCommunicationService', SubflowCommunicationService);
})();