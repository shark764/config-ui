(function() {
  'use strict';

  function FlowConversionService (FlowNotationService) {
    return {
      convertToAlienese: function(jointJSON) {
        if (jointJSON.cells.length === 0) {return;}

        var jjs = _.clone(jointJSON.cells);

        var links = _.filter(jjs, function(notation) {
          return notation.type === 'bpmn.Flow';
        });

        var notations = _.filter(jjs, function(notation) {
          return notation.type !== 'bpmn.Flow';
        });

        var alienese = _.map(notations, function(n) {
          var notation = {
            'rendering-data': {},
            children: [],
            parents: []
          };

          // UUIDs of notations from JointJS and activity
          notation.id = n.id;

          // Positional metadata
          notation['rendering-data'].x = n.position.x;
          notation['rendering-data'].y = n.position.y;

          if (n.embeds) {
            notation.decorations = n.embeds;
          }

          _.each(links, function(link) {
            // Add parents
            if (link.target.id === n.id) {notation.parents.push(link.source.id);}
            // Add children
            if (link.source.id === n.id) {notation.children.push(link.target.id);}
          });

          if (n.type === 'liveOps.activity') {
            notation.type = n.activityType;
            notation.entity = 'activity';
            notation.name = n.name;
            notation.params = FlowNotationService.addActivityParams(n);
          }

          if (n.type === 'liveOps.gateway') {
            notation.type = n.gatewayType;
            notation.entity = 'gateway';
          }

          if (n.type === 'liveOps.event') {
            notation.type = n.icon;
            notation.entity = n.eventType;
          }

          return notation;
        });

        return alienese;
      },

      convertToJoint: function(alienese) {
        var jointNotation = _.reduce(alienese, function(memo, notation) {

          if (notation.entity === 'start' || notation.entity === 'catch' || notation.entity === 'end') {
            memo.push({
              id: String(notation.id),
              type: 'liveOps.event',
              eventType: notation.entity,
              interrupting: notation.interrupting,
              icon: notation.type,
              position: {
                x: notation['rendering-data'].x,
                y: notation['rendering-data'].y,
              }
            });
          } else if (notation.entity === 'gateway') {
            memo.push({
              id: String(notation.id),
              type: 'liveOps.gateway',
              gatewayType: notation.type,
              position: {
                x: notation['rendering-data'].x,
                y: notation['rendering-data'].y,
              }
            });
          } else if (notation.entity === 'activity') {
            var activity = {
              id: String(notation.id),
              type: 'liveOps.activity',
              name: notation.name,
              activityType: notation.type,
              content: notation['rendering-data'].label,
              position: {
                x: notation['rendering-data'].x,
                y: notation['rendering-data'].y
              },
              embeds: notation.decorations
            };

            _.each(notation.params, function(param, key) {
              if (param.source === 'system') {
                activity[key] = param.id;
              } else if (param.source === 'constant') {
                activity[key] = param.value;
              } else if (param.source === 'variable') {
                activity[key] = param.variable;
              }

            });

            memo.push(activity);
          }

          if (notation.children) {
            _.each(notation.children, function(child, index) {
              memo.push({
                id: 'link-' + index + '-' + notation.id,
                type: 'bpmn.Flow',
                source: {id: String(notation.id)},
                target: {id: String(child)}
              });
            });
          }
          return memo;

        }, []);

        //Do another pass to set up decorations

        _.each(jointNotation, function(notation, index, list) {
          if (notation.embeds) {
            //find the child
            var decoration = _.findWhere(list, {id: String(notation.embeds[0])});
            decoration.parent = notation.id;
          }
        });

        return {cells: jointNotation};
      }
    };
  }

  angular.module('liveopsConfigPanel').service('FlowConversionService', FlowConversionService);
})();