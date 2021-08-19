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

          scope.renderHtml = function (htmlCode) {
            return $sce.trustAsHtml(htmlCode);
          };

          scope.getSelectedEmailRecipients = function (recipientType) {
            if (scope.selectedItem[recipientType].length === 0) {
              return;
            }

            return scope.selectedItem[recipientType]
              .map(function (recipient) {
                if (!recipient.name || recipient.name === recipient.address) {
                  return recipient.address;
                } else {
                  return recipient.name + ' <' + recipient.address + '>';
                }
              })
              .join(', ');
          };

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
              var files = response;
              var transcript = getTranscript(files);
              if (error || !response || !response.length || !transcript.url) {
                console.error('Failed to get transcript record', error, response);
                if (
                  error &&
                  error.data &&
                  error.data.apiResponse &&
                  (error.data.apiResponse.status === 401 || error.data.apiResponse.status === 403)
                ) {
                  scope.showNoPermissionsMsg = true;
                } else {
                  scope.showNoResultsMsg = true;
                }
                scope.isLoadingAppDock = false;
                return;
              }
              $http({
                method: 'GET',
                url: transcript.url
              }).then(function(response) {
                scope.isLoadingAppDock = false;
                scope.showNoResultsMsg = false;
                tenantTimezone();
                response = response.data;
                $q.all(
                  _.map(response, function(val, key) {
                    if (val.payload.metadata && val.payload.metadata.source === 'smooch') {
                      response[key].payload.userName = response[key].payload.metadata.name;
                      var messageBody = response[key].payload.body;

                      if (messageBody.file.mediaType) {
                        var file = getFileMetadata(files, messageBody.id);
                        if (file) {
                          /**
                           * Files message can be composed of a file and a caption
                           */
                          var filename = file.filename;
                          var caption = messageBody.text;
                          /**
                           * For text / image messages we don't need to process the data
                           * For file messages we need to check mediaType and caption
                           */
                          if (messageBody.contentType === 'file') {
                            var ext = null;
                            /**
                             * When we receive a mp4 file, it can bring a caption depending on
                             * how the customer attached the file.
                             * When the file is attached as video, then we render the caption
                             * and when attached as file, then we need to check if the caption
                             * becomes the filename.
                             */
                            if (caption) {
                              ext = caption.substring(caption.lastIndexOf('.') + 1).toLowerCase();
                            }
                            /**
                             * If file is not a mp4 or the file is mp4 and caption contains the filename,
                             * then we remove the caption and assign caption to filename
                             */
                            if (
                              (messageBody.file.mediaType !== 'video/mp4' && caption) ||
                              (messageBody.file.mediaType === 'video/mp4' && ext === 'mp4')
                            ) {
                              filename = caption.trim();
                              delete response[key].payload.body.text;
                            }
                          }

                          response[key].payload.body.file = _.merge(messageBody.file, {
                            filename: filename,
                            mediaUrl: file.url,
                          });
                        } else if (response[key].payload.body.file.mediaUrl.includes('smooch')) {
                          // If artifact file url doesn't exist,
                          // we delete smooch one
                          delete response[key].payload.body.file.mediaUrl;
                        }
                      }
                      if (messageBody.quotedMessage && messageBody.quotedMessage.content) {
                        getQuotedFile(messageBody.quotedMessage.content, response);
                      }
                      if (messageBody.contentType === 'formResponse') {
                        getRichMessagesFormResponses(messageBody);
                      }
                      if (messageBody.contentType === 'location') {
                        getRichMessagesLocation(messageBody);
                      }
                      if (messageBody.contentType === 'carousel' || messageBody.contentType === 'list') {
                        getRichMessagesCarousel(messageBody);
                      }
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

          function getTranscript(files) {
            var transcript = _.find(files, function(file) {
              return file && file.metadata && file.metadata.transcript;
            });
            if (!transcript) {
              return files[0];
            }
            return transcript;
          }

          function getFileMetadata(files, messageId) {
            return _.find(files, function(file) {
              return file && file.metadata && file.metadata.messageId === messageId;
            });
          }

          function getQuotedFile(content, messages) {
            if (content) {
              for (var i = 0; i < messages.length; i++) {
                if (messages[i].payload.body.id === content.id) {
                  if (messages[i].payload.body.file && messages[i].payload.body.file.mediaUrl) {
                      content.file = messages[i].payload.body.file;
                      break;
                  }
                }
              }
              if (content.file && content.file.mediaUrl && content.file.mediaUrl.includes('smooch')) {
                delete content.file.mediaUrl;
              }
            }
          }

          function getRichMessagesFormResponses(message) {
            try {
              var responses = JSON.parse(message.text);
              if (responses && responses.responses.length > 0) {
                message.formResponses = responses.responses;
              }
            } catch (error) {
              // in case JSON.parse fails, catch the error and use message.text instead
              // (update contentType so it renders properly)
              message.contentType = 'text';
            }
          }

          function getRichMessagesLocation(message) {
            if (message.text.includes('\n')) {
              var location = message.text.split('\n');
              message.text = location[0];
              message.locationUri = location[1];
            }
          }

          function getRichMessagesCarousel(message) {
            if (message.text.includes('\n\n')) {
              message.carouselItems = [];
              var carouselItems = message.text.split('\n\n');
              carouselItems.forEach(function(carouselItem) {
                if (carouselItem.includes('\n')) {
                  var carouselItemsContent = [];
                  var contentUri;
                  var itemContents = carouselItem.split('\n');
                  itemContents.forEach(function(itemContent) {
                    if (itemContent.includes('http')) {
                      const text = itemContent.substring(0, itemContent.indexOf('http'));
                      const hyperlink = itemContent.substring(itemContent.indexOf('http'), itemContent.length);
                      contentUri = {
                        text: text,
                        hyperlink: hyperlink
                      };
                    } else {
                      carouselItemsContent.push(itemContent);
                    }
                  });
                  message.carouselItems.push({
                    itemContent: carouselItemsContent,
                    contentUri: contentUri
                  });
                }
              });
            }
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

          function emails() {
            CxEngage.reporting.getEmailTranscripts(
              {
                interactionId: scope.config.id,
                tenantId: scope.config.tenantId,
              },
              function (error, topic, response) {
                if (error || !response || !response.length) {
                  console.error(
                    'Failed to get transcript record',
                    error,
                    response
                  );
                  if (
                    error &&
                    error.data &&
                    error.data.apiResponse &&
                    (error.data.apiResponse.status === 401 ||
                      error.data.apiResponse.status === 403)
                  ) {
                    scope.showNoPermissionsMsg = true;
                  } else {
                    scope.showNoResultsMsg = true;
                  }
                  scope.isLoadingAppDock = false;
                  return;
                }

                response = response.filter(function (artifact) {
                  return artifact.files.length > 0;
                });

                var renderBodyAs = 'html';
                var promisesObject = {};
                response.forEach(function (artifact, index) {
                  var bodyFile = _.find(artifact.files, function (file) {
                    return (
                      file &&
                      ((file.contentType.toLowerCase().includes('text/html') &&
                        file.filename === 'body') ||
                        file.filename === 'htmlBody')
                    );
                  });
                  if (!bodyFile) {
                    bodyFile = _.find(artifact.files, function (file) {
                      return (
                        file &&
                        file.contentType.toLowerCase().includes('text/plain') &&
                        (file.filename === 'body' ||
                          file.filename === 'plainTextBody')
                      );
                    });
                    renderBodyAs = 'plainText';
                    console.warn(
                      'Unable to find html file for email, using plainText file instead',
                      artifact && artifact.artfactId
                    );
                  }
                  if (bodyFile) {
                    var emailRequest = $http({
                      method: 'GET',
                      url: bodyFile.url,
                      transformResponse: function (value) {
                        return value;
                      },
                    });
                    if (index === 0) {
                      promisesObject.email = emailRequest;
                    } else {
                      promisesObject.reply = emailRequest;
                    }
                  } else {
                    console.warn(
                      'Unable to find email for',
                      artifact && artifact.artfactId,
                      artifact
                    );
                  }
                  var manifestEmail = _.find(artifact.files, function (file) {
                    return (
                      file &&
                      file.contentType
                        .toLowerCase()
                        .includes('application/json') &&
                      file.filename === 'manifest.json'
                    );
                  });
                  if (manifestEmail) {
                    var manifestRequest = $http({
                      method: 'GET',
                      url: manifestEmail.url,
                      transformResponse: function (value) {
                        return value;
                      },
                    });
                    if (index === 0) {
                      promisesObject.manifest = manifestRequest;
                    } else {
                      promisesObject.replyManifest = manifestRequest;
                    }
                  }
                });

                $q.all(promisesObject)
                  .then(function (promisesResponse) {
                    var emailResponses = [];
                    var email = promisesResponse.email;
                    if (email) {
                      if (promisesResponse.manifest) {
                        var manifest = JSON.parse(
                          promisesResponse.manifest.data
                        );
                        _.merge(email, {
                          subject: manifest.subject,
                          from: manifest.from,
                          to: manifest.to,
                          cc: manifest.cc,
                          bcc: manifest.bcc,
                        });
                      }
                      emailResponses.push(email);
                    }

                    var reply = promisesResponse.reply;
                    if (reply) {
                      if (promisesResponse.replyManifest) {
                        var replyManifest = JSON.parse(
                          promisesResponse.replyManifest.data
                        );
                        _.merge(reply, {
                          subject: replyManifest.subject,
                          from: replyManifest.from,
                          to: replyManifest.to,
                          cc: replyManifest.cc,
                          bcc: replyManifest.bcc,
                        });
                      }
                      emailResponses.push(reply);
                    }

                    emailResponses.forEach(function (emailResponse, index) {
                      if (emailResponse !== undefined) {
                        var attachments = [];
                        var artifact = response[index];

                        artifact.files.forEach(function (file) {
                          if (file && file.filename !== 'manifest.json') {
                            var fileContentType = file.contentType.toLowerCase();
                            if (file.contentType.includes('name=')) {
                              file.filename = file.contentType.substring(
                                file.contentType.indexOf('name=') + 5
                              );
                            } else if (
                              fileContentType.includes('text/html') &&
                              (file.filename === 'body' ||
                                file.filename === 'htmlBody')
                            ) {
                              file.filename += '.html';
                            } else if (
                              fileContentType.includes('text/plain') &&
                              (file.filename === 'body' ||
                                file.filename === 'plainTextBody')
                            ) {
                              file.filename += '.txt';
                            }
                            attachments.push(file);
                          }
                        });

                        _.merge(emailResponse, {
                          artifactId: artifact.artifactId,
                          created: artifact.created,
                          attachments: attachments,
                          renderBodyAs: renderBodyAs,
                        });
                      }
                    });

                    emailResponses = _.without(emailResponses, undefined);

                    if (emailResponses.length > 0) {
                      scope.interactionData = emailResponses;
                      scope.setSelectedItem(emailResponses[0]);
                      scope.showNoResultsMsg = false;
                      tenantTimezone();
                    } else {
                      scope.showNoResultsMsg = true;
                    }
                    scope.isLoadingAppDock = false;
                  })
                  .catch(function (err) {
                    console.error(
                      'An error occurred while fetching email transcript files',
                      err
                    );
                    scope.isLoadingAppDock = false;
                    scope.showNoResultsMsg = true;
                  });
              }
            );
          }

          scope.$on('appDockDataLoaded', function () {
            $interval.cancel(getRecordingUrl);
            var audioCurrentTime = 0;

            getRecordingUrl = $interval(function () {
              var audioPlayer = document.getElementById('audio-player');

              // first off, rewind audio every time a new recording is selected
              if (audioPlayer) {
                audioPlayer.onloadeddata = function () {
                  audioPlayer.currentTime = 0;
                };

                var audioIsPlaying = false;
                if (!(audioPlayer.ended || audioPlayer.paused)) {
                  audioIsPlaying = true;
                }
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

          if (scope.config.type === 'email') {
            emails();
          } else if (scope.config.type !== 'voice') {
            messages();
          } else {
            recordings();
          }
        }
      };
    }
  ]);
