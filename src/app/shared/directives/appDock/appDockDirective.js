'use strict';

angular.module('liveopsConfigPanel')
  .directive('appDock', ['$window', '$rootScope', '$timeout', 'appFlags',
    function ($window, $rootScope, $timeout, appFlags) {
      return {
        restrict: 'E',
        templateUrl: 'app/shared/directives/appDock/appDock.html',
        scope: {
          ngResource: '=',
          toolbarStatus: '='
        },
        link: function (scope, attrs, elem) {
          // feature flag to temporarily suppress the appdock
          if (!appFlags.APPDOCK) {
            return;
          }

          scope.apps = [];
          scope.showAppDock = false;
          scope.showApps = false;
          scope.isLoadingAppDock = true;

          function resetAgentToolbarPosition() {
            // once everything has loaded and executed on the page...
            $timeout(function () {
              // use the calculated height of the app dock as the
              // css 'bottom' property to move the agent toolbar
              // up or down along with it
              /**
               * TODO: remove agent toolbar when new interaction monitoring is completed 
               */
              var toolbarElem = angular.element('#config-ui-agent-toolbar');
              var toolbarElem2 = angular.element('#supervisorToolbar');
              toolbarElem2.css({
                bottom: elem.$$element[0].firstChild.offsetHeight
              });
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
            scope.$broadcast('closingPanel');
            resetAgentToolbarPosition();
          };

          $window.addApp = function (app) {
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

          //Added event to know when to stop using this loading gif, as the main AppDock page would have been loaded once
          scope.$on('appDockStopLoading', function () {
            scope.isLoadingAppDock = false;
          });
        }
      };
    }
  ]);
