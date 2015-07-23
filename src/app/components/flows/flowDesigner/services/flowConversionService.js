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
            notation.bindings = FlowNotationService.addActivityBindings(n);

            if (n.targeted) {
              notation.target = n.target;
            }
          }

          if (n.type === 'liveOps.gateway') {
            notation.type = n.gatewayType;
            notation.entity = 'gateway';
          }

          if (n.type === 'liveOps.event') {
            notation = _.extend(notation, self.events[n.entity][n.name](n));
          }

          return notation;
        });

        //Put in parents of decorations
        _.each(alienese, function(notation) {
          if (notation.decorations && notation.decorations.length > 0) {
            _.each(notation.decorations, function(decorationId) {
              var decoration = _.findWhere(alienese, {id: decorationId});
              decoration.parents.push(notation.id);
            });
          }
        });

        return alienese;
      },

      convertToJoint: function(alienese) {
        var jointNotation = _.reduce(alienese, function(memo, notation) {

          if (notation.entity === 'start' || notation.entity === 'catch' || notation.entity === 'throw') {

            var event = {
              id: notation.id.toString(),
              type: 'liveOps.event',
              interrupting: notation.interrupting,
              name: notation.type,
              position: {
                x: (notation['rendering-data']) ? notation['rendering-data'].x : 0,
                y: (notation['rendering-data']) ? notation['rendering-data'].y : 0
              },
              entity: notation.entity
            };

            if (notation.target) {
              event.target = notation.target;
            }

            if (notation.timer) {
              event.timer = notation.timer.value;
            }

            if (notation.event) {
              event.event = {
                name: notation.event.name,
                params: _.reduce(notation.event.params, function(memo, value, key) {
                  memo.push({
                    key: key,
                    value: value.value
                  });
                  return memo;
                }, [])
              };
            }

            if (notation.bindings) {
              event.bindings = _.reduce(notation.bindings, function(memo, value, key) {
                memo.push({
                  key: key,
                  value: value
                });
                return memo;
              }, []);
            }

            memo.push(event);
          } else if (notation.entity === 'gateway') {
            memo.push({
              id: notation.id.toString(),
              type: 'liveOps.gateway',
              gatewayType: notation.type,
              position: {
                x: (notation['rendering-data']) ? notation['rendering-data'].x : 0,
                y: (notation['rendering-data']) ? notation['rendering-data'].y : 0
              }
            });
          } else if (notation.entity === 'activity') {
            console.log(notation);
            var activity = {
              id: notation.id.toString(),
              type: 'liveOps.activity',
              name: notation.name,
              activityType: notation.type,
              content: FlowNotationService.getActivityLabel(notation),
              position: {
                x: (notation['rendering-data']) ? notation['rendering-data'].x : 0,
                y: (notation['rendering-data']) ? notation['rendering-data'].y : 0
              },
              embeds: notation.decorations,
              params: FlowNotationService.extractActivityParams(notation),
              targeted: FlowNotationService.getActivityTargeted(notation),
              target: notation.target || '',
              bindings: _.reduce(notation.bindings, function(memo, key, value) {
                memo.push({
                  key: key,
                  value: value
                });
                return memo;
              }, [])
            };

            memo.push(activity);
          }

          if (notation.children) {
            _.each(notation.children, function(child, index) {
              memo.push({
                id: 'link-' + index + '-' + notation.id,
                type: 'liveOps.link',
                source: {id: notation.id.toString()},
                target: {id: child.toString()}
              });
            });
          }
          return memo;

        }, []);

        //Do another pass to set up decorations

        _.each(jointNotation, function(notation, index, list) {
          if (notation.embeds && notation.embeds.length > 0) {
            //find the child
            var decoration = _.findWhere(list, {id: notation.embeds[0].toString()});
            decoration.parent = notation.id;
          }
        });

        return {cells: jointNotation};
      },

      events: {

        start: {
          none: function() {
            return {
              entity: 'start',
              type: 'none',
            };
          },
          signal: function(model) {
            return {
              entity: 'start',
              type: 'signal',
              target: model.target,
              interrupting: model.interrupting,
              bindings: _.reduce(model.bindings, function(memo, param) {
                memo[param.key] = param.value;
                return memo;
              }, {})
            };
          }
        },

        throw: {
          none: function(model) {
            return {
              entity: 'throw',
              type: 'none',
              terminate: model.terminate
            };
          },
          signal: function(model) {
            return {
              entity: 'throw',
              type: 'signal',
              terminate: model.terminate,
              event: {
                name: model.event.name,
                params: _.reduce(model.event.params, function(memo, param) {
                  memo[param.key] = {
                    source: 'expression',
                    value: param.value
                  };
                  return memo;
                }, {})
              }
            };
          },
          'flow-error': function(model) {
            return {
              entity: 'throw',
              type: 'flow-error',
              terminate: model.terminate,
              error: {
                params: _.reduce(model.error, function(memo, param) {
                  memo[param.key] = param.value;
                  return memo;
                }, {})
              }
            };
          },
          terminate: function(model) {
            return {
              entity: 'throw',
              type: 'terminate',
              terminate: model.terminate
            };
          }
        },
        catch: {
          signal: function(model) {
            return {
              entity: 'catch',
              type: 'signal',
              interrupting: model.interrupting,
              target: model.target,
              bindings: _.reduce(model.bindings, function(memo, param) {
                memo[param.key] = param.value;
                return memo;
              }, {})
            };
          },
          'flow-error': function(model) {
            return {
              entity: 'catch',
              type: 'flow-error',
              interrupting: true,
              bindings: model.bindings || {}
            };
          },
          'system-error': function(model) {
            return {
              entity: 'catch',
              type: 'system-error',
              interrupting: true,
              bindings: model.bindings || {}
            };
          },
          timer: function(model) {
            return {
              entity: 'catch',
              type: 'timer',
              interrupting: model.interrupting,
              timer: {
                value: model.timer
              }
            }
          }
        }
      }
    };
  }

  angular.module('liveopsConfigPanel').service('FlowConversionService', FlowConversionService);
})();
