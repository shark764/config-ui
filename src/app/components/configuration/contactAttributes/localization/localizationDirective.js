'use strict';

angular.module('liveopsConfigPanel')
  .directive('localization', ['$timeout', 'loEvents', 'localeNames',
    function ($timeout, loEvents, localeNames) {
      return {
        restrict: 'E',
        scope: {
          labels: '=',
          localizations: '=',
          form: '=',
          inherited: '='
        },
        templateUrl: 'app/components/configuration/contactAttributes/localization/localization.html',
        link: function(scope) {
          scope.localeNames = localeNames;

          function init() {
            scope.localizations = [];
            for (var lang in scope.labels) {
              scope.localizations.push({language: lang, label: scope.labels[lang]});
            }
          }

          init();

          scope.$on(loEvents.tableControls.itemSelected, function() {
            // clear the localizations to prevent flicker of previous selected item's localizations
            scope.localizations = null;
            $timeout(init);
          });
          scope.$on(loEvents.tableControls.itemCreate, function() {
            // clear the localizations to prevent flicker of previous selected item's localizations
            scope.localizations = null;
            $timeout(init);
          });

          scope.addLocalization = function() {
            scope.localizations.push({});
          };

          scope.removeLocalization = function(idx) {
            delete scope.labels[scope.localizations[idx].language];
            scope.localizations.splice(idx, 1);
            scope.form.$setDirty();
          };

          scope.availableLocales = function(localizationIndex) {
            return scope.localeNames.filter(function(locale) {
              return !_.find(scope.localizations, function(localization, idx) {
                if (localizationIndex === idx || typeof localization === 'undefined') {
                  return false;
                }
                return localization.language === locale.value;
              });
            });
          };

        }
      };
    }
  ]);
