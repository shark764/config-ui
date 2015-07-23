(function() {
  'use strict';

  function buildTemplate (notation) {
    var tpl = '<div id="details-pane"><form class="details-form"><div class="detail-body-pane" style="height: 100%;">';

    var formBuilder = {

      string: function (inputJSON) {
        var formSection = '<div class="input-group"><label>' + inputJSON.label + '</label><div>';
        formSection += '<input type="text" ng-model="notation.params.' + inputJSON.name + '"';
        if (inputJSON.disabled === true) { formSection += ' disabled="disabled"'; }
        formSection += '></input></div></div>';
        return formSection;
      },

      number: function (inputJSON) {
        var formSection = '<div class="input-group"><label>' + inputJSON.label + '</label><div>';
        formSection += '<input type="text" ng-model="notation.params.' + inputJSON.name + '"';
        if (inputJSON.disabled === true) { formSection += ' disabled="disabled"'; }
        formSection += '></input></div></div>';
        return formSection;
      },

      textarea: function (inputJSON) {
        var formSection = '<div class="input-group"><label>' + inputJSON.label + '</label><div>';
        formSection += '<textarea ng-model="notation.params.' + inputJSON.name + '"';
        if (inputJSON.disabled === true) { formSection += ' disabled="disabled"'; }
        formSection += '></textarea></div></div>';
        return formSection;
      },

      select: function (inputJSON) {
        var formSection = '<div class="input-group"><label>' + inputJSON.label + '</label><div>';
        formSection += '<select ng-model="notation.params.' + inputJSON.name + '"';
        if (inputJSON.disabled === true) { formSection += ' disabled="disabled"'; }
        formSection += '><option value="undefined">Select one...</option></select></div></div>';
        return formSection;
      },

      typeahead: function (inputJSON) {
        var formSection = '<div class="input-group">';
        formSection += '<label>' + inputJSON.label + '</label><div>';
        formSection += '<type-ahead hover="true" placeholder="Search..." items="skills" selected-item="selected' + inputJSON.name + '" is-required="false">';
        formSection += '</div></div>';
        return formSection;
      },

      boolean: function (inputJSON) {
        var formSection = '<div class="input-group"><label>' + inputJSON.label + '</label>';
        formSection += '<toggle class="status-toggle"><label class="switch switch-green"><input type="checkbox" class="switch-input" ng-model="notation.params.' + inputJSON.name + '"';
        if (inputJSON.disabled === true) { formSection += ' disabled="disabled"'; }
        formSection += '><span class="switch-label" data-on="On" data-off="Off"></span><span class="switch-handle"></span></label></toggle></div>';
        return formSection;
      }
    };

    console.log('Notation in buildTemplate function:', notation);

    _.each(notation.model.attributes.inputs, function (input) {
      var formSection = formBuilder[input.type](input);
      tpl += formSection;
    });

    return tpl += '</div></div></form>';
  }

  var flowPanel = function ($compile, $timeout, $window) {
    return {
      scope: {
        notation: '=notation'
      },
      template: '<div class="propsPanel"><h1 ng-show="loading"><i class="fa fa-spinner fa-spin"></i></h1></div>',
      restrict: 'E',
      link: function (scope, element) {
        scope.loading = true;

        console.log('NOTATION PASSED TO DIRECTIVE:', scope.notation);

        var content = $compile(buildTemplate(scope.notation))(scope);
        angular.element(element[0].children[0]).append(content);

        $timeout(function() {
          scope.loading = false;
        });

        $window.scope = scope;
      }
    };
  };

  angular.module('liveopsConfigPanel').directive('flowPanel', flowPanel);
})();