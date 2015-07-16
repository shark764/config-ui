(function() {
  'use strict';

  function FlowNotationService() {
    return {
      activities: [],
      events: [],
      gateways: [],

      registerActivity: function(alieneseJSON) {
        var self = this;
        if (!_.contains(self.activities, alieneseJSON)) {
          self.activities.push(alieneseJSON);
        }
      },

      registerEvent: function(alieneseJSON) {
        var self = this;
        if (!_.contains(self.events, alieneseJSON)) {
          self.events.push(alieneseJSON);
        }
      },

      getActivityLabel: function(model) {
        var self = this;
        var activity = _.findWhere(self.activities, {name: model.name});
        return activity.label;
      },

      getActivityTargeted: function(model) {
        var self = this;
        var activity = _.findWhere(self.activities, {name: model.name});
        return activity.targeted;
      },

      buildInputPanel: function(model) {
        var self = this;
        var modelType = model.get('type');

        //If we're dealing with an actrivity
        if (modelType === 'liveOps.activity') {
          var name = model.get('name');
          var inputs = model.get('inputs');
          var notation = _.findWhere(self.activities, {name: name});

          var params = _.reduce(notation.params, function(memo, param, name) {
            memo[name] = {
              label: param.label,
              group: 'params'
            };

            if (param.source === 'expression' && (param.type === 'integer' || param.type === 'string')) {
              memo[name].type = 'text';
            } else if (param.source === 'expression' && param.type === 'boolean') {
              memo[name].type = 'toggle';
            } else if (param.source === 'entity') {
              memo[name].type = 'select';
              memo[name].options = _.union([{content: 'Please select one', value: undefined}], _.map(self[param.type], function(entity) {
                  return {
                    value: entity.id,
                    content: entity.source || entity.name
                  };
                })
              );
            }

            return memo;
          }, {});
          return _.extend({params: params}, inputs);
        }

        //if we're dealing with an event
        if (modelType === 'liveOps.event') {
          var event = _.findWhere(self.events, {entity: model.get('entity'), type: model.get('name')})

          var inputs = {
            entity: {
              type: 'select',
              group: 'general',
              label: 'Type',
              options: _.map(_.filter(self.events, {type: model.get('name')}), function(def) {
                return {
                  value: def.entity,
                  content: def.entity
                }
              })
            },
            name: {
              type: 'select',
              group: 'general',
              label: 'Name',
              options: _.map(_.filter(self.events, {entity: model.get('entity')}), function(def) {
                return {
                  value: def.type,
                  content: def.type
                }
              })
            }
          }

          _.each(event.props, function(prop) {
            switch (prop){
              case 'target':
                inputs[prop] = {
                  type: 'text',
                  group: 'general',
                  label: 'Target'
                }
                break;
              case 'bindings':
                inputs[prop] = {
                  type: 'list',
                  label: 'Bindings',
                  group: 'bindings',
                  item: {
                    type: 'object',
                    properties: {
                      key: {
                        label: 'Key',
                        type: 'text'
                      },
                      value: {
                        label: 'Value',
                        type: 'text'
                      }
                    }
                  }
                }
                break;
              case 'event':
                inputs[prop] = {
                  type: 'object',
                  group: 'general',
                  label: 'Event',
                  properties: {
                    name: {
                      label: 'Signal Name',
                      type: 'text'
                    },
                    params: {
                      label: 'Params',
                      type: 'list',
                      item: {
                        type: 'object',
                        properties: {
                          key: {
                            label: 'Key',
                            type: 'text'
                          },
                          value: {
                            label: 'Value',
                            type: 'text'
                          }
                        }
                      }
                    }
                  }
                }
                break;
              case 'terminate':
                inputs[prop] = {
                  type: 'toggle',
                  group: 'general',
                  label: 'Terminate?'
                }
            }
          })

          return inputs;
        }

      },

      addActivityParams: function(model) {
        var self = this;
        var activity = self.activities[model.name];
        var params = {};

        params = _.reduce(activity.params, function(memo, param, key) {

          if (param.source === 'expression' && model.params[key]) {
            memo[key] = {
              source: 'expression',
              value: model.params[key]
            };
          } else if (param.source === 'entity') {
            memo[key] = {
              source: 'system',
              store: param.type,
              id: model.params[key]
            };
          }

          return memo;
        }, {});
        return params;
      },

      addActivityBindings: function(model) {
        var bindings = {};

        bindings = _.reduce(model.bindings, function(memo, binding) {
          memo[binding.key] = binding.value;
          return memo;
        }, {});
        return bindings;
      }

    };
  }

  angular.module('liveopsConfigPanel').service('FlowNotationService', FlowNotationService);
})();
