(function() {
  'use strict';

  function FlowNotationService() {
    return {
      activities: [],
      events: [],
      gateways: [],

      registerActivity: function(alieneseJSON) {
        var self = this;
        self.activities.push(alieneseJSON);
      },

      registerEvent: function(alieneseJSON) {
        var self = this;
        self.events.push(alieneseJSON);
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
          // return {
          //   eventType: {
          //     type: 'select',
          //     group: 'general',
          //     label: 'Group',
          //     options: [
          //       {
          //         value: 'start',
          //         content: 'Start'
          //       },
          //       {
          //         value: 'intermediate',
          //         content: 'Intermediate'
          //       },
          //       {
          //         value: 'end',
          //         content: 'End'
          //       }
          //     ]
          //   },
          // }
          return model.get('inputs');;
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
