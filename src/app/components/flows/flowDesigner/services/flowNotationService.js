(function() {
  'use strict';

  function FlowNotationService(FlowLibrary) {
    return {
      activities: [],
      events: [],
      gateways: [],
      links: [],
      templates: [],

      registerTemplate: function(alieneseJSON) {
        var self = this;
        if (!_.contains(self.templates, alieneseJSON)) {
          self.templates.push(alieneseJSON);
        }
      },

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

      registerLink: function(alieneseJSON) {
        var self = this;
        if (!_.contains(self.links, alieneseJSON)) {
          self.links.push(alieneseJSON);
        }
      },

      buildInputPanel: function(model) {
        var self = this;
        var modelType = model.get('type');
        var inputs = [];

        //If we're dealing with an activity
        if (modelType === 'liveOps.activity') {
          var activity = _.findWhere(self.activities, {name: model.get('name')});
          inputs = activity.inputs;
        }

        //if we're dealing with an event
        if (modelType === 'liveOps.event') {
          var event = _.findWhere(self.events, {entity: model.get('entity'), type: model.get('name')});
          inputs = event.inputs;
        }

        //if we're dealing with a link
        if (modelType === 'liveOps.link') {
          var link = _.findWhere(self.links, {type: model.get('linkType')});
          inputs = link.inputs;
        }

        //if we're dealing with a template
        if (modelType === 'liveOps.template') {
          var template = _.findWhere(self.templates, {name: model.get('name')});
          inputs = template.inputs;
        }

        return _.map(inputs, function(input){
          input = _.clone(input);
          if (input.source === 'resource') {
            input.options = _.union(input.options, _.map(FlowLibrary.search({cells: model.collection.toJSON()}, 'resource'), function(item){
              return {
                content: item,
                value: item
              };
            }));
          } else if (input.source == 'catch' || input.source == 'throw') {
            input.options = _.union(input.options, _.map(FlowLibrary.search({cells: model.collection.toJSON()}, input.source), function(item){
              return {
                content: item,
                value: item
              }
            }))
          }
          return input;
        });
      },

      addActivityParams: function(model) {
        var self = this;
        var activity = _.find(self.activities, {name: model.name});
        var params = {};

        params = _.reduce(activity.params, function(memo, param, key) {

          if (param.source === 'expression' && _.has(model.params, param.key)) {

            if (!param.when || (expression.eval(param.when, model))) {
              memo[key] = {
                source: 'expression',
                value: model.params[param.key].toString()
              };
            }
          } else if (param.source === 'entity') {
            if(!model.params[param.key] || model.params[param.key].length === 0) {
              throw {
                model: model,
                param: param.key,
                message: 'Parameters either was not defined or was incorrect'
              };
            }

            memo[key] = {
              source: 'system',
              store: param.type,
              id: model.params[param.key].toString()
            };
          }

          return memo;
        }, {});
        return params;
      }

    };
  }

  var expression = {
    eval: function(expr, model) {
      this.model = model;
      return this._evalExpression(expr);
    },

    _isComposite: function(expr) {
      var composite = _.pick(expr, 'not', 'and', 'or', 'nor');
      return _.some(composite);
    },

    _isPrimitive: function(expr) {
      var primitive = _.pick(expr, 'eq', 'ne', 'regex', 'text', 'lt', 'lte', 'gt', 'gte', 'in', 'nin');
      return _.some(primitive);
    },

    _evalPrimitive: function(expr) {

      return _.reduce(expr, function(res, condition, operator) {
        return _.reduce(condition, function(res, condValue, condPath) {

          var val = joint.util.getByPath(this.model, condPath, '.');

          switch (operator) {
            case 'eq':
              return condValue === val;
            case 'ne':
              return condValue !== val;
            case 'regex':
              return (new RegExp(condValue)).test(val);
            case 'text':
              return !condValue || (_.isString(val) && val.toLowerCase().indexOf(condValue) > -1);
            case 'lt':
              return val < condValue;
            case 'lte':
              return val <= condValue;
            case 'gt':
              return val > condValue;
            case 'gte':
              return val >= condValue;
            case 'in':
              return _.contains(condValue, val);
            case 'nin':
              return !_.contains(condValue, val);
            default:
              return res;
          }

        }, false, this);
      }, false, this);
    },

    _evalExpression: function(expr) {
      if (this._isPrimitive(expr)) {
        return this._evalPrimitive(expr);
      }

      return _.reduce(expr, function(res, childExpr, operator) {

        if (operator === 'not') {
          return !this._evalExpression(childExpr);
        }

        var childExprRes = _.map(childExpr, this._evalExpression, this);

        switch (operator) {
          case 'and':
            return _.every(childExprRes);
          case 'or':
            return _.some(childExprRes);
          case 'nor':
            return !_.some(childExprRes);
          default:
            return res;
        }

      }, false, this);
    },

    _extractVariables: function(expr) {

      if (_.isArray(expr) || this._isComposite(expr)) {
        return _.reduce(expr, function(res, childExpr) {
          return res.concat(this._extractVariables(childExpr));
        }, [], this);
      }

      return _.reduce(expr, function(res, primitive) {
        return _.keys(primitive);
      }, []);
    },

    isExpressionValid: function(expr) {
      expr = _.omit(expr, 'otherwise');
      return this._evalExpression(expr);
    },

    extractExpressionPaths: function(expr) {
      expr = _.omit(expr, 'otherwise');
      return _.uniq(this._extractVariables(expr));
    }
  };

  angular.module('liveopsConfigPanel').service('FlowNotationService', FlowNotationService);
})();
