'use strict';

angular.module('liveopsConfigPanel')
  .directive('interactions', ['$sce', '$q', '$translate', '$timeout', 'Recording', 'Messaging', 'MessagingFrom', 'Tenant', 'Session',
    function ($sce, $q, $translate, $timeout, Recording, Messaging, MessagingFrom, Tenant, Session) {
      return {
        restrict: 'E',
        transclude: true,
        templateUrl: 'app/shared/directives/appDock/apps/interactions/interactions.html',
        scope: {
          config: '='
        },
        link: function (scope, attr, elem) {
          scope.isLoading = true;
          // clearing out all interaction data as a safeguard
          scope.interactionData = null;
          // setting this to false so that we hide the "no results"
          // messaging until we're positive that there are indeed no results
          scope.showNoResultsMsg = false;
          // set the data from the interactions table to the scope
          scope.configData = scope.config;

          scope.setSelectedItem = function (item) {
            scope.selectedItem = item;
          };

          // using this as a "bridge" to pass timezone val down to ng-include html
          scope.TimezoneValHolder = {};

          // since the messages API doesn't give us the user's name,
          // we have to hit a separate "from" endpoint, and this maps the
          // "name" ID # from the messages API to the name as specified in
          // the "from" endpoint
          function getUserName(messageFromData) {
            var fromNameString = '';

            if (messageFromData) {
              // this wacky logic tree basically allows for the different permutations
              // of name data we might get from the "from" API
              if (messageFromData.type === 'agent') {
                return $translate.instant('appdock.messaging.agent');
              } else {
                if (messageFromData.firstName || messageFromData.lastName) {
                  if (messageFromData.firstName) {
                    fromNameString = messageFromData.firstName;
                  }

                  if (messageFromData.lastName) {
                    if (messageFromData.firstName) {
                      return fromNameString + ' ' + messageFromData.lastName
                    } else {
                      fromNameString = messageFromData.lastName;
                    }
                  }

                  return fromNameString;
                } else {
                  return $translate.instant('appdock.messaging.unknownUser');
                }
              }

            } else {
              return $translate.instant('appdock.messaging.fromFlow');
            }
          }

          // try to get message transcripts, which might result in a 404
          function messages() {
            var messaging = Messaging.cachedQuery({
              tenantId: Session.tenant.tenantId,
              interactionId: scope.config.id
            }, 'Messaging' + scope.interactionId, true);

            return $q.when(messaging.$promise).then(function (response) {
              return $q.all(
                _.map(response, function (val, key) {
                  if (val.payload.from !== 'CxEngage') {
                    var fromUser = MessagingFrom.cachedGet({
                      tenantId: Session.tenant.tenantId,
                      from: response[key].payload.from
                    });

                    return $q.when(fromUser.$promise).then(function (fromUserResponse) {
                      response[key].payload.userName = getUserName(fromUserResponse);
                    });      
                  }
                })
              ).then(function () {
                scope.isLoading = false;
                return response;
              });
            }, function (err) {
              scope.isLoading = false;
              return err;
            });
          }

          // try to get recordings, which also might result in a 404
          function recordings() {
            var recordings = Recording.cachedQuery({
              tenantId: Session.tenant.tenantId,
              interactionId: scope.config.id
            }, 'Recording' + scope.interactionId, true);

            return $q.when(recordings.$promise).then(function (response) {
              return response;
            }, function (err) {
              return err;
            });
          };

          function tenantTimezone () {
            var tenant = Tenant.cachedGet({
              id: Session.tenant.tenantId,
            });

            return $q.when(tenant.$promise).then(function (tenantData) {
              scope.TimezoneValHolder.tenantTimezone = tenantData.timezone;
            });
          }

          // once we've attempted to get both, set interactionData to
          // be the first response that's actually an array
          $q.all([
              messages(),
              recordings(),
              tenantTimezone()
            ])
            .then(function (interactionsResponse) {
              scope.interactionData = _.find(interactionsResponse, function (item) {
                return angular.isArray(item);
              });

              // if none of the API calls got us the expected array of
              // data, then that means there is no data for the given
              // interaction, so show the error message
              if (!angular.isArray(scope.interactionData)) {
                scope.showNoResultsMsg = true;
              } else {
                if (scope.interactionData[0].hasOwnProperty('payload') && scope.interactionData[0].payload.type !== 'message') {
                  scope.isLoading = false;
                }
                // otherwise, if no item has been selected yet, then automatically
                // set the first item to display its data on load
                if (!scope.selectedItem) {
                  scope.setSelectedItem(scope.interactionData[0]);
                }

              }

              scope.$emit('appDockDataLoaded');
            });
        }
      };
    }
  ]);
