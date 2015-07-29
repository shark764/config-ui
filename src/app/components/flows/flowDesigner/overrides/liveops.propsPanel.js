(function() {
  'use strict';

  function buildTemplate (notation) {
    // Start the template
    var tpl = '<div id="details-pane"><form class="details-form"><div class="detail-body-pane" style="height: 100%;">';

    // Util object to build the various parts of the form
    // depending on what is needed
    var formBuilder = {
      groupHeader: function(groupName) {
        var formSection = '<div class="divider-header"><h4>'+ groupName.capitalize() + '</h4></div>';
        formSection += '<div class="input-group-wrapper id="input-group-' + groupName + '"></div>';
        return formSection;
      },

      string: function (input, index) {
        var formSection = '<div class="input-group"';
        formSection += ' ng-hide="' + input.hidden + '"';
        formSection += '><label>' + input.label + '</label><div>';
        formSection += '<input type="text" ng-model="notation.model.attributes.' + input.path + '"';
        if (input.disabled === true) { formSection += ' disabled="disabled"'; }
        formSection += ' ng-change="onInputChange(notation.model, notation.model.attributes.' + input.path + ', notation.model.attributes.inputs[' + index + '].path)"';
        formSection += '></input></div></div>';
        return formSection;
      },

      number: function (input, index) {
        var formSection = '<div class="input-group"';
        formSection += ' ng-hide="' + input.hidden + '"';
        formSection += '><label>' + input.label + '</label><div>';
        formSection += '<input type="text" ng-model="notation.model.attributes.' + input.path + '"';
        if (input.disabled === true) { formSection += ' disabled="disabled"'; }
        formSection += ' ng-change="onInputChange(notation.model, notation.model.attributes.' + input.path + ', notation.model.attributes.inputs[' + index + '].path)"';
        formSection += '></input></div></div>';
        return formSection;
      },

      textarea: function (input, index) {
        var formSection = '<div class="input-group"';
        formSection += ' ng-hide="' + input.hidden + '"';
        formSection += '><label>' + input.label + '</label><div>';
        formSection += '<textarea ng-model="notation.model.attributes.' + input.path + '"';
        if (input.disabled === true) { formSection += ' disabled="disabled"'; }
        formSection += ' ng-change="onInputChange(notation.model, notation.model.attributes.' + input.path + ', notation.model.attributes.inputs[' + index + '].path)"';
        formSection += '></textarea></div></div>';
        return formSection;
      },

      select: function (input, index) {
        var formSection = '<div class="input-group"';
        formSection += ' ng-hide="' + input.hidden + '"';
        formSection += '><label>' + input.label + '</label><div>';
        formSection += '<select ng-model="notation.model.attributes.' + input.path + '"';
        if (input.disabled === true) { formSection += ' disabled="disabled"'; }
        formSection += ' ng-change="onInputChange(notation.model, notation.model.attributes.' + input.path + ', notation.model.attributes.inputs[' + index + '].path)"';
        formSection += '><option value="">Please select one...</option>';
        _.each(input.options, function (opt) {
          formSection += '<option value="' + opt.value + '">' + opt.content + '</option>';
        });
        formSection += '</select></div></div>';
        return formSection;
      },

      typeahead: function (input, index) {
        var formSection = '<div class="input-group"';
        formSection += ' ng-hide="' + input.hidden + '"';
        formSection += '><label>' + input.label + '</label><div>';
        formSection += '<type-ahead hover="true" placeholder="Search..." items="notation.model.attributes.inputs[' + index + '].options" on-select="setEntityProp(' + index + ')" selected-item="selectedItem" name-field="content" is-required="false">';
        formSection += '</div></div>';
        return formSection;
      },

      boolean: function (input) {
        var formSection = '<div class="input-group"';
        formSection += ' ng-hide="' + input.hidden + '"';
        formSection += '><label>' + input.label + '</label>';
        formSection += '<toggle ng-model="notation.model.attributes.' + input.path + '" class="status-toggle"><label class="switch switch-green"><input type="checkbox" class="switch-input"';
        if (input.disabled === true) { formSection += ' disabled="disabled"'; }
        formSection += '><span class="switch-label" data-on="On" data-off="Off"></span><span class="switch-handle"></span></label></toggle></div>';
        return formSection;
      }
    };

    // Build the group containers
    var groups = _.keys(_.groupBy(notation.model.attributes.inputs, 'group')).sort();
    _.each(groups, function(group) {
      tpl += formBuilder.groupHeader(group);
    });

    // Sort by index
    notation.model.attributes.inputs.sort(function(a, b) {
      return parseFloat(a.index) + parseFloat(b.index);
    });

    // Iterate over the inputs on the notation, inserting the
    // appropriate type at the appropriate location within
    // the template
    _.each(notation.model.attributes.inputs, function (input, index) {
      var formSection = formBuilder[input.type](input, index);
      var groupIndex = tpl.indexOf(input.group) + input.group.length + 2;
      tpl = tpl.insert(groupIndex, formSection);
    });

    // Finish off the template
    return tpl += '</div></div></form>';
  }

  var propsPanel = function ($compile, $timeout, FlowNotationService) {
    return {
      scope: {
        notation: '=notation',
        medias: '=medias'
      },
      template: '<div class="propsPanel"><h1 ng-show="loading"><i class="fa fa-spinner fa-spin"></i></h1></div>',
      restrict: 'E',
      link: function (scope, element) {
        scope.loading = true;

        scope.selectedItem = null;
        scope.setEntityProp = function(index) {
          scope.notation.model.attributes.params[scope.notation.model.attributes.inputs[index].name] = {
            id: scope.selectedItem.value
          };
          console.log(scope.notation);
        };

        // Populate typeahead search collections with relevant API sources
        _.each(scope.notation.model.attributes.inputs, function (input, index) {
          if (input.type === 'typeahead' && input.source !== undefined) {
            if (input.source === 'media') {
              scope.notation.model.attributes.inputs[index].options = _.map(FlowNotationService.media, function(entity) {
                return {
                  value: entity.id,
                  content: entity.source || entity.name
                };
              });
            } else if (input.source === 'queue') {
              scope.notation.model.attributes.inputs[index].options = _.map(FlowNotationService.queue, function(entity) {
                return {
                  value: entity.id,
                  content: entity.source || entity.name
                };
              });
            }
          }
        });

        window.notation = scope.notation;

        scope.onInputChange = function(model, value, path) {
          scope.notation.model.onInputChange(model, value, path);
        };

        var content = $compile(buildTemplate(scope.notation))(scope);
        angular.element(element[0].children[0]).append(content);

        $timeout(function() {
          scope.loading = false;
        });
      }
    };
  };

  angular.module('liveopsConfigPanel').directive('propsPanel', propsPanel);
})();