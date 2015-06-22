(function() {
  'use strict';

  function FlowConversionService (FlowNotationService) {
    return {
      convertToAlienese: function(jointJSON) {
        var self = this;

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

            if (n.eventType == 'start') {
              notation = _.extend(notation, self.events[n.eventType][n.eventName](n));
            } else if (n.eventType == 'intermediate' && !n.throwing) {
              notation = _.extend(notation, self.events['catch'][n.eventName](n));
            } else {
              notation = _.extend(notation, self.events['throw'][n.eventName](n));
            }
          }

          return notation;
        });

        return alienese;
      },

      convertToJoint: function(alienese) {
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

        return {cells: jointNotation};
      },

      events: {

        start: {
          none: function(model) {
            return {
              entity: 'start',
              type: 'none',
            }
          }
        },

        throw: {
          none: function(model) {
            return {
              entity: 'throw',
              type: 'none',
              terminate: model.terminate
            }
          },
          signal: function(model) {
            return {
              entity: 'throw',
              type: 'signal',
              terminate: model.terminate,
              event: model.event || {}
            }
          },
          error: function(model) {
            return {
              entity: 'throw',
              type: 'error',
              terminate: model.terminate
            }
          }
        },
        catch: {
          signal: function(model) {
            return {
              entity: 'catch',
              type: 'signal',
              interrupting: model.interrupting,
              target: model.target,
              bindings: model.bindings || []
            }
          },
          error: function(model) {
            return {
              entity: 'catch',
              type: 'error',
              interrupting: true,
              bindings: model.bindings || []
            }
          }
        }
      }
    };
  }

  angular.module('liveopsConfigPanel').service('FlowConversionService', FlowConversionService);
})();
