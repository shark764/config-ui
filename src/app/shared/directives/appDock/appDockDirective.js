'use strict';

angular.module('liveopsConfigPanel')
  .directive('appDock', ['$window', '$rootScope', '$timeout',
    function ($window, $rootScope, $timeout) {
      return {
        restrict: 'E',
        templateUrl: 'app/shared/directives/appDock/appDock.html',
        scope: {
          ngResource: '=',
          toolbarStatus: '='
        },
        link: function (scope, attrs, elem, controller) {
          scope.apps = [];
          scope.showAppDock = false;
          scope.showApps = false;

          function resetAgentToolbarPosition () {
            // once everything has loaded and executed on the page...
            $timeout(function () {
              // use the calculated height of the app dock as the
              // css 'bottom' property to move the agent toolbar
              // up or down along with it 
              var toolbarElem = angular.element('#config-ui-agent-toolbar');

              if (scope.toolbarStatus) {
                toolbarElem.css({
                  bottom: elem.$$element[0].firstChild.offsetHeight
                });
              } else {
                toolbarElem.css({
                  bottom: 0
                });
              }
            });
          }

          scope.closeAppPanel = function () {
            scope.apps = [];
            scope.showApps = false;
            scope.showAppDock = false;
            resetAgentToolbarPosition();
          };

          window.addApp = function (app) {
            scope.apps = [];
            scope.showAppDock = true;
            scope.showApps = true;
            scope.apps.push(app);
            scope.$apply();
          };

          scope.toggleAppsDisplay = function () {
            scope.showApps = !scope.showApps;
            resetAgentToolbarPosition();
          };

          $rootScope.$on('logout', function () {
            scope.closeAppPanel();
          });

          scope.$on('appDockDataLoaded', function () {
            resetAgentToolbarPosition();
          });
        }
      };
    }
  ]);