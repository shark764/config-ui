'use strict';
window.cxSubscriptions = {};
angular.module('liveopsConfigPanel')
  .directive('sdkListener', ['Session', '$translate',
    function (Session, $translate) {
      var tenantIsSet = false;
      return {
        restrict: 'E',
        link: function () {
          var sdkListener = function(event) {
            if(event.origin.indexOf('logi') === -1 &&
               (event.origin.includes('localhost') ||
               event.origin.includes('cxengage') ||
               event.origin.includes('identity') ||
               event.origin.includes('cxengagelabs'))) {
              if (CxEngage.session.getActiveTenantId()) {
                if (event.data.module === 'subscribe') {
                  var subscribedTenant = CxEngage.session.getActiveTenantId();
                  window.cxSubscriptions[event.data.command + subscribedTenant] = CxEngage.subscribe(event.data.command, function(error, topic, response) {
                      if (location.hash.indexOf('#/reporting/interactionMonitoring') < 0) {
                        if(event.data.command === 'cxengage/reporting/batch-response') {
                          CxEngage.unsubscribe(window.cxSubscriptions[event.data.command]);
                        }
                        CxEngage.reporting.removeStatSubscription({ statId: 'interactions-in-conversation-list' });
                      }

                      try {
                        event.source.postMessage({
                          subscription: {
                            error: error,
                            topic: topic,
                            response: response,
                            messageId: event.data.messageId
                          }
                        }, '*');
                      } catch (error) {
                        console.warn('Cannot find original requestor iframe for subscription: ' ,event.data.command + 'for tenant id ' + subscribedTenant)
                        CxEngage.unsubscribe(window.cxSubscriptions[event.data.command + subscribedTenant]);
                      }
                    }
                  );
                } else if (event.data.module === 'monitorCall') {
                  if(!tenantIsSet) {
                    CxEngage.session.setActiveTenant({tenantId: CxEngage.session.getActiveTenantId() , silentMonitoring: true});
                    tenantIsSet = true
                  }
                    var silentMonitorCall = function (event) {

                      if(CxEngage.interactions.voice) {
                        var monitoredInteraction = CxEngage.session.getMonitoredInteraction();
                        var defaultExtensionProvider = CxEngage.session.getDefaultExtension().provider;

                        if (monitoredInteraction === null) {
                            document.getElementById('supervisorToolbar').contentWindow
                            .postMessage(
                              {subscription: {
                                topic: 'monitorCall',
                                response: { interactionId: event.data.data.interactionId, status: 'startingSession', defaultExtensionProvider: defaultExtensionProvider, transitionCall: false },
                                messageId: event.data.messageId
                              }}, '*');
                        } else {
                            var confirmedToSwitchInteraction = confirm($translate.instant('interactionMonitoring.switchInteraction'));
                            if (confirmedToSwitchInteraction) {
                              CxEngage.interactions.voice.resourceRemove({interactionId: monitoredInteraction}, function() {
                                  document.getElementById('supervisorToolbar').contentWindow
                                  .postMessage(
                                    {subscription: {
                                      topic: 'monitorCall',
                                      response: { interactionId: event.data.data.interactionId, status: 'startingSession', defaultExtensionProvider: defaultExtensionProvider, transitionCall: true },
                                      messageId: event.data.messageId
                                    }}, '*');
                              });
                            } else {
                              event.source
                              .postMessage(
                                {
                                  topic: ['monitorCall'],
                                  response: 'cancelled',
                                  messageId: event.data.messageId
                                }, '*');
                            }
                        }
                      } else {
                        setTimeout(function() { silentMonitorCall(event)}, 500);
                      }
                    };

                    silentMonitorCall(event);

                } else if (event.data.module.includes('interactions')) {
                  CxEngage.interactions[event.data.module.split('.')[1]][event.data.command](event.data.data, function(error, topic, response) {
                    return document.getElementById('supervisorToolbar').contentWindow.postMessage({
                      error: error,
                      topic: topic,
                      response: response,
                      messageId: event.data.messageId
                    },'*');
                  });
                } else if(event.data.module === 'updateLocalStorage') {
                  event.source.postMessage({
                    error: null,
                    topic: ['updateLocalStorage'],
                    response: {tenant: JSON.parse(window.localStorage.getItem('LIVEOPS-PREFERENCE-KEY')).tenant, agentId: CxEngage.session.getActiveUserId()},
                    messageId: event.data.messageId
                  },'*');
                }
                else if(event.data.module === 'setLocalStorage') {
                  localStorage.setItem(event.data.data.key, event.data.data.value);
                  location.reload();
                }
                else if (event.data.module === 'setBetaFeatures') {
                  Object.keys(event.data.data).forEach(function (feature) {
                    if (event.data.data[feature]) {
                      localStorage.setItem(feature, 'true');
                    } else {
                      localStorage.removeItem(feature);
                    }
                  })
                  location.reload();
                }
                else if (event.data.module === 'comfirmPrompt') {
                  var confirmedStatus = confirm(event.data.command);
                  event.source.postMessage({
                    error: null,
                    topic: ['comfirmPrompt'],
                    response: confirmedStatus,
                    messageId: event.data.messageId
                  },'*');
                } else if (event.data.command === 'getMonitoredInteraction') {
                  console.log('[SDK Listener] Asking the SDK for:', event.data.command);
                  var monitoredId = CxEngage[event.data.module][event.data.command]();
                  if (event.source !== undefined) {
                    console.log('[SDK Listener] SDK sending back:', monitoredId);
                    event.source.postMessage({
                      topic: ['getMonitoredInteraction'],
                      response: monitoredId,
                      messageId: event.data.messageId
                    }, '*');
                  }
                } else {
                  console.log('[SDK Listener] Asking the SDK for:', event.data);
                  if(event.data.topic === 'cxengage/entities/get-chat-widgets-response') {
                    const response = {
                      result: [
                        {
                          name: 'Widget1',
                          description: 'Support website widget',
                          shared: true,
                          active: true,
                          id: '0000-0000-0000-0001',
                          fontFamily: "arial",
                          fontSize: '12pt',
                          inputs: ['Name', 'Description'],
                          welcome: 'hero',
                          headerColor: '#584D8F',
                          headerTextIcons: '#19B348',
                          chatbg: '#19B348',
                          agentHeader: '#E21115',
                          agentText: '#2ED996',
                          customerHeader: '#C3B92F',
                          customerText: '#0D4B2E',
                          systemText: '#22194Dff',
                          buttonText: '#fff',
                          iconColor: '#ccc',
                          borderColor: '#194D4C',
                          urls: ['*.example.com','subdomain.example.com','example.com']
                        },
                        {
                          name: 'Widget 2',
                          description: 'Sales website widget',
                          shared: true,
                          active: true,
                          id: '0000-0000-0000-0002',
                          fontFamily: "arial",
                          fontSize: '12pt',
                          inputs: [],
                          welcome: 'hero',
                          headerColor: '#fff',
                          headerTextIcons: '#ccc',
                          chatbg: '#fff',
                          agentHeader: '#ccc',
                          agentText: '',
                          customerHeader: '',
                          customerText: '',
                          systemText: '',
                          buttonText: '',
                          iconColor: '',
                          borderColor: '',
                          urls: []
                        },
                      ]
                    }
                    event.source.postMessage({
                      topic: [event.data.topic],
                      response: response,
                      messageId: event.data.messageId
                    }, '*');
                  } else {
                    CxEngage[event.data.module][event.data.command](event.data.data, function(error, topic, response) {
                      if (event.source !== undefined) {
                        console.log('[SDK Listener] SDK sending back:', event.data.messageId , error, topic, response);
                        event.source.postMessage({
                          error: error,
                          topic: topic,
                          response: response,
                          messageId: event.data.messageId
                        }, '*');
                      }
                    });
                  }
                }
              } else {

                if (Session.tenant) {
                  console.log('[SDK Listener] No tenant set yet. Trying again. Setting to Session.tenant.tenantId:', Session.tenant.tenantId);
                  CxEngage.session.setActiveTenant({ tenantId: Session.tenant.tenantId, noSession: true }, function() {
                    console.log('[SDK Listener] SDK tenant set to:', CxEngage.session.getActiveTenantId());
                    sdkListener(event);
                  });
                } else {
                  setTimeout(function() {
                    console.log('Session id is not yet set in angular, waiting for session to be ready.');
                      sdkListener(event);
                  }, 2000)
                }

              }
            }
          };
          window.addEventListener('message', sdkListener, false);
        }
      };
    }
  ]);
