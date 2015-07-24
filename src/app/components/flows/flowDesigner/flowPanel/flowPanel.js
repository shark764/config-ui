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

      string: function (input) {
        var formSection = '<div class="input-group"><label>' + input.label + '</label><div>';
        formSection += '<input type="text" ng-model="notation.model.attributes.' + input.path + '"';
        if (input.disabled === true) { formSection += ' disabled="disabled"'; }
        formSection += '></input></div></div>';
        return formSection;
      },

      number: function (input) {
        var formSection = '<div class="input-group"><label>' + input.label + '</label><div>';
        formSection += '<input type="text" ng-model="notation.model.attributes.' + input.path + '"';
        if (input.disabled === true) { formSection += ' disabled="disabled"'; }
        formSection += '></input></div></div>';
        return formSection;
      },

      textarea: function (input) {
        var formSection = '<div class="input-group"><label>' + input.label + '</label><div>';
        formSection += '<textarea ng-model="notation.model.attributes.' + input.path + '"';
        if (input.disabled === true) { formSection += ' disabled="disabled"'; }
        formSection += '></textarea></div></div>';
        return formSection;
      },

      select: function (input) {
        var formSection = '<div class="input-group"><label>' + input.label + '</label><div>';
        formSection += '<select ng-init="' + input.name + ' = \'\'" ng-model="notation.model.attributes.' + input.path + '"';
        if (input.disabled === true) { formSection += ' disabled="disabled"'; }
        formSection += '><option value="">Please select one...</option>';
        _.each(input.options, function (opt) {
          formSection += '<option value="' + opt.value + '">' + opt.content + '</option>';
        });
        formSection += '</select></div></div>';
        return formSection;
      },

      typeahead: function (input) {
        var formSection = '<div class="input-group">';
        formSection += '<label>' + input.label + '</label><div>';
        formSection += '<type-ahead hover="true" placeholder="Search..." items="skills" selected-item="selected' + input.name + '" is-required="false">';
        formSection += '</div></div>';
        return formSection;
      },

      boolean: function (input) {
        var formSection = '<div class="input-group"><label>' + input.label + '</label>';
        formSection += '<toggle ng-model="notation.model.attributes.' + input.path + '" class="status-toggle"><label class="switch switch-green"><input type="checkbox" class="switch-input"';
        if (input.disabled === true) { formSection += ' disabled="disabled"'; }
        formSection += '><span class="switch-label" data-on="On" data-off="Off"></span><span class="switch-handle"></span></label></toggle></div>';
        return formSection;
      }
    };

    // Build the group containers
    var groups = _.keys(_.groupBy(notation.model.attributes.inputs, 'group'));
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
    _.each(notation.model.attributes.inputs, function (input) {
      var formSection = formBuilder[input.type](input);
      var groupIndex = tpl.indexOf(input.group) + input.group.length + 2;
      tpl = tpl.insert(groupIndex, formSection);
    });

    // Finish off the template
    return tpl += '</div></div></form>';
  }

  var flowPanel = function ($compile, $timeout) {
    return {
      scope: {
        notation: '=notation'
      },
      template: '<div class="propsPanel"><h1 ng-show="loading"><i class="fa fa-spinner fa-spin"></i></h1></div>',
      restrict: 'E',
      link: function (scope, element) {
        scope.loading = true;

        function getThing () {
          return scope.notation.model.attributes.activityType;
        }

        scope.$watch(getThing(), function (oldV, newV) {
          console.log('Old', oldV);
          console.log('Notation changed!', newV);
        }, true);

        var content = $compile(buildTemplate(scope.notation))(scope);
        angular.element(element[0].children[0]).append(content);

        $timeout(function() {
          scope.loading = false;
        });
      }
    };
  };

  angular.module('liveopsConfigPanel').directive('flowPanel', flowPanel);
})();