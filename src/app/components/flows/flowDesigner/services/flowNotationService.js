(function() {
  'use strict';

  function FlowNotationService(FlowLibrary, FlowResource) {

    var lastResource, lastParticipant;

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
      if (input.source === 'resource' || input.source === 'participant') {
        options = _.union(options, _.map(FlowLibrary.search({cells: model.collection.toJSON()}, 'resource'), function(item){
          return {
            content: item,
            value: item,
            getDisplay: function(){
              return this.content;
            }
          };
        }));
      } else if (input.source === 'catch' || input.source === 'throw' || input.source === 'signal') {
        options = _.union(options, _.map(FlowLibrary.search({cells: model.collection.toJSON()}, input.source), function(item){
          return {
            content: item,
            value: item,
            getDisplay: function(){
              return this.content;
            }
          };
        }));
      } else if (input.source === 'media') {
        options = _.map(FlowResource.getAllMedia(), function(entity) {
          return {
            value: entity.id,
            content: entity.name,
            getDisplay: function(){
              return this.content;
            }
          };
        });
      } else if (input.source === 'queue') {
        options = _.map(FlowResource.getActiveQueues(), function(entity) {
          return {
            value: entity.id,
            content: entity.name,
            getDisplay: function(){
              return this.content;
            }
          };
        });
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
          if(input.type === 'select' || input.type === 'typeahead' || input.type === 'autocomplete'){
            var options = buildOptions(model, input);

            if(options.length === 1){
              joint.util.setByPath(model, 'attributes.' + input.path, options[0].value, '.');
            }
          }
        });
      },

      setLastResource: function(resource){
        lastResource = resource;
      },

      setLastParticipant: function(participant){
        lastParticipant = participant;
      },

      populatePreviousOption: function(model) {
        var inputs = getDefinition(model).inputs;
        _.each(inputs, function(input){
          if(input.type === 'select' || input.type === 'typeahead' || input.type === 'autocomplete'){
            var options = buildOptions(model, input);
            if(input.source === 'participant'){
              if(_.find(options, {value: lastParticipant})){
                joint.util.setByPath(model, 'attributes.' + input.path, lastParticipant, '.');
              }
            }
            if(input.source === 'resource'){
              if(_.find(options, {value: lastResource})){
                joint.util.setByPath(model, 'attributes.' + input.path, lastResource, '.');
              }
            }
          }
        });
      }
    };
  }

  angular.module('liveopsConfigPanel').service('FlowNotationService', FlowNotationService);
})();
