(function() {
  'use strict';

  function FlowNotationService(FlowLibrary, FlowResource, lodash) {

    var lastResource, lastParticipant;

    function getDefinition(model){
      var modelType = model.get('type');
      //If we're dealing with an activity
      if (modelType === 'liveOps.activity') {
        var type = model.get('activityType');
        if(type === 'task'){
          return lodash.findWhere(FlowLibrary.listActivities(), {name: model.get('name')});
        }
        else if(type === 'call-activity'){
          return lodash.findWhere(FlowLibrary.listActivities(), {flow: model.get('flow'), version: model.get('version')});
        }
      }
      //if we're dealing with an event
      if (modelType === 'liveOps.event') {
        return lodash.findWhere(FlowLibrary.listEvents(), {entity: model.get('entity'), type: model.get('name')});
      }
      //if we're dealing with a link
      if (modelType === 'liveOps.link') {
        return lodash.findWhere(FlowLibrary.listLinks(), {type: model.get('linkType')});
      }
      //if we're dealing with a template
      if (modelType === 'liveOps.template') {
        return lodash.findWhere(FlowLibrary.listTemplates(), {name: model.get('name')});
      }
      //if we're dealing with a gateway
      if (modelType === 'liveOps.gateway') {
        return {inputs: []};
      }
    }

    function buildOptions(model, input) {
      var options = input.options || [];
      if (input.source === 'resource' || input.source === 'participant') {
        options = lodash.union(options, lodash.map(FlowLibrary.search({cells: model.collection.toJSON()}, 'resource'), function(item){
          return {
            content: item,
            value: item,
            getDisplay: function(){
              return this.content;
            }
          };
        }));
      } else if (input.source === 'catch' || input.source === 'throw' || input.source === 'signal') {
        options = lodash.union(options, lodash.map(FlowLibrary.search({cells: model.collection.toJSON()}, input.source), function(item){
          return {
            content: item,
            value: item,
            getDisplay: function(){
              return this.content;
            }
          };
        }));
      } else if (input.source === 'media') {
        options = lodash.map(FlowResource.getAllMedia(), function(entity) {
          return {
            value: entity.id,
            content: entity.name,
            getDisplay: function(){
              return this.content;
            }
          };
        });
      } else if (input.source === 'queues') {
        options = lodash.map(FlowResource.getActiveQueues(), function(entity) {
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
        return lodash.map(inputs, function(input){
          input = lodash.clone(input);
          if(input.type === 'select' || input.type === 'typeahead' || input.type === 'autocomplete'){
            input.options = buildOptions(model, input);
          }
          return input;
        });
      },

      populateSingleOption: function(model) {
        var self = this,
            inputs = getDefinition(model).inputs;

        lodash.each(inputs, function(input){
          if(input.type === 'select' || input.type === 'typeahead' || input.type === 'autocomplete'){
            var options = buildOptions(model, input);

            if(options.length === 1){
              joint.util.setByPath(model, 'attributes.' + input.path, options[0].value, '.');
              if(input.source === 'participant'){
                self.setLastParticipant(options[0].value);
              }
              else if(input.source === 'resource'){
                self.setLastResource(options[0].value);
              }
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
        lodash.each(inputs, function(input){
          if(input.type === 'select' || input.type === 'typeahead' || input.type === 'autocomplete'){
            var options = buildOptions(model, input);
            if(input.source === 'participant'){
              if(lodash.find(options, {value: lastParticipant})){
                joint.util.setByPath(model, 'attributes.' + input.path, lastParticipant, '.');
              }
            }
            if(input.source === 'resource'){
              if(lodash.find(options, {value: lastResource})){
                joint.util.setByPath(model, 'attributes.' + input.path, lastResource, '.');
              }
            }
          }
        });
      },

      parseNotations: function(data){
        var notations = {
          activities: [],
          events: [],
          links: [],
          templates: []
        };

        var json;

        lodash.each(data, function(notation) {
          if(notation.active && notation.activeNotation) {
            json = (JSON.parse(notation.activeNotation.notation));

            if (json.entity === 'activity') {
              notations.activities.push(json);
            } else if (json.entity === 'start' || json.entity === 'throw' || json.entity === 'catch') {
              notations.events.push(json);
            } else if (json.entity === 'link') {
              notations.links.push(json);
            } else if (json.entity === 'template') {
              notations.templates.push(json);
            }
          }
        });

        notations.activities = lodash.sortBy(notations.activities, 'label');
        notations.templates = lodash.sortBy(notations.templates, 'label');
        notations.events = lodash.sortBy(notations.events, 'index');

        return notations;
      }
    };
  }

  angular.module('liveopsConfigPanel').service('FlowNotationService', FlowNotationService);
})();
