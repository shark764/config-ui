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
            if(event.origin.includes('localhost') ||
               event.origin.includes('cxengage') ||
               event.origin.includes('identity') ||
               event.origin.includes('cxengagelabs')) {
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
                            response: response
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
                                response: { interactionId: event.data.data.interactionId, status: 'startingSession', defaultExtensionProvider: defaultExtensionProvider, transitionCall: false }
                              }}, '*');
                        } else {
                            var confirmedToSwitchInteraction = confirm($translate.instant('interactionMonitoring.switchInteraction'));
                            if (confirmedToSwitchInteraction) {
                              CxEngage.interactions.voice.resourceRemove({interactionId: monitoredInteraction}, function() {
                                  document.getElementById('supervisorToolbar').contentWindow
                                  .postMessage(
                                    {subscription: {
                                      topic: 'monitorCall',
                                      response: { interactionId: event.data.data.interactionId, status: 'startingSession', defaultExtensionProvider: defaultExtensionProvider, transitionCall: true }
                                    }}, '*');
                              });
                            } else {
                              event.source
                              .postMessage(
                                {
                                  topic: ['monitorCall'],
                                  response: 'cancelled'
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
                      response: response
                    },'*');
                  });
                } else if(event.data.module === 'updateLocalStorage') {
                  event.source.postMessage({
                    error: null,
                    topic: ['updateLocalStorage'],
                    response: {tenant: JSON.parse(window.localStorage.getItem('LIVEOPS-PREFERENCE-KEY')).tenant, agentId: CxEngage.session.getActiveUserId()}
                  },'*');
                }
                else if (event.data.module === 'comfirmPrompt') {
                  var confirmedStatus = confirm(event.data.command);
                  event.source.postMessage({
                    error: null,
                    topic: ['comfirmPrompt'],
                    response: confirmedStatus
                  },'*');
                } else if (event.data.command === 'getMonitoredInteraction') {
                  console.log('[SDK Listener] Asking the SDK for:', event.data.command);
                  var monitoredId = CxEngage[event.data.module][event.data.command]();
                  if (event.source !== undefined) {
                    console.log('[SDK Listener] SDK sending back:', monitoredId);
                    event.source.postMessage({
                      topic: ['getMonitoredInteraction'],
                      response: monitoredId
                    }, '*');
                  }
                } else {
                  console.log('[SDK Listener] Asking the SDK for:', event.data);
                  CxEngage[event.data.module][event.data.command](event.data.data, function(error, topic, response) {
                    if (event.source !== undefined) {
                      console.log('[SDK Listener] SDK sending back:', error, topic, response);
                      event.source.postMessage({
                        error: error,
                        topic: topic,
                        response: response
                      }, '*');
                    }
                  });
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
