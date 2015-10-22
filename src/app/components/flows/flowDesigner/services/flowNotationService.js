(function() {
  'use strict';

  function FlowNotationService(FlowLibrary) {

    function getDefinition(model){
      var modelType = model.get('type');
      //If we're dealing with an activity
      if (modelType === 'liveOps.activity') {
        return _.findWhere(FlowLibrary.listActivities(), {name: model.get('name')});
      }
      //if we're dealing with an event
      if (modelType === 'liveOps.event') {
        return _.findWhere(FlowLibrary.listEvents(), {entity: model.get('entity'), type: model.get('name')});
      }
      //if we're dealing with a link
      if (modelType === 'liveOps.link') {
        return _.findWhere(FlowLibrary.listLinks(), {type: model.get('linkType')});
      }
      //if we're dealing with a template
      if (modelType === 'liveOps.template') {
        return _.findWhere(FlowLibrary.listTemplates(), {name: model.get('name')});
      }
      //if we're dealing with a gateway
      if (modelType === 'liveOps.gateway') {
        return {inputs: []};
      }
    }

    function buildOptions(model, input) {
      var options = input.options || [];
      if (input.source === 'resource') {
        options = _.union(options, _.map(FlowLibrary.search({cells: model.collection.toJSON()}, 'resource'), function(item){
          return {
            content: item,
            value: item
          };
        }));
      } else if (input.source === 'catch' || input.source === 'throw' || input.source === 'signal') {
        options = _.union(options, _.map(FlowLibrary.search({cells: model.collection.toJSON()}, input.source), function(item){
          return {
            content: item,
            value: item
          };
        }));
      }

      return options;
    }

    return {

      buildInputPanel: function(model) {
        var inputs = getDefinition(model).inputs;
        return _.map(inputs, function(input){
          input = _.clone(input);
          if(input.type === 'select' || input.type === 'typeahead' || input.type === 'autocomplete'){
            input.options = buildOptions(model, input);
          }
          return input;
        });
      },

      populateSingleOption: function(model) {
        var inputs = getDefinition(model).inputs;

        _.each(inputs, function(input){
          if(input.type === 'select'){
            var options = buildOptions(model, input);

            if(options.length === 1){
              console.log('input only has 1 option', input);
              console.log(options[0]);
              joint.util.setByPath(model, 'attributes.' + input.path, options[0].value, '.');
            }
          }
        });
      }
    };
  }

  angular.module('liveopsConfigPanel').service('FlowNotationService', FlowNotationService);
})();
