(function() {
  'use strict';

  var FlowMockService = function() {
    return {
      activities: [

        // Play Media
        {
          name: 'play-media',
          entity: 'activity',
          label: 'Play Media',
          inputs: [{
            name: 'participant',
            path: 'params.participant',
            type: 'select',
            label: 'Participant:',
            group: 'params',
            index: 0,
            disabled: false,
            required: true,
            placeholder: 'Select a media...',
            defaultsTo: '',
            hidden: false,
            options: [{
              value: 'customer',
              content: 'Customer'
            }, {
              value: 'resource',
              content: 'Resource'
            }]
          }, {
            name: 'media',
            path: 'params.media',
            type: 'typeahead',
            label: 'Media',
            group: 'params',
            index: 1,
            disabled: false,
            required: true,
            placeholder: 'Select a media...',
            defaultsTo: '',
            hidden: false,
            source: 'media'
          }, {
            name: 'loop',
            path: 'params.loop',
            type: 'boolean',
            label: 'Loop?',
            group: 'params',
            index: 2,
            disabled: false,
            required: true,
            placeholder: null,
            defaultsTo: null,
            hidden: false
          }]
        },

        // Collect Digits
        {
          name: 'collect-digits',
          entity: 'activity',
          label: 'Collect Digits',
          inputs: [{
            name: 'media',
            path: 'params.media',
            type: 'typeahead',
            label: 'Media:',
            group: 'params',
            index: 0,
            disabled: false,
            required: true,
            placeholder: 'Select a media...',
            defaultsTo: null,
            collectionLookup: 'media'
          }, {
            name: 'digits',
            path: 'params.digits',
            type: 'number',
            label: 'Number of digits:',
            group: 'params',
            index: 0,
            disabled: false,
            required: true,
            placeholder: 'Select a media...',
            defaultsTo: 5,
            hidden: false
          }, {
            name: 'terminator',
            path: 'params.terminator',
            type: 'string',
            label: 'Terminator:',
            group: 'params',
            index: 0,
            disabled: false,
            required: true,
            placeholder: 'Specify a terminating digit...',
            defaultsTo: 5,
            hidden: false
          }]
        },

        // Enqueue
        {
          name: 'enqueue',
          entity: 'activity',
          label: 'Enqueue',
          inputs: [{
            name: 'queue',
            path: 'params.queue',
            type: 'typeahead',
            label: 'Queue:',
            group: 'params',
            index: 0,
            disabled: false,
            required: true,
            placeholder: 'Select a queue...',
            defaultsTo: null,
            hidden: false,
            source: 'queue'
          }]
        },

        // Work offer
        {
          name: 'work-offer',
          entity: 'activity',
          label: 'Work Offer',
          inputs: [{
            name: 'resourceid',
            path: 'params.resourceid',
            type: 'string',
            label: 'Resource ID',
            group: 'params',
            index: 0,
            disabled: false,
            required: true,
            placeholder: 'Specify a resource id...',
            defaultsTo: 'resource.id',
            hidden: false
          }, {
            name: 'expires',
            path: 'params.expires',
            type: 'string',
            label: 'Expires',
            group: 'params',
            index: 0,
            disabled: false,
            required: true,
            placeholder: 'Select a queue...',
            defaultsTo: null,
            hidden: false
          }]
        },

        // Free resource
        {
          name: 'free-resource',
          entity: 'activity',
          label: 'Free Resource',
          inputs: [{
            name: 'resourceid',
            path: 'params.resourceid',
            type: 'string',
            label: 'Resource ID',
            group: 'params',
            index: 0,
            disabled: false,
            required: true,
            placeholder: 'Enter a resource ID...',
            defaultsTo: null,
            hidden: false
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
