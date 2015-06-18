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

      buildInputPanel: function(model) {
        var self = this;
        var modelType = model.get('type');
        var name = model.get('name');
        var inputs = model.get('inputs');
        var params = {};
        var bindings = {};
        var notation = {};

        if (modelType === 'liveOps.activity') {
          notation = self.activities[name];

          params = _.reduce(notation.params, function(memo, param, name) {
            memo[name] = {
              label: param.label,
              group: notation.label,
            };

            if ((param.source === 'constant' || param.source === 'variable') && (param.type === 'integer' || param.type === 'string')) {
              memo[name].type = 'text';
            } else if (param.source === 'constant' && param.type === 'boolean') {
              memo[name].type = 'toggle';
            } else if (param.source === 'entity') {
              memo[name].type = 'select';
              memo[name].options = ['media_1', 'media_2', 'media_3'];
            }

            return memo;
          }, {});

          bindings = _.reduce(notation.bindings, function(memo, binding, name) {
            memo[name] = {
              label: name,
              group: 'Bindings',
              type: 'text'
            };

            return memo;
          }, {});
        }

        return _.extend(inputs, params, bindings);
      },

      addActivityParams: function(model) {
        var self = this;
        var activity = self.activities[model.name];
        var params = {};

        params = _.reduce(activity.params, function(memo, param, key) {

          if (param.source === 'constant') {
            memo[key] = {
              source: 'constant',
              type: param.type,
              value: model[key]
            };
          } else if (param.source === 'variable') {
            memo[key] = {
              source: 'constant',
              type: param.type,
              variable: model[key]
            };
          } else if (param.source === 'entity') {
            memo[key] = {
              source: 'system',
              type: param.type,
              id: model[key]
            };
          }

          return memo;
        }, {});
        return params;
      }

    };
  }

  angular.module('liveopsConfigPanel').service('FlowNotationService', FlowNotationService);
})();
