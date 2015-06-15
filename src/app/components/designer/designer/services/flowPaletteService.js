(function() {
  'use strict';

  function FlowPaletteService(FlowNotationService, mocks) {
    var demoInit = mocks.demoInit;
    return {
      loadGateways: function(palette) {
        palette.load([
          new joint.shapes.liveOps.gateway({
            gatewayType: 'inclusive',
            content: 'derp'
          }),
          new joint.shapes.liveOps.gateway({
            gatewayType: 'exclusive',
            content: 'derp2'
          })
        ], 'gateways');
      },

      loadEvents: function(palette) {
        palette.load([
          new joint.shapes.liveOps.event({
            icon: 'none',
            content: 'none'
          }),
          new joint.shapes.liveOps.event({
            icon: 'signal',
            content: 'signal'
          }),
          new joint.shapes.liveOps.event({
            icon: 'error',
            content: 'error'
          }),
          new joint.shapes.liveOps.event({
            icon: 'escalation',
            content: 'escalation'
          }),
          new joint.shapes.liveOps.event({
            icon: 'terminate',
            content: 'terminate'
          }),
        ], 'events');
      },

      loadActivities: function(palette) {
        _.each(_.groupBy(demoInit, 'entity'), function(notations, entity) {
          palette.load(
            _.map(notations, function(notation) {
              return new joint.shapes.liveOps[entity]({
                content: notation.label,
                type: notation.type,
                name: notation.name
              });
            }
          ), entity);
          _.each(notations, function(notation) {
            FlowNotationService.registerActivity(notation);
          });
        });
      }
    };
  }

  angular.module('liveopsConfigPanel').service('FlowPaletteService', FlowPaletteService);
})();