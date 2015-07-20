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
          'params':{
            'media':{
              'source':'entity',
              'type':'media',
              'label':'Media',
              'desctiption':'',
              'icon':'url',
              'toolTip':'Select Media',
              'dataSensitivity':'low',
              'mandatory':true
            },
            'loop':{
              'source':'expression',
              'type': 'boolean',
              'label':'Loop',
              'tooltip':'Number of times to loop',
              'description':'',
              'mandatory':true,
              'dataSensitivity':'low'
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
          'params':{
            'media':{
              'source':'entity',
              'type':'media',
              'label':'Media',
              'description':'',
              'icon':'url',
              'tooltip':'Select Media Collection',
              'dataSensitivity':'low',
              'mandatory':false
            },
            'digits':{
              'source':'expression',
              'type': 'integer',
              'label':'Number of digits',
              'tooltip':'Number of digits',
              'description':'',
              'mandatory':false,
              'dataSensitivity':'low',
              'default': 5
            },
            'terminator':{
              'source':'expression',
              'type':'string',
              'label':'Terminator',
              'tooltip':'Finish on key',
              'description':'',
              'mandatory':false,
              'dataSensitivity':'low'
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
          'params':{
            'queue':{
              'source':'entity',
              'type':'queue',
              'label':'Queue',
              'description':'',
              'icon':'url',
              'tooltip':'Select Queue',
              'dataSensitivity':'low',
              'mandatory':true
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
          'params': {
            'resource': {
              'source': 'expression',
              'type':'string',
              'label':'Resource',
              'description':'',
              'icon':'url',
              'tooltip':'Resource to add',
              'dataSensitivity':'low',
              'mandatory':true
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
          'params': {
            'resource-id': {
              'source': 'expression',
              'type':'string',
              'label':'Resource ID',
              'description':'',
              'icon':'url',
              'tooltip':'Resource to add',
              'dataSensitivity':'low',
              'mandatory':true,
              'hidden': true,
              'default': '"resource.id"'
            },
            'expires': {
              'source': 'expression',
              'type':'string',
              'label':'Expires',
              'description':'',
              'icon':'url',
              'tooltip':'How long work offer is valid',
              'dataSensitivity':'low',
              'mandatory':true
            }
          },
          'bindings': {},
          'targeted': true,
          'target': 'client'
        },
        {
          'name': 'free-resource',
          'entity': 'activity',
          'label': 'Free Resource',
          'description': 'Free Resource',
          'type': 'task',
          'params': {
            'resource-id': {
              'source': 'expression',
              'type':'string',
              'label':'Resource ID',
              'description':'',
              'icon':'url',
              'tooltip':'Resource to free',
              'dataSensitivity':'low',
              'mandatory':true
            }
          },
          'bindings': {},
          'targeted': true,
          'target': 'twilio'
        },

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
