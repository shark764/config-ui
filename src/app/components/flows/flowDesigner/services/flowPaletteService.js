(function() {
  'use strict';

  function FlowPaletteService(FlowLibrary) {
    return {

      loadPallet: function(pallet) {
        this.loadGateways(pallet);
        this.loadEvents(pallet);
        this.loadActivities(pallet);
        this.loadTemplates(pallet);
      },

      loadGateways: function(palette) {
        palette.load([
          new joint.shapes.liveOps.gateway({
            gatewayType: 'parallel'
          }),
          new joint.shapes.liveOps.gateway({
            gatewayType: 'exclusive'
          }),
          new joint.shapes.liveOps.gateway({
            gatewayType: 'event'
          })
        ], 'gateways');
      },

      loadEvents: function(palette) {
        palette.load(_.map(FlowLibrary.listEvents(), function(event){
          var evt = new joint.shapes.liveOps.event({
            name: event.type,
            entity: event.entity,
            terminate: event.terminate || false,
            inputs: event.inputs
          });

          if(event.timer) {
            evt.timer = event.timer;
          }

          return evt;
        }), 'events');
      },

      loadActivities: function(palette) {
        _.each(_.groupBy(FlowLibrary.listActivities(), 'entity'), function(notations, entity) {
          palette.load(
            _.map(notations, function(notation) {
              var n = FlowLibrary.convertToJoint([
                {
                  entity: 'activity',
                  type: notation.type || 'task',
                  flow: {
                    id: notation.flow
                  },
                  name: notation.name,
                  version: {
                    id: notation.version
                  },
                  id: joint.util.uuid(),
                  position: {x:0, y:0},
                  target: notation.target
                }
              ]);
              return n.cells[0];
            }
          ), entity);
        });
      },

      loadTemplates: function(palette) {
        palette.load(_.map(FlowLibrary.listTemplates(), function(template){
          var tmp = new joint.shapes.liveOps.template({
            content: template.label,
            type: 'liveOps.template',
            name: template.name,
            params: _.reduce(template.params, function(memo, value) {
              if (_.has(value, 'default')) {
                memo[value.key] = value.default;
              }
              else {
                memo[value.key] = null;
              }
              return memo;
            }, {})
          });
          tmp.attributes.inputs = tmp.attributes.inputs.concat(template.inputs);
          return tmp;
        }), 'templates');
      }
    };
  }

  angular.module('liveopsConfigPanel').service('FlowPaletteService', FlowPaletteService);
})();
