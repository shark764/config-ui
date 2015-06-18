(function() {
  'use strict';

  function FlowPaletteService(FlowNotationService, flowMocks) {
    var demoInit = flowMocks.demoInit;
    console.log(demoInit);
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
                type: 'liveOps.activity',
                activityType: notation.type,
                name: notation.name
              });
            }
          ), entity);
          _.each(notations, function(notation) {
            FlowNotationService.registerActivity(notation);
          });
        });
        console.log(FlowNotationService);
      }
    };
  }

  angular.module('liveopsConfigPanel').service('FlowPaletteService', FlowPaletteService);
})();
