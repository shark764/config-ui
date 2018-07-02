'use strict';
window.cxSubscriptions = {};
angular.module('liveopsConfigPanel')
  .directive('sdkListener', ['Session', '$translate',
    function (Session, $translate) {
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
                  window.cxSubscriptions[event.data.command] = CxEngage.subscribe(event.data.command, function(error, topic, response) {
                      if (location.hash !== '#/reporting/interactionMonitoring?alpha') {
                        CxEngage.unsubscribe(window.cxSubscriptions[event.data.command]);
                        CxEngage.reporting.removeStatSubscription({ statId: 'interactions-in-conversation-list' });
                      } else {
                        event.source.postMessage({
                          subscription: {
                            error: error,
                            topic: topic,
                            response: response
                          }
                        }, '*');
                      }
                    }
                  );
                } else if (event.data.module === 'monitorCall') {

                    CxEngage.session.setActiveTenant({tenantId: CxEngage.session.getActiveTenantId()});
                    var monitoredInteraction = CxEngage.session.getMonitoredInteraction();
                    var defaultExtensionProvider = CxEngage.session.getDefaultExtension().provider;

                    if (monitoredInteraction === null) {
                        document.getElementById('supervisorToolbar').contentWindow
                        .postMessage(
                          {subscription: {
                            topic: 'monitorCall',
                            response: { interactionId: event.data.data.interactionId, status: 'startingSession', defaultExtensionProvider: defaultExtensionProvider }
                          }}, '*');
                    } else {
                        var confirmedToSwitchInteraction = confirm($translate.instant('interactionMonitoring.switchInteraction'));
                        if (confirmedToSwitchInteraction) {
                          CxEngage.interactions.voice.resourceRemove({interactionId: monitoredInteraction}, function() {
                            document.getElementById('supervisorToolbar').contentWindow
                            .postMessage(
                              {subscription: {
                                topic: 'monitorCall',
                                response: { interactionId: event.data.data.interactionId, status: 'startingSession' }
                              }}, '*');
                          });
                        }
                    }
                
                } else if (event.data.module.includes('interactions')) {
                  CxEngage.interactions[event.data.module.split('.')[1]][event.data.command](event.data.data, function(error, topic, response) {
                    return event.source !== undefined &&
                    event.source.postMessage({
                      error: error,
                      topic: topic,
                      response: response
                    },'*');
                  });
                } else if(event.data.module === 'updateLocalStorage') {
                  event.source.postMessage({
                    error: null,
                    topic: ['updateLocalStorage'],
                    response: JSON.parse(window.localStorage.getItem('LIVEOPS-PREFERENCE-KEY')).tenant
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
                }
                
              }
            }
          };
          window.addEventListener('message', sdkListener, false);
        }
      };
    }
  ]);
