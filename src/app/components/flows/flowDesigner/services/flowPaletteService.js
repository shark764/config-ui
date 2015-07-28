(function() {
  'use strict';

  function FlowPaletteService(FlowNotationService) {
    return {

      loadData: function(data) {
        this.data = data;
      },

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
        var self = this;
        palette.load([
          new joint.shapes.liveOps.event({
            name: 'none',
            entity: 'start'
          }),
          new joint.shapes.liveOps.event({
            name: 'none',
            entity: 'catch'
          }),
          new joint.shapes.liveOps.event({
            name: 'none',
            entity: 'throw',
            terminate: true
          })
        ], 'events');

        _.each(self.data.events, function(notation) {
          FlowNotationService.registerEvent(notation);
        });
      },

      loadActivities: function(palette) {
        var self = this;
        _.each(_.groupBy(self.data.activities, 'entity'), function(notations, entity) {
          palette.load(
            _.map(notations, function(notation) {
              var n = new joint.shapes.liveOps[entity]({
                content: notation.label,
                activityType: notation.type,
                type: 'liveOps.activity',
                name: notation.name,
                targeted: notation.targeted,
                target: notation.target,
                params: _.reduce(notation.params, function(memo, value) {
                  if (_.has(value, 'default')) {
                    memo[value.key] = value.default;
                  }
                  return memo;
                }, {})
              });
              n.attributes.inputs = n.attributes.inputs.concat(notation.inputs);
              return n;
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
