'use strict';

angular.module('liveopsConfigPanel')
  .directive('interactions', ['$sce', '$q', '$translate', '$interval', 'Recording', 'Messaging', 'MessagingFrom','TenantUser', 'Tenant', 'Session',
    function ($sce, $q, $translate, $interval, Recording, Messaging, MessagingFrom, TenantUser, Tenant, Session) {
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

          scope.setSelectedArtifact = function (artifact) {
            CxEngage.entities.getArtifact({
              interactionId: scope.config.id,
              tenantId: scope.config.tenantId,
              artifactId: artifact.artifactId
            }, function(error, topic, response){
              scope.$apply(function(){
                scope.selectedItem = response;
              });
            });
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

          // try to get message transcripts, which might result in a 404
          function messages() {
            var messaging = Messaging.cachedQuery({
              tenantId: scope.config.tenantId,
              interactionId: scope.config.id
            }, 'Messaging' + scope.interactionId, true);

            return $q.when(messaging.$promise).then(function (response) {
              return $q.all(
                _.map(response, function (val, key) {
                  if (val.payload.from !== 'CxEngage') {
                      var tenantId = response[key].payload.tenantId ? response[key].payload.tenantId : false;
                      
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
                scope.isLoadingAppDock = false;
                return response;
              }, function (reason){
                if(reason.status === 401 || reason.status === 403){
                  scope.showNoPermissionsMsg = true;
                }
                scope.isLoadingAppDock = false;
                return reason;
              })
            }, function (err) {
               if (err.status === 401 || err.status === 403) {
                 scope.showNoPermissionsMsg = true;
               }
              scope.isLoadingAppDock = false;
              return err;
            });
          }

          function recordings() {
            CxEngage.entities.getArtifacts({
              interactionId: scope.config.id,
              tenantId: scope.config.tenantId
            }, function(error, topic, response){
              if (error) {
                scope.showNoResultsMsg = true;
                scope.isLoadingAppDock = false;
              }

              scope.artifacts = _.filter(response.results, function(item) {
                return item.artifactType === 'audio-recording' ||
                       item.artifactType === 'qm-audio-recording' ||
                       item.artifactType === 'qm-screen-recording';
              });

              if (scope.artifacts.length > 0) {
                CxEngage.entities.getArtifact({
                  interactionId: scope.config.id,
                  tenantId: scope.config.tenantId,
                  artifactId: scope.artifacts[0].artifactId
                }, function(error, topic, response){
                  scope.isLoadingAppDock = false;
                  scope.showNoResultsMsg = false;
                  tenantTimezone();
                  scope.setSelectedItem(response);
                  scope.$emit('appDockDataLoaded');
                });
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

          function fetchInteractionData() {
            var interactionData;

            switch(scope.config.type) {
              case 'messaging':
                interactionData = messages();
                break;
              case 'sms':
                interactionData = messages();
                break;
              default:
                interactionData = [];
            }

            return interactionData;
          }

          // once we've attempted to get both, set interactionData to
          // be the first response that's actually an array
          if (scope.config.type !== 'voice') {
            $q.all([
                fetchInteractionData(),
                tenantTimezone()
              ])
              .then(function (interactionsResponse) {

                scope.interactionData = _.find(interactionsResponse, function (item) {
                  return angular.isArray(item);
                });

                // if none of the API calls got us the expected array of
                // data, then that means there is no data for the given
                // interaction, so show the error message
                if (!angular.isArray(scope.interactionData) || (angular.isArray(scope.interactionData) && scope.interactionData.length < 1)) {
                    scope.isLoadingAppDock = false;
                    if(scope.showNoPermissionsMsg === false){
                        scope.showNoResultsMsg = true;
                    }
                } else {
                  scope.isLoadingAppDock = false;
                  // otherwise, if no item has been selected yet, then automatically
                  // set the first item to display its data on load
                  if (!scope.selectedItem) {
                    scope.setSelectedItem(scope.interactionData[0]);
                  }
                }

                scope.$emit('appDockDataLoaded');
              });
          } else {
            recordings();
          }
        }
      };
    }
  ]);
