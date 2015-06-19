(function() {
  'use strict';

  function SubflowCommunicationService (FlowConversionService) {

    this.defaultSubflow = '[]';
    this.subflows = [];

    return {
      addSubflow: function(jointJSON) {
        return this.subflows.push(FlowConversionService.convertToAlienese(jointJSON));
      },
      getSubflow: function() {
        return this.subflows || this.defaultSubflow;
      }
    };
  }

  angular.module('liveopsConfigPanel').service('SubflowCommunicationService', SubflowCommunicationService);
})();
