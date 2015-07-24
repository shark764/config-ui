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

          var params = _.reduce(notation.ui, function(memo, param, name) {
            if (param.type == 'entity') {
              memo[name] = {
                label: param.label,
                group: 'params',
                type: 'select',
                options: _.union([{content: 'Please select one', value: undefined}], _.map(self[param.source], function(entity) {
                  return {
                    value: entity.id,
                    content: entity.source || entity.name
                  };
                }))
              }
            } else {
              memo[name] = param;
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
              case 'timer':
                inputs[prop] = {
                  type: 'text',
                  group: 'general',
                  label: 'Time'
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
              case 'error':
                inputs[prop] = {
                  type: 'list',
                  label: 'Parameters',
                  group: 'general',
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

          //Handle any meta info
          _.each(event.meta, function(meta) {
            if (meta === 'mustTerminate') {
              model.set('terminate', true);
              delete inputs.terminate;
            }
          })

          return inputs;
        }

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
            memo[key] = {
              source: 'system',
              store: param.type,
              id: model.params[param.key].toString()
            };
          }

          return memo;
        }, {});
        return params;
      },

      extractActivityParams: function(model) {
        var self = this;
        var activity = _.find(self.activities, {name: model.name});
        var params = {};

        params = _.reduce(model.params, function(memo, param, key) {
          var paramDef = activity.params[key];
          if (param.source == 'expression') {
            if (paramDef.type == 'boolean') {
              memo[paramDef.key] = (param.value == 'true');
            } else {
              memo[paramDef.key] = param.value;
            }
          } else if (param.source === 'system') {
            memo[paramDef.key] = param.id;
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
              return condValue == val;
            case 'ne':
              return condValue != val;
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

    _evalExpression: function(expr, model) {
      if (this._isPrimitive(expr)) {
        return this._evalPrimitive(expr);
      }

      return _.reduce(expr, function(res, childExpr, operator) {

        if (operator == 'not') return !this._evalExpression(childExpr);

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
  }

  angular.module('liveopsConfigPanel').service('FlowNotationService', FlowNotationService);
})();

