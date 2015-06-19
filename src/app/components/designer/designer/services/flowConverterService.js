(function() {
  'use strict';

  function FlowConversionService (FlowNotationService) {
    return {
      convertToAlienese: function(jointJSON) {
        if (jointJSON.cells.length === 0) {return;}

        var jjs = _.clone(jointJSON.cells);

        var links = _.filter(jjs, function(notation) {
          return notation.type === 'liveOps.link';
        });

        var notations = _.filter(jjs, function(notation) {
          return notation.type !== 'liveOps.link';
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
            notation.bindings = {};
          }

          if (n.type === 'liveOps.gateway') {
            notation.type = n.gatewayType;
            notation.entity = 'gateway';
          }

          if (n.type === 'liveOps.event') {

            //Entity
            if (n.throwing) {
              notation.entity = 'throw';
            } else if (n.eventType == 'intermediate') {
              notation.entity = 'catch';
              notation.interrupting = n.interrupting;
            } else if (n.eventType == 'start') {
              notation.entity = 'start';

              if (n.eventName !== 'none' && n.eventName !== 'error') {
                notation.interrupting = n.interrupting;
              }
            }

            if (n.eventType == 'end') {
              notation.terminate = true;
            }

            notation.type = n.eventName;
            
            if (n.eventName == 'signal') {
              notation.target = n.target;
            }
          }

          return notation;
        });

        console.log('Alienese', alienese);
        return alienese;
      },

      convertToJoint: function(alienese) {
        console.log(alienese);

        var jointNotation = _.reduce(alienese, function(memo, notation) {

          if (notation.entity === 'start' || notation.entity === 'catch' || notation.entity === 'throw') {
            var event = {
              id: String(notation.id),
              type: 'liveOps.event',
              interrupting: notation.interrupting,
              eventName: notation.type,
              position: {
                x: notation['rendering-data'].x,
                y: notation['rendering-data'].y,
              }
            }

            if (notation.entity == 'throw' && notation.terminate) {
              event.eventType = 'end';
              event.terminate = true;
            } else if ((notation.entity == 'throw' && !notation.terminate) || notation.entity == 'catch') {
              event.eventType = 'intermediate';
              event.terminate = false;
            }

            memo.push(event);
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
              content: FlowNotationService.getActivityLabel(notation),
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
                type: 'liveOps.link',
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

        console.log(jointNotation);

        return {cells: jointNotation};
      }
    };
  }

  angular.module('liveopsConfigPanel').service('FlowConversionService', FlowConversionService);
})();
