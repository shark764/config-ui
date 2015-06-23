(function() {
  'use strict';

  function FlowNotationService() {
    return {
      activities: {},
      events: {},
      gateways: {},

      registerActivity: function(alieneseJSON) {
        var self = this;
        var name = alieneseJSON.name;
        self.activities[name] = alieneseJSON;
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
        var name = model.get('name');
        var inputs = model.get('inputs');
        var params = {};
        var notation = {};

        if (modelType === 'liveOps.activity') {
          notation = self.activities[name];

          params = _.reduce(notation.params, function(memo, param, name) {
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
              memo[name].options = _.map(self[param.type], function(entity) {
                return {
                  value: entity.id,
                  content: entity.source || entity.name
                };
              });
            }

            return memo;
          }, {});
        }

        return _.extend({params: params}, inputs);
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
              id: joint.util.uuid()
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
