'use strict';

angular.module('liveopsConfigPanel')
  .directive('interactions', ['$http', '$sce', '$q', '$translate', '$interval', 'MessagingFrom','TenantUser', 'Tenant', 'Session',
    function ($http, $sce, $q, $translate, $interval, MessagingFrom, TenantUser, Tenant, Session) {
      return {
        restrict: 'E',
        transclude: true,
        templateUrl: 'app/shared/directives/appDock/apps/interactions/interactions.html',
        scope: {
          config: '='
        },
        link: function (scope) {
          scope.showNoPermissionsMsg = false;
          var getRecordingUrl;
          //This event is to stop the loading gif for the main App Dock container, and moving forward using the one on the interactions directive
          scope.$emit('appDockStopLoading');
          scope.isLoadingAppDock = true;
          scope.token = Session.token;
          // clearing out all interaction data as a safeguard
          scope.interactionData = null;
          scope.artifacts = null;
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
                      return fromNameString + ' ' + messageFromData.lastName;
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

          function messages() {
            CxEngage.reporting.getTranscripts({
              interactionId: scope.config.id
            }, function(error, topic, response) {
              if (error || !response || !response.length || !response[0].url) {
                console.error('Failed to get transcript record', error, response);
                if (error && error.data && error.data.apiResponse && (error.data.apiResponse.status === 401 || error.data.apiResponse.status === 403)) {
                  scope.showNoPermissionsMsg = true;
                } else {
                  scope.showNoResultsMsg = true;
                }
                scope.isLoadingAppDock = false;
                return;
              }
              $http({
                method: 'GET',
                url: response[0].url,
              }).then(function(response) {
                scope.isLoadingAppDock = false;
                scope.showNoResultsMsg = false;
                tenantTimezone();
                response = response.data;
                $q.all(
                  _.map(response, function(val, key) {
                    if (val.payload.metadata && val.payload.metadata.source === 'smooch') {
                      response[key].payload.userName = response[key].payload.metadata.name;
                      return;
                    }
                    if (val.payload.from !== 'CxEngage') {
                      var tenantId = response[key].payload['tenant-id'] ? response[key].payload['tenant-id'] : false;
                      if ( tenantId && response[key].payload.metadata !== null && response[key].payload.metadata.type === 'agent' ){
                        var agentId = response[key].payload.from;
                        var userDetails = TenantUser.cachedGet({
                          tenantId: tenantId,
                          id: agentId
                        },'TenantUserCached', true);
                        return  $q.when(userDetails.$promise).then(function (userDetailsResponse) {
                            response[key].payload.userName = userDetailsResponse.$user.firstName+' '+userDetailsResponse.$user.lastName;
                        }, function (err) {
                          response[key].payload.userName = response[key].payload.from;
                        });
                      } else {
                        var fromUser = MessagingFrom.cachedGet({
                          tenantId: scope.config.tenantId,
                          from: response[key].payload.from
                        });
                        return $q.when(fromUser.$promise).then(function (fromUserResponse) {
                          response[key].payload.userName = getUserName(fromUserResponse);
                        }, function (error){
                          response[key].payload.userName = response[key].payload.from;
                        });
                      }
                    }
                  })
                ).then(function () {
                  scope.interactionData = response;
                  scope.setSelectedItem(response);
                  scope.$emit('appDockDataLoaded');
                });
              }, function urlErrorCallback(reason) {
                console.error('Failed to load transcript URL', reason);
                if (reason.status === 401 || reason.status === 403) {
                  scope.showNoPermissionsMsg = true;
                } else {
                  scope.showNoResultsMsg = true;
                }
                scope.isLoadingAppDock = false;
              });
            });
          }

          function recordings() {
            CxEngage.entities.getRecordings({
              interactionId: scope.config.id,
              tenantId: scope.config.tenantId
            }, function(error, topic, response){
              if (error) {
                scope.showNoResultsMsg = true;
                scope.isLoadingAppDock = false;
              }

              if (response && response.length > 0) {

                scope.artifacts = response
                                  .filter(function (d) {
                                    return !d.engageRecorder;
                                  })
                                  .map(function (d) {
                                    d.durationHMMSS = new Date(d.duration * 1000).toISOString().substr(11, 8);
                                    return d;
                                  });

                scope.isLoadingAppDock = false;
                if (scope.artifacts && scope.artifacts.length > 0) {
                  scope.showNoResultsMsg = false;
                } else {
                  scope.showNoResultsMsg = true;
                }
                tenantTimezone();
                scope.setSelectedItem(scope.artifacts[0]);
                scope.$emit('appDockDataLoaded');
              } else {
                scope.isLoadingAppDock = false;
                scope.showNoResultsMsg = true;
              }
            });
            scope.$emit('appDockDataLoaded');
          }

          function tenantTimezone () {
            var tenant = Tenant.cachedGet({
              id: Session.tenant.tenantId,
            });

            return $q.when(tenant.$promise).then(function (tenantData) {
              scope.TimezoneValHolder.tenantTimezone = tenantData.timezone;
            });
          }

          scope.$on('appDockDataLoaded', function () {
            $interval.cancel(getRecordingUrl);
            var audioCurrentTime = 0;

            getRecordingUrl = $interval(function () {
              var audioPlayer = document.getElementById('audio-player');

              // first off, rewind audio every time a new recording is selected
              audioPlayer.onloadeddata = function () {
                audioPlayer.currentTime = 0;
              };

              var audioIsPlaying = false;
              if (!(audioPlayer.ended || audioPlayer.paused)) {
                audioIsPlaying = true;
              }

              if (scope.selectedItem && scope.selectedItem.url && audioPlayer && audioIsPlaying !== true) {
                return $q.when(recordings()).then(function (recordingsResponse) {
                  // get the stopping point before we reset the audio player
                  // with a new src url
                  audioCurrentTime = audioPlayer.currentTime;
                  scope.interactionData = recordingsResponse;
                  scope.isLoadingAppDock = false;

                  // if the audio file was paused at some point after
                  // the beginning of the playback, then skip back to that point
                  audioPlayer.onloadeddata = function () {
                    audioPlayer.currentTime = audioCurrentTime;
                  };
                });
              }
            }, 300000);
          });

          scope.$on('closingPanel', function () {
            $interval.cancel(getRecordingUrl);
          });

          if (scope.config.type !== 'voice') {
            messages();
          } else {
            recordings();
          }
        }
      };
    }
  ]);
