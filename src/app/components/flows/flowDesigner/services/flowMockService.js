(function() {
  'use strict';

  var FlowMockService = function() {
    return {
      activities: [
        {
          'name':'play-media',
          'entity':'activity',
          'label':'Play Media',
          'description':'Play some media',
          'type':'task',
          'targeted': true,
          'target': 'twilio',
          'ui': {
            'participant': {
              'label': 'Participant',
              'type': 'select',
              'options': [
                {
                  'value': undefined,
                  'content': 'Please select one'
                },
                {
                  'value': 'customer',
                  'content': 'Customer'
                },
                { 
                  'value': 'resource',
                  'content': 'Resource'
                }
              ],
              'group': 'params'
            },
            'media': {
              'label': 'Media',
              'type': 'entity',
              'source': 'media',
              'group': 'params'
            },
            'loop': {
              'label': 'Loop',
              'type': 'toggle',
              'group': 'params'
            }
          },
          'params':{
            'media':{
              'source':'entity',
              'type':'media',
              'mandatory':true,
              'key': 'media'
            },
            'loop':{
              'source':'expression',
              'type': 'boolean',
              'mandatory':true,
              'default': false,
              'key': 'loop'
            },
            'customer': {
              'source': 'expression',
              'type': 'variable',
              'key': 'participant',
              'when': {
                'eq': {
                  'params.participant': 'customer'
                }
              }
            },
            'resource': {
              'source': 'expression',
              'type': 'variable',
              'key': 'participant',
              'when': {
                'ne': {
                  'params.participant': 'customer'
                }
              }
            }
          },
          'bindings':{}
        },
        {
          'name':'collect-digits',
          'entity':'activity',
          'label':'Collect Digits',
          'description':'Collect some digits',
          'type':'task',
          'targeted': true,
          'target': 'twilio',
          'ui': {
            'participant': {
              'label': 'Participant',
              'type': 'select',
              'options': [
                {
                  'value': undefined,
                  'content': 'Please select one'
                },
                {
                  'value': 'customer',
                  'content': 'Customer'
                },
                {
                  'value': 'resource',
                  'content': 'Resource'
                }
              ],
              'group': 'params'
            },
            'media': {
              'label': 'Media',
              'type': 'entity',
              'source': 'media',
              'group': 'params'
            },
            'digits': {
              'label': 'Digits',
              'type': 'text',
              'group': 'params'
            },
            'terminator': {
              'label': 'Terminator',
              'type': 'text',
              'group': 'params'
            },
          },

          'params':{
            'media':{
              'source':'entity',
              'type':'media',
              'mandatory':false,
              'key': 'media'
            },
            'digits':{
              'source':'expression',
              'type': 'integer',
              'mandatory':false,
              'default': 5,
              'key': 'digits'
            },
            'terminator':{
              'source':'expression',
              'type':'string',
              'mandatory':false,
              'key': 'terminator'
            },
            'customer': {
              'source': 'expression',
              'type': 'variable',
              'key': 'participant',
              'when': {
                'eq': {
                  'params.participant': 'customer'
                }
              }
            },
            'resource': {
              'source': 'expression',
              'type': 'variable',
              'key': 'participant',
              'when': {
                'ne': {
                  'params.participant': 'customer'
                }
              }
            }
          },
          'bindings':{
            'digits':'string'
          }
        },
        {
          'name':'enqueue',
          'entity':'activity',
          'label':'Enqueue',
          'description':'Stick the call in a queue',
          'type':'task',
          'targeted': false,
          'ui': {
            'queue': {
              'label': 'Queue',
              'type': 'entity',
              'source': 'queue',
              'group': 'params'
            }
          },
          'params':{
            'queue':{
              'source':'entity',
              'type':'queue',
              'mandatory':true,
              'key': 'queue'
            }
          },
          'bindings':{
            'the-resource':'string'
          },
        },
        {
          'name': 'add-participant',
          'entity': 'activity',
          'label': 'Add Participant',
          'description': 'Add Participant',
          'type': 'task',
          'targeted': true,
          'target': 'twilio',
          'ui': {
            'participant': {
              'label': 'Participant',
              'type': 'select',
              'options': [
                {
                  'value': undefined,
                  'content': 'Please select one'
                },
                {
                  'value': 'customer',
                  'content': 'Customer'
                },
                { 
                  'value': 'resource',
                  'content': 'Resource'
                }
              ],
              'group': 'params'
            },
            'muted': {
              'label': 'Muted',
              'type': 'toggle',
              'group': 'params'
            },
            'disconnectOn': {
              'label': 'Disconnect On',
              'type': 'select',
              'options': [
                {
                  'value': '',
                  'content': 'Don\'t disconnect'
                },
                {
                  'value': '*',
                  'content': '*'

                }
              ],
              'group': 'params'
            }
          },
          'params': {
            'customer': {
              'source': 'expression',
              'type': 'variable',
              'key': 'participant',
              'when': {
                'eq': {
                  'params.participant': 'customer'
                }
              }
            },
            'resource': {
              'source': 'expression',
              'type': 'variable',
              'key': 'participant',
              'when': {
                'ne': {
                  'params.participant': 'customer'
                }
              }
            },
            'muted': {
              'source': 'expression',
              'type': 'boolean',
              'key': 'muted',
              'mandatory': false,
              'default': false
            },
            'disconnectOn': {
              'source': 'expression',
              'type': 'string',
              'key': 'disconnectOn',
              'mandatory': false,
              'default': ''
            }
          },
          'bindings': {},
        },
        {
          'name': 'work-offer',
          'entity': 'activity',
          'label': 'Work Offer',
          'description': 'Offer some work',
          'type': 'task',
          'ui': {
            'resource': {
              'label': 'Resource',
              'type': 'select',
              'group': 'params',
              'options': [
                {
                  'value':'"resource.id',
                  'content': 'Resource'
                }
              ]
            },
            'timeout': {
              'label': 'Timeout',
              'type': 'text',
              'group': 'params'
            },
            'search': {
              'label': 'Seach',
              'type': 'text',
              'group': 'params'
            },
            'force': {
              'label': 'Force Accept',
              'type': 'toggle',
              'group': 'params'
            }
          },
          'params': {
            'resource-id': {
              'source': 'expression',
              'type':'string',
              'mandatory':true,
              'default': '"resource.id"',
              'key': 'resource'
            },
            'timeout-end': {
              'source': 'expression',
              'type':'string',
              'mandatory':true,
              'key': 'timeout'
            },
            'search-value': {
              'source': 'expression',
              'type': 'string',
              'mandatory': false,
              'key': 'search'
            },
            'force-accept': {
              'source': 'expression',
              'type': 'boolean',
              'mandatory': false,
              'key': 'force',
              'default': false
            }
          },
          'bindings': {},
          'targeted': true,
          'target': 'client'
        },
        // {
        //   'name': 'free-resource',
        //   'entity': 'activity',
        //   'label': 'Free Resource',
        //   'description': 'Free Resource',
        //   'type': 'task',
        //   'params': {
        //     'resource-id': {
        //       'source': 'expression',
        //       'type':'string',
        //       'label':'Resource ID',
        //       'description':'',
        //       'icon':'url',
        //       'tooltip':'Resource to free',
        //       'dataSensitivity':'low',
        //       'mandatory':true
        //     }
        //   },
        //   'bindings': {},
        //   'targeted': false
        // },

        // RE-ADD FOR SUBFLOWS TO WORK
        // {
        //   'name': 'subflow',
        //   'entity': 'activity',
        //   'label': 'Edit Subflow',
        //   'description': 'Edit Subflow',
        //   'type': 'task',
        //   'params': {
        //     'name': {
        //       'source': 'expression',
        //       'type':'string',
        //       'label':'Subflow Name',
        //       'icon':'url',
        //       'tooltip':'Subflow Name',
        //       'dataSensitivity':'low',
        //       'mandatory':true
        //     }
        //   },
        //   'bindings': {},
        //   'targeted': true
        // }
      ],
      events: [
        {
          entity: 'start',
          type: 'none',
          props: [],
          meta: []
        },
        {
          entity: 'start',
          type: 'signal',
          props: ['target', 'interrupting', 'bindings'],
          meta: []
        },
        {
          entity: 'start',
          type: 'system-error',
          props: [],
          meta: []
        },
        {
          entity: 'start',
          type: 'flow-error',
          props: [],
          meta: []
        },
        {
          entity: 'catch',
          type: 'none',
          props: [],
          meta: []
        },
        {
          entity: 'catch',
          type: 'signal',
          props: ['target', 'interrupting', 'bindings'],
          meta: []
        },
        {
          entity: 'catch',
          type: 'timer',
          props: ['timer', 'interrupting', 'bindings'],
          meta: []
        },
        {
          entity: 'catch',
          type: 'system-error',
          props: ['interrupting', 'bindings'],
          meta: []
        },
        {
          entity: 'catch',
          type: 'flow-error',
          props: [],
          meta: []
        },
        {
          entity: 'throw',
          type: 'none',
          props: ['terminate'],
          meta: []
        },
        {
          entity: 'throw',
          type: 'signal',
          props: ['terminate', 'event'],
          meta: []
        },
        {
          entity: 'throw',
          type: 'flow-error',
          props: ['terminate', 'error'],
          meta: ['mustTerminate']
        },
        {
          entity: 'throw',
          type: 'terminate',
          props: ['terminate'],
          meta: ['mustTerminate']
        }
      ]
    };
  };

  angular.module('liveopsConfigPanel').service('FlowMockService', FlowMockService);
})();
