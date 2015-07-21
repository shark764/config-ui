(function() {
  'use strict';

  function addDefault (inputJSON, notation) {
    // Add default property if default is defined
    if (_.isUndefined(inputJSON.default)) return;
    return notation.params[inputJSON.name] = inputJSON.default;
  }

  function buildTemplate (notation) {
    var tpl = '<div id="details-pane"><form class="details-form"><div class="detail-body-pane" style="height: 100%;">';

    var formBuilder = {
      input: function (inputJSON) {
        var formSection = '<div class="input-group">'
        formSection += '<label>' + inputJSON.label + '</label>';
        formSection += '<div><input type="text" ng-model="notation.params.' + inputJSON.name + '"';
        if (inputJSON.disabled === true) formSection += ' disabled="disabled"';
        formSection += '></input></div></div>';
        return formSection;
      },
      textarea: function (inputJSON) {
        var formSection = '<div class="input-group">'
        formSection += '<label>' + inputJSON.label + '</label>';
        formSection += '<div><textarea ng-model="notation.params.' + inputJSON.name + '"';
        if (inputJSON.disabled === true) formSection += ' disabled="disabled"';
        formSection += '></textarea></div></div>';
        return formSection;
      },
      select: function (inputJSON) {
        var formSection = '<div class="input-group">'
        formSection += '<label>' + inputJSON.label + '</label>';
        formSection += '<div><select ng-model="notation.params.' + inputJSON.name + '"';
        if (inputJSON.disabled === true) formSection += ' disabled="disabled"';
        formSection += '><option value="undefined">Select one...</option></select></div></div>';
        return formSection;
      },
      keyValList: function (inputJSON) {
        var formSection = '<div class="input-group">'
        formSection += '<label>' + inputJSON.label + '</label>';
        formSection += '<div><keyValList></keyValList></div></div>';
        return formSection;
      },
      boolean: function (inputJSON) {
        var formSection = '<div class="input-group">'
        formSection += '<label>' + inputJSON.label + '</label>';
        formSection += '<toggle class="status-toggle"><label class="switch switch-green"><input type="checkbox" class="switch-input" ng-model="notation.params.' + inputJSON.name + '"';
        if (inputJSON.disabled === true) formSection += ' disabled="disabled"';
        formSection += '><span class="switch-label" data-on="On" data-off="Off"></span><span class="switch-handle"></span></label></toggle></div>';
        return formSection;
      }
    }

    console.log('Notation:', notation);

    _.each(notation.model.attributes.inputs, function (input) {
      var formSection = formBuilder[input.type](input);
      tpl += formSection;
    });

    return tpl += '</div></div></form>';
  }

  var flowPanel = function ($compile, $timeout) {
    return {
      scope: {
        notation: '=notation'
      },
      template: '<div class="propsPanel"><h1 ng-show="loading"><i class="fa fa-spinner fa-spin"></i></h1></div>',
      restrict: 'E',
      link: function (scope, element, attrs) {
        scope.loading = true;

        console.log('NOTATION PASSED TO DIRECTIVE:', scope.notation);

        var content = $compile(buildTemplate(scope.notation))(scope);
        angular.element(element[0].children[0]).append(content);

        $timeout(function() {
          scope.loading = false;
        });

        window.scope = scope;
      }
    };
  };

  angular.module('liveopsConfigPanel').directive('flowPanel', flowPanel);
})();