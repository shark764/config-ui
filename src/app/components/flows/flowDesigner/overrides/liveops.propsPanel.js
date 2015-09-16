(function() {
  'use strict';

  function buildTemplate (inputs) {
    // Start the template
    var tpl = '<div id="details-pane" class="designer-details-pane"><form class="details-form"><div class="detail-body-pane" style="height: 100%;">';

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
        formSection += ' placeholder="' + input.placeholder + '"';
        formSection += ' ng-disabled="' + input.disabled + '"';
        formSection += ' ng-change="onInputChange(notation.model, notation.model.attributes.' + input.path + ', inputs[' + index + '])"';
        formSection += '></input></div></div>';
        return formSection;
      },

      number: function (input, index) {
        var formSection = '<div class="input-group"';
        formSection += ' ng-hide="' + input.hidden + '"';
        formSection += '><label>' + input.label + '</label><div>';
        formSection += '<input type="text" ng-model="notation.model.attributes.' + input.path + '"';
        formSection += ' placeholder="' + input.placeholder + '"';
        formSection += ' ng-disabled="' + input.disabled + '"';
        formSection += ' ng-change="onInputChange(notation.model, notation.model.attributes.' + input.path + ', inputs[' + index + '])"';
        formSection += '></input></div></div>';
        return formSection;
      },

      textarea: function (input, index) {
        var formSection = '<div class="input-group"';
        formSection += ' ng-hide="' + input.hidden + '"';
        formSection += '><label>' + input.label + '</label><div>';
        formSection += '<textarea ng-model="notation.model.attributes.' + input.path + '"';
        formSection += ' placeholder="' + input.placeholder + '"';
        formSection += ' ng-disabled="' + input.disabled + '"';
        formSection += ' ng-change="onInputChange(notation.model, notation.model.attributes.' + input.path + ', inputs[' + index + '])"';
        formSection += '></textarea></div></div>';
        return formSection;
      },

      select: function (input, index) {
        console.log(notation);
        var formSection = '<div class="input-group"';
        formSection += ' ng-hide="' + input.hidden + '"';
        formSection += '><label>' + input.label + '</label><div>';
        formSection += '<select ng-model="notation.model.attributes.' + input.path + '"';
        formSection += ' ng-disabled="' + input.disabled + '"';
        formSection += ' ng-options="item.value as item.content for item in inputs[' + index + '].options"';
        formSection += ' ng-change="onInputChange(notation.model, notation.model.attributes.' + input.path + ', inputs[' + index + '])"';
        // formSection += '><option value="undefined">Please select one...</option>';
        // _.each(input.options, function (opt) {
        //   formSection += '<option value="' + opt.value + '">' + opt.content + '</option>';
        // });
        formSection += '></select></div></div>';
        return formSection;
      },

      typeahead: function (input, index) {
        var formSection = '<div class="input-group"';
        formSection += ' ng-hide="' + input.hidden + '"';
        formSection += '><label>' + input.label + '</label><div>';
        formSection += '<type-ahead hover="true" placeholder="Search..."';
        if (notation.model.attributes.params && notation.model.attributes.params[input.name] &&  _.findWhere(inputs[index].options, { value: notation.model.attributes.params[input.name] })) {
          formSection += ' prefill="\'' + _.findWhere(inputs[index].options, { value: notation.model.attributes.params[input.name] }).content + '\'"';
        }
        formSection += ' placeholder="' + input.placeholder + '"';
        formSection += ' items="inputs[' + index + '].options" on-select="setEntityProp(selectedItem, ' + index + ')" name-field="content" is-required="false">';
        formSection += '</div></div>';
        return formSection;
      },

      boolean: function (input, index) {
        var formSection = '<div class="input-group"';
        formSection += ' ng-hide="' + input.hidden + '"';
        formSection += '><label>' + input.label + '</label>';
        formSection += '<toggle ng-model="notation.model.attributes.' + input.path + '"';
        if (_.has(input, 'trueValue')) {
          formSection += ' true-value="' + input.trueValue + '"';
        }
        if (_.has(input, 'falseValue')) {
          formSection += ' false-value="' + input.falseValue + '"';
        }
        formSection += ' "class="status-toggle"></toggle>';
        formSection += '</div>';
        return formSection;
      },

      timestamp: function(input, index) {
        var formSection = '<div class="input-group"';
        formSection += ' ng-hide="' + input.hidden + '"';
        formSection += '><label>' + input.label + '</label>';
        formSection += '<div class="timestamp">'
        formSection += '<input type="text" ng-model="notation.model.attributes.' + input.path + '.value"';
        formSection += ' ng-change="onInputChange(notation.model, notation.model.attributes.' + input.path + ', inputs[' + index + '])"';
        formSection += '></input>'
        formSection += '<select ng-model="notation.model.attributes.' + input.path + '.measurement"';
        formSection += ' ng-change="onInputChange(notation.model, notation.model.attributes.' + input.path + ', inputs[' + index + '])"';
        formSection += '>'
        formSection += '<option value="seconds">Seconds</option>';
        formSection += '<option value="minutes">Minutes</option>';
        formSection += '<option value="hours">Hours</option>';
        formSection += "</select>"
        formSection += '</div></div>';
        return formSection;
      }
    };

    // Add resize dragger
    tpl += '<single-element-resize-handle id="resize-pane" element-id="inspector-container" min-width="350" max-width="520" class="resize-pane designer-resize-pane"></single-element-resize-handle>';

    // Build the group containers
    var groups = _.keys(_.groupBy(inputs, 'group')).sort();
    _.each(groups, function(group) {
      tpl += formBuilder.groupHeader(group);
    });

    // Sort by index
    inputs.sort(function(a, b) {
      return parseFloat(a.index) < parseFloat(b.index);
    });

    // Iterate over the inputs on the notation, inserting the
    // appropriate type at the appropriate location within
    // the template
    _.each(inputs, function (input, index) {
      var formSection = formBuilder[input.type](input, index);
      var groupIndex = tpl.indexOf(input.group) + input.group.length + 2;
      tpl = tpl.insert(groupIndex, formSection);
    });

    // Finish off the template
    return tpl += '</div></div></form>';
  }

  var propsPanel = function ($compile, $timeout, $window, FlowNotationService) {
    return {
      scope: {
        notation: '=notation',
        medias: '=medias',
        inputs: '=inputs'
      },
      template: '<div class="propsPanel"><h1 ng-show="loading"><i class="fa fa-spinner fa-spin"></i></h1></div>',
      restrict: 'E',
      link: function (scope, element) {
        scope.loading = true;

        scope.setEntityProp = function(selectedItem, index) {
          scope.notation.model.attributes.params[scope.inputs[index].name] = selectedItem.value;
        };

        // Populate typeahead search collections with relevant API sources
        _.each(scope.inputs, function (input, index) {
          if (input.type === 'typeahead' && input.source !== undefined) {
            if (input.source === 'media') {
              input.options = _.map(FlowNotationService.media, function(entity) {
                return {
                  value: entity.id,
                  content: entity.name
                };
              });
              if (scope.notation.model.attributes.params.media) {
                _.each(input.options, function (opt, optIndex) {
                  if (input.path.indexOf('media') > -1) {
                    scope.selectedItem = input.options[optIndex];
                  }
                });
              }
            } else if (input.source === 'queue') {
              input.options = _.map(FlowNotationService.queue, function(entity) {
                return {
                  value: entity.id,
                  content: entity.name
                };
              });
              if (scope.notation.model.attributes.params.queue) {
                _.each(input.options, function (opt, optIndex) {
                  if (input.path.indexOf('queue') > -1) {
                    scope.selectedItem = input.options[optIndex];
                  }
                });
              }
            }
          }
        });

        $window.notation = scope.notation;

        scope.onInputChange = function(model, value, input) {
          scope.notation.model.onInputChange(model, value, input.path);

          if (input.refresh) {
            scope.$emit('rebuild')
          }
        };

        scope.$watch('notation.model.attributes.params', function(){
          console.log('params updated');
          scope.$broadcast('update:draft');
        }, true)

        var content = $compile(buildTemplate(scope.inputs))(scope);
        angular.element(element[0].children[0]).append(content);

        $timeout(function() {
          scope.loading = false;
        });
      }
    };
  };

  angular.module('liveopsConfigPanel').directive('propsPanel', propsPanel);
})();
