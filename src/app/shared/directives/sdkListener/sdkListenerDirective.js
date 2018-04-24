'use strict';
window.cxSubscriptions = {};
angular.module('liveopsConfigPanel')
  .directive('sdkListener', ['Session',
    function (Session) {
      return {
        restrict: 'E',
        link: function () {
          var sdkListener = function(event) {
            if (CxEngage.session.getActiveTenantId()) {
              if (event.data.module === 'subscribe') {
                window.cxSubscriptions[event.data.command] = CxEngage.subscribe(event.data.command, function(error, topic, response) {
                    if (location.hash !== '#/reporting/silentMonitoring') {
                      CxEngage.unsubscribe(window.cxSubscriptions[event.data.command]);
                      CxEngage.reporting.removeStatSubscription({ statId: "interactions-in-conversation-list" });
                      CxEngage.authentication.logout();
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
                document.getElementById('supervisorToolbar').contentWindow
                .postMessage(
                  {subscription: {
                    topic: 'monitorCall',
                    response: { interactionId: event.data.data.interactionId, status: 'startingSession' }
                  }}
                  , '*');
              } else if (event.data.module.includes('interactions')) {
                CxEngage.interactions[event.data.module.split('.')[1]][event.data.command](event.data.data, function(error, topic, response) {
                  event.source !== undefined &&
                  event.source.postMessage({
                    error: error,
                    topic: topic,
                    response: response
                  }, '*');
                });
              } else if(event.data.module === 'updateLocalStorage') {
                event.source.postMessage({
                  error: null,
                  topic: ['updateLocalStorage'],
                  response: JSON.parse(window.localStorage.getItem('LIVEOPS-PREFERENCE-KEY')).tenant
                },'*')
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
              console.log('[SDK Listener] No tenant set yet. Trying again. Setting to Session.tenant.tenantId:', Session.tenant.tenantId);
              CxEngage.session.setActiveTenant({ tenantId: Session.tenant.tenantId, noSession: true }, function() {
                console.log('[SDK Listener] SDK tenant set to:', CxEngage.session.getActiveTenantId());
                sdkListener(event);
              });
            }
          };
          window.addEventListener('message', sdkListener, false);
        }
      };
    }
  ]);
