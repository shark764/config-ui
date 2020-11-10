'use strict';
window.cxSubscriptions = {};
angular.module('liveopsConfigPanel').directive('sdkListener', [
  'Session',
  '$rootScope',
  '$translate',
  '$window',
  '$state',
  'apiHostname',
  'Alert',
  '$location',
  function (Session, $rootScope, $translate, $window, $state, apiHostname, Alert, $location) {
    var tenantIsSet = false;
    return {
      restrict: 'E',
      link: function () {
        var sdkListener = function (event) {
          if (
            event.origin.indexOf('logi') === -1 &&
            event.origin.indexOf('birst') === -1 &&
            (event.origin.indexOf('localhost') > -1 ||
              event.origin.indexOf('cxengage') > -1 ||
              event.origin.indexOf('identity') > -1 ||
              event.origin.indexOf('cxengagelabs') > -1)
          ) {
            if (Session.tenant !== null && Session.tenant.tenantId !== "") {
                if (CxEngage.session.getActiveTenantId() !== Session.tenant.tenantId) {
                  CxEngage.session.setActiveTenant({ tenantId: Session.tenant.tenantId, noSession: true });
                }
            }
            if (event.data.module === 'subscribe') {
              var subscribedTenant = CxEngage.session.getActiveTenantId() ? CxEngage.session.getActiveTenantId() : Session.tenant.tenantId;
              window.cxSubscriptions[event.data.command + subscribedTenant] = CxEngage.subscribe(
                event.data.command,
                function (error, topic, response) {
                  if (
                    location.hash.indexOf('#/reporting/interactionMonitoring') < 0 &&
                    location.hash.indexOf('#/reporting/agentStateMonitoring') < 0 &&
                    event.data.command === 'cxengage/reporting/batch-response'
                  ) {
                    CxEngage.unsubscribe(window.cxSubscriptions[event.data.command + subscribedTenant]);
                  }
                  if (location.hash.indexOf('#/reporting/interactionMonitoring') < 0) {
                    CxEngage.reporting.removeStatSubscription({ statId: 'interactions-in-conversation-list' });
                  }
                  if (location.hash.indexOf('#/reporting/agentStateMonitoring') < 0) {
                    CxEngage.reporting.bulkRemoveStatSubscription({
                      statIds: ['resource-capacity', 'resource-state-list']
                    });
                  }

                  try {
                    if (event.source !== undefined) {
                      event.source.postMessage(
                        {
                          subscription: {
                            error: error,
                            topic: topic,
                            response: response,
                            messageId: event.data.messageId
                          }
                        },
                        '*'
                      );
                    }
                  } catch (error) {
                    console.warn(
                      'Cannot find original requestor iframe for subscription: ',
                      event.data.command + ' for tenant id ' + subscribedTenant
                    );
                    Alert.error($translate.instant('navbar.reports.agentStateMonitoring.subscription.fail'));
                    CxEngage.unsubscribe(window.cxSubscriptions[event.data.command + subscribedTenant]);
                    CxEngage.reporting.bulkRemoveStatSubscription({
                      statIds: ['resource-capacity', 'resource-state-list', 'interactions-in-conversation-list']
                    });
                  }
                }
              );
            } else if (CxEngage.session.getActiveTenantId()) {
              if (event.data.module === 'monitorCall') {
                var silentMonitorCall = function (event) {
                  if (CxEngage.interactions.voice) {
                    var monitoredInteraction = CxEngage.session.getMonitoredInteraction();
                    if (monitoredInteraction === null) {
                      document.getElementById('supervisorToolbar').contentWindow.postMessage(
                        {
                          subscription: {
                            topic: 'monitorCall',
                            response: {
                              interactionId: event.data.data.interactionId,
                              chosenExtension: event.data.data.chosenExtension,
                              status: 'startingSession',
                              transitionCall: false
                            },
                            messageId: event.data.messageId
                          }
                        },
                        '*'
                      );
                    } else {
                      var confirmedToSwitchInteraction = confirm(
                        $translate.instant('interactionMonitoring.switchInteraction')
                      );
                      if (confirmedToSwitchInteraction) {
                        CxEngage.interactions.voice.resourceRemove({ interactionId: monitoredInteraction }, function () {
                          document.getElementById('supervisorToolbar').contentWindow.postMessage(
                            {
                              subscription: {
                                topic: 'monitorCall',
                                response: {
                                  interactionId: event.data.data.interactionId,
                                  status: 'startingSession',
                                  transitionCall: true
                                },
                                messageId: event.data.messageId
                              }
                            },
                            '*'
                          );
                        });
                      } else {
                        event.source.postMessage(
                          {
                            topic: ['monitorCall'],
                            response: 'cancelled',
                            messageId: event.data.messageId
                          },
                          '*'
                        );
                      }
                    }
                  } else {
                    setTimeout(function () {
                      silentMonitorCall(event);
                    }, 500);
                  }
                };

                if (!tenantIsSet) {
                  CxEngage.session.setActiveTenant({
                    tenantId: CxEngage.session.getActiveTenantId(),
                    silentMonitoring: true
                  });
                  // Wait for session start to prevent race condition between creating session and trying to
                  // silent monitor a call.
                  CxEngage.subscribe('cxengage/session/started', function (error, topic, response) {
                    if (error) {
                      console.log('[SDK Listener] Failed to create session for silent monitoring. Updating toolbar...');
                      event.source.postMessage(
                        {
                          topic: ['monitorCall'],
                          response: 'cancelled',
                          messageId: event.data.messageId
                        },
                        '*'
                      );
                      return;
                    }
                    tenantIsSet = true;
                    silentMonitorCall(event);
                  })
                } else {
                  silentMonitorCall(event);
                }
              } else if (event.data.module === 'FlowDesigner.draftPublished') {
                // Call to open Flow Designer from Config-UI2
                $state.go('content.flows.editor', {
                  flowId: event.data.data.flowId,
                  draftId: event.data.data.draftId
                });
              } else if (event.data.module === 'FlowDesigner.openPublishedVersion') {
                // Call to open Flow Designer from Config-UI2
                $state.go('content.flows.view', {
                  flowId: event.data.data.flowId,
                  versionId: event.data.data.versionId
                });
              } else if (event.data.module && event.data.module.includes('interactions')) {
                CxEngage.interactions[event.data.module.split('.')[1]][event.data.command](event.data.data, function (
                  error,
                  topic,
                  response
                ) {
                  return document.getElementById('supervisorToolbar').contentWindow.postMessage(
                    {
                      error: error,
                      topic: topic,
                      response: response,
                      messageId: event.data.messageId
                    },
                    '*'
                  );
                });
              } else if (event.data.module === 'updateLocalStorage') {
                event.source.postMessage(
                  {
                    error: null,
                    topic: ['updateLocalStorage'],
                    response: {
                      tenant: JSON.parse(window.localStorage.getItem('LIVEOPS-PREFERENCE-KEY')).tenant,
                      tenants: JSON.parse(window.localStorage.getItem('LIVEOPS-SESSION-KEY')).tenants,
                      platformPermissions: JSON.parse(window.localStorage.getItem('LIVEOPS-SESSION-KEY'))
                        .platformPermissions,
                      agentId: CxEngage.session.getActiveUserId(),
                      token: CxEngage.dumpState().authentication.token,
                      baseUrl: apiHostname
                    },
                    messageId: event.data.messageId
                  },
                  '*'
                );
              } else if (event.data.module === 'updateKeyLocalStorage') {
                localStorage.setItem(event.data.data.key, event.data.data.value);
                if (event.data.data.key === 'LIVEOPS-PREFERENCE-KEY') {
                  $rootScope.$emit('tenant.update.externalChanges', JSON.parse(event.data.data.value).tenant);
                }
                event.source.postMessage(
                  {
                    topic: ['updateKeyLocalStorage'],
                    response: 'updated',
                    messageId: event.data.messageId
                  },
                  '*'
                );
              } else if (event.data.module === 'setLocalStorage') {
                localStorage.setItem(event.data.data.key, event.data.data.value);
                location.reload();
              } else if (event.data.module && event.data.module.includes('Logi.impersonateTenantUser')) {
                sessionStorage.setItem(
                  'LOGI-USER-IMPERSONATE',
                  JSON.stringify({
                    id: event.data.data.id,
                    displayName: event.data.data.displayName
                  })
                );

                $rootScope.$emit('impersonatingTenantUser');

                $state.go(
                  'content.reporting.logiAdvanced',
                  { id: null, messageKey: 'user.details.reporting.impersonated' },
                  { reload: true, inherit: false }
                );
              } else if (event.data.module === 'setBetaFeatures') {
                location.reload();
              } else if (event.data.module === 'comfirmPrompt') {
                var confirmedStatus = confirm(event.data.command);
                event.source.postMessage(
                  {
                    error: null,
                    topic: ['comfirmPrompt'],
                    response: confirmedStatus,
                    messageId: event.data.messageId
                  },
                  '*'
                );
              } else if (event.data.module === 'updateURLWithQueryString') {
                // Here we are updating URL along with the state because url is getting updated after a pause with the state update 
                if (event.data.entityId !== '') {
                  if ($location.search().id) {
                    // If an entity is selected on top of an active entity selection,
                    // replace previously selected entityId in the URL with the newly selected entityId
                    window.location.href = /.+?(?=\?id=)/.exec(window.location.href)[0] + '?id=' + event.data.entityId;
                  } else {
                    // if there is no previously selectedEntityId, append if to the URL
                    window.location.href = window.location.href + '?id=' + event.data.entityId;
                  }
                } else {
                  if ($location.search().id) {
                    // remove id from the URL:
                    window.location.href = /.+?(?=\?id=)/.exec(window.location.href)[0] + '';
                  }
                }
                $state.go($state.current.name, {id: event.data.entityId}, {notify: false});
                event.source.postMessage(
                  {
                    topic: 'urlParamUpdated',
                    response: event.data.entityId,
                    messageId: event.data.messageId
                  },
                  '*'
                );
              } else if (event.data.module === 'getUrlParamId') {
                event.source.postMessage(
                  {
                    topic: 'urlParamUpdated',
                    response: event.data.entityId !== $location.search().id ? $location.search().id : undefined,
                    messageId: event.data.messageId
                  },
                  '*'
                );
              } else if (event.data.module === 'setIsCurrentConfig2FormDirty') {
                $rootScope.$emit('setIsConfig2FormDirty', event.data.isDirty);
                event.source.postMessage(
                  {
                    topic: 'isFormDirtyUpdatedInConfig1',
                    response: event.data.isDirty,
                    messageId: event.data.messageId
                  },
                  '*'
                );
              } else if (event.data.command === 'getMonitoredInteraction') {
                console.log('[SDK Listener] Asking the SDK for:', event.data.command);
                var monitoredId = CxEngage[event.data.module][event.data.command]();
                if (event.source !== undefined) {
                  console.log('[SDK Listener] SDK sending back:', monitoredId);
                  event.source.postMessage(
                    {
                      topic: ['getMonitoredInteraction'],
                      response: monitoredId,
                      messageId: event.data.messageId
                    },
                    '*'
                  );
                }
              } else if (event.data.module === 'tenantBrandingUpdated') {
                $rootScope.$emit('tenantBrandingUpdated', event.data.tenantId);
              } else if (event.data.module === 'switchTenant') {
                $rootScope.$emit('switchTenant', event.data.tenantId, event.data.tenantName);
                $rootScope.$emit('readAllMode');
                // Removing impersonate tenant data from sessionStorage
                // when setting tenant as active
                sessionStorage.removeItem('LOGI-USER-IMPERSONATE');
              }
              else if (event.data.module !== undefined) {
                console.log('[SDK Listener] Asking the SDK for:', event.data);
                if (CxEngage[event.data.module][event.data.command] === undefined) {
                  var params = { 
                    path: event.data.path, 
                    body: event.data.data, 
                    customTopic: event.data.topic
                  }
                  if(event.data.apiVersion){
                    params.apiVersion = event.data.apiVersion;
                  }
                  CxEngage.api[event.data.crudAction](
                    params,
                    function (error, topic, response) {
                      if (event.source !== undefined) {
                        console.log('[SDK Listener] SDK sending back:', event.data.messageId, error, topic, response);
                        event.source.postMessage(
                          {
                            error: error,
                            topic: topic,
                            response: response,
                            messageId: event.data.messageId
                          },
                          '*'
                        );
                      }
                    }
                  );
                } else {
                  CxEngage[event.data.module][event.data.command](event.data.data, function (error, topic, response) {
                    if (event.source !== undefined) {
                      console.log('[SDK Listener] SDK sending back:', event.data.messageId, error, topic, response);
                      event.source.postMessage(
                        {
                          error: error,
                          topic: topic,
                          response: response,
                          messageId: event.data.messageId
                        },
                        '*'
                      );
                    }
                  });
                }
              }
            } else {
              if (Session.tenant) {
                if (Session.tenant.tenantId !== "") {
                    console.log(
                      '[SDK Listener] No tenant set yet. Trying again. Setting to Session.tenant.tenantId:',
                      Session.tenant.tenantId
                    );
                    CxEngage.session.setActiveTenant({ tenantId: Session.tenant.tenantId, noSession: true }, function () {
                      console.log('[SDK Listener] SDK tenant set to:', CxEngage.session.getActiveTenantId());
                      sdkListener(event);
                    });
                }
              } else {
                if (Session.tenants && Session.tenants.length) {
                    setTimeout(function () {
                      console.log('Session id is not yet set in angular, waiting for session to be ready.');
                      sdkListener(event);
                    }, 2000);
                }
              }
            }
          } else if (
            event.origin.indexOf('birst') > -1 &&
            (event.origin.indexOf('localhost') > -1 ||
              event.origin.indexOf('cxengage') > -1 ||
              event.origin.indexOf('identity') > -1 ||
              event.origin.indexOf('cxengagelabs') > -1)
          ) {
            console.log(event.data);
            console.log($window.addApp);
            if (event.data && event.data.id && event.data.type && event.data.tenantId) {
              $window.addApp(event.data);
            }
          }
        };
        window.addEventListener('message', sdkListener, false);
      }
    };
  }
]);
