(function() {
  'use strict';

  function FlowPaletteService(FlowNotationService, FlowMockService) {
    var demoInit = FlowMockService.demoInit;
    return {
      loadGateways: function(palette) {
        palette.load([
          new joint.shapes.liveOps.gateway({
            gatewayType: 'parallel',
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
            eventName: 'none',
            eventType: 'start'
          }),
          new joint.shapes.liveOps.event({
            eventName: 'none',
            eventType: 'intermediate'
          }),
          new joint.shapes.liveOps.event({
            eventName: 'none',
            eventType: 'end'
          })
        ], 'events');
      },

      loadActivities: function(palette) {
        _.each(_.groupBy(demoInit, 'entity'), function(notations, entity) {
          palette.load(
            _.map(notations, function(notation) {
              return new joint.shapes.liveOps[entity]({
                content: notation.label,
                activityType: notation.type,
                type: 'liveOps.activity',
                name: notation.name,
                targeted: notation.targeted,
                target: notation.target,
                params: _.reduce(notation.params, function(memo, value, key) {
                  if (value.default) {
                    memo[key] = value.default;
                  };
                  return memo;
                }, {})
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
