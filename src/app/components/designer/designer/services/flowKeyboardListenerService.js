(function() {
  'use strict';

  function FlowKeyboardListenerService () {
    this.metaKeys = ['cmd', 'ctrl'];
    return {
      initializeListeners: function() {

      }
    };
  }

  angular.module('liveopsConfigPanel').service('FlowKeyboardListenerService', FlowKeyboardListenerService);
})();
