(function() {
  'use strict';

  function FlowPaletteService(FlowNotationService) {
    return {

      loadData: function(data) {
        this.data = data;
      },

      loadLinks: function() {
        var self = this;
        _.each(self.data.links, function(notation) {
          FlowNotationService.registerLink(notation);
        })
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

        palette.load(_.map(self.data.events, function(event){
          var evt = new joint.shapes.liveOps.event({
            name: event.type,
            entity: event.entity,
            terminate: event.terminate || false,
            inputs: event.inputs
          });
          return evt;
        }), 'events');

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
                  else {
                    memo[value.key] = null;
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
