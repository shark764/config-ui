(function() {
  'use strict';

  /*
    {
      name: 'is_targeted',
      type: 'string',
      label: 'Targeted?',
      group: 'general',
      index: 0,
      disabled: true,
      required: true,
      placeholder: 'Specify a target...',
      defaultsTo: false
    }, {
      name: 'target',
      type: 'string',
      label: 'Target',
      group: 'general',
      index: 0,
      disabled: true,
      required: true,
      placeholder: 'Specify a target...',
      defaultsTo: 'twilio'
    }

    // RE-ADD FOR SUBFLOWS TO WORK
    // {
    //   name: 'subflow',
    //   entity: 'activity',
    //   label: 'Edit Subflow',
    //   description: 'Edit Subflow',
    //   type: 'task',
    //   params: {
    //     name: {
    //       source: 'expression',
    //       type: 'string',
    //       label: 'Subflow Name',
    //       icon: 'url',
    //       tooltip: 'Subflow Name',
    //       dataSensitivity: 'low',
    //       mandatory: true
    //     }
    //   },
    //   bindings: {},
    //   targeted: true,
    // }
  */

 /*
  Things removed:
          targeted: true,
          target: 'twilio',
          target: 'client' --> on work offer
          source: 'expression', on collect digits -> terminator
          source: 'entity' on media
            source: 'expression', --> on work offer resourceid and work offer expires
          bindings:{
            digits: 'string' --> collect digits
          }
          bindings: {
            theresource: 'string' --> enqueue
          },
  */

  var FlowMockService = function() {
    return {
      activities: [

        // Play Media
        {
          name: 'play-media',
          entity: 'activity',
          label: 'Play Media',
          type: 'task',
          params: {},
          inputs: [{
            name: 'participant',
            type: 'select',
            label: 'Participant:',
            group: 'general',
            index: 0,
            disabled: false,
            required: true,
            placeholder: 'Select a media...',
            defaultsTo: '',
            hidden: false,
            dataSensitivity: 'low',
            options: [{
              value: undefined,
              content: 'Please select one...'
            }, {
              value: 'customer',
              content: 'Customer'
            }, {
              value: 'resource',
              content: 'Resource'
            }]
          }, {
            name: 'media',
            type: 'typeahead',
            label: 'Media',
            group: 'general',
            index: 0,
            disabled: false,
            required: true,
            placeholder: 'Select a media...',
            defaultsTo: '',
            hidden: false,
            dataSensitivity: 'low',
            source: 'media'
          }, {
            name: 'loop',
            type: 'boolean',
            label: 'Loop?',
            group: 'general',
            index: 0,
            disabled: false,
            required: true,
            placeholder: null,
            defaultsTo: null,
            hidden: false,
            dataSensitivity: 'low'
          }]
        },

        // Collect Digits
        {
          name: 'collect-digits',
          entity: 'activity',
          label: 'Collect Digits',
          type: 'task',
          params: {},
          inputs: [{
            name: 'media',
            type: 'typeahead',
            label: 'Media:',
            group: 'general',
            index: 0,
            disabled: false,
            required: true,
            placeholder: 'Select a media...',
            defaultsTo: null,
            collectionLookup: 'media'
          }, {
            name: 'digits',
            type: 'number',
            label: 'Number of digits:',
            group: 'general',
            index: 0,
            disabled: false,
            required: true,
            placeholder: 'Select a media...',
            defaultsTo: 5,
            hidden: false,
            dataSensitivity: 'low'
          }, {
            name: 'terminator',
            type: 'string',
            label: 'Terminator:',
            group: 'general',
            index: 0,
            disabled: false,
            required: true,
            placeholder: 'Specify a terminating digit...',
            defaultsTo: 5,
            hidden: false,
            dataSensitivity: 'low'
          }]
        },

        // Enqueue
        {
          name: 'enqueue',
          entity: 'activity',
          label: 'Enqueue',
          type: 'task',
          params: {},
          inputs: [{
            name: 'queue',
            type: 'typeahead',
            label: 'Queue:',
            group: 'general',
            index: 0,
            disabled: false,
            required: true,
            placeholder: 'Select a queue...',
            defaultsTo: null,
            hidden: false,
            dataSensitivity: 'low',
            source: 'queue'
          }]
        },

        // Work offer
        {
          name: 'work-offer',
          entity: 'activity',
          label: 'Work Offer',
          type: 'task',
          params: {},
          inputs: [{
            name: 'resourceid',
            type: 'string',
            label: 'Resource ID',
            group: 'general',
            index: 0,
            disabled: false,
            required: true,
            placeholder: 'Specify a resource id...',
            defaultsTo: 'resource.id',
            hidden: false,
            dataSensitivity: 'low'
          }, {
            name: 'expires',
            type: 'string',
            label: 'Expires',
            group: 'general',
            index: 0,
            disabled: false,
            required: true,
            placeholder: 'Select a queue...',
            defaultsTo: null,
            hidden: false,
            dataSensitivity: 'low'
          }]
        },

        // Free resource
        {
          name: 'free-resource',
          entity: 'activity',
          label: 'Free Resource',
          type: 'task',
          params: {},
          inputs: [{
            name: 'resourceid',
            source: 'expression',
            type: 'string',
            label: 'Resource ID',
            description: '',
            icon: 'url',
            tooltip: 'Resource to free',
            dataSensitivity: 'low',
            mandatory: true
          }]
        }
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
          type: 'error',
          props: ['interrupting', 'bindings'],
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
          type: 'error',
          props: ['terminate'],
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
