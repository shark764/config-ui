(function() {
  'use strict';

  var flowMocks = {
    demoInit: [
      {
        'bindings':{
            'success':'boolean'
          },
        'name':'play-media',
        'entity':'activity',
        'label':'Play Media',
        'description':'Play some media',
        'type':'task',
        'params':{
            'participant':{
              'source':'constant',
              'type':'string',
              'label':'participant',
              'tooltip':'participant',
              'description':'',
              'mandatory':true,
              'dataSensitivity':'low'
            },
            'mediaCollections':{
              'source':'entity',
              'type':'mediaCollections',
              'label':'Media Collection',
              'desctiption':'',
              'icon':'url',
              'toolTip':'Select Media Collection',
              'dataSensitivity':'low',
              'mandatory':true
            },
            'media-key':{
              'source':'variable',
              'type':'string',
              'label':'Media Key',
              'tooltip':'Media Key',
              'description':'',
              'mandatory':true,
              'dataSensitivity':'low'
            }
          }
      },
      {
        'bindings':{
          'digits':'string'
        },
        'name':'collect-digits',
        'entity':'activity',
        'label':'Collect Digits',
        'description':'Collect some digits',
        'type':'task',
        'params':{
          'participant':{
            'source':'constant',
            'type':'string',
            'label':'participant',
            'tooltip':'participant',
            'description':'',
            'mandatory':true,
            'dataSensitivity':'low'
          },
          'mediaCollections':{
            'source':'entity',
            'type':'mediaCollections',
            'label':'Media Collection',
            'description':'',
            'icon':'url',
            'tooltip':'Select Media Collection',
            'dataSensitivity':'low',
            'mandatory':false
          },
          'mediaKey':{
            'source':'variable',
            'type':'string',
            'label':'Media Key',
            'tooltip':'Media Key',
            'description':'',
            'mandatory':true,
            'dataSensitivity':'low'
          },
          'numDigits':{
            'source':'constant',
            'type':'integer',
            'label':'Number of digits',
            'tooltip':'Number of digits',
            'description':'',
            'mandatory':false,
            'dataSensitivity':'low',
            'default': 5
          },
          'finishOnKey':{
            'source':'constant',
            'type':'string',
            'label':'Finish on key',
            'tooltip':'Finish on key',
            'description':'',
            'mandatory':false,
            'dataSensitivity':'low'
          },
          'timeout':{
            'source':'constant',
            'type':'integer',
            'label':'Timeout',
            'tooltip':'Timeout',
            'description':'',
            'mandatory':false,
            'dataSensitivity':'low',
            'default': 5
          },
        }
      },
      {
        'bindings':{
          'success':'boolean'
        },
        'name':'enqueue',
        'entity':'activity',
        'label':'Enqueue',
        'description':'Collect some digits',
        'type':'task',
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
          },
          'currentRatePriorityIncrease':{
            'source':'constant',
            'type':'boolean',
            'label':'Current Rate of Priority Increase',
            'tooltip':'Need a better name',
            'description':'',
            'mandatory':false,
            'dataSensitivity':'low',
            'default': true
          }
        }
      },
      {
        'bindings':{
          'status':'string',
          'status_message':'string'
        },
        'name':'dequeue',
        'type':'task',
        'entity':'activity',
        'label':'Dequeue',
        'description':'Dequeue',
        'tooltip':'Dequeue',
        'params':{
          'queue':{
            'source':'entity',
            'type':'queue',
            'label':'Queue',
            'description':'Queue',
            'tooltip':'Queue',
            'dataSensitivity':'low',
            'mandatory':true,
          }
        }
      },
      {
        'bindings': {
          'status': 'string',
          'status_message': 'string'
        },
        'name': 'conversation',
        'entity': 'activity',
        'label': 'Conversation',
        'description': 'Conversation',
        'type': 'task',
        'params': {
          'participantType': {
            'source':'constant',
            'type':'string',
            'label':'Participent Type',
            'tooltip':'Participant Type',
            'description':'',
            'mandatory':true,
            'dataSensitivity':'low'
          },
          'muted': {
            'source':'constant',
            'type':'boolean',
            'label':'Muted',
            'tooltip':'Muted',
            'description':'',
            'mandatory':false,
            'dataSensitivity':'low',
            'default': false
          },
          'disconnectOn': {
            'source':'constant',
            'type':'string',
            'label':'Disconnect On',
            'tooltip':'Disconnect On',
            'description':'',
            'mandatory':false,
            'dataSensitivity':'low'
          }
        }
      },
      {
        'bindings': {
          'status': 'string',
          'status_message': 'string'
        },
        'name': 'disconnect',
        'entity': 'activity',
        'label': 'Disconnect',
        'description': 'Disconnect',
        'type': 'task',
        'params': {
          'participantType': {
            'source':'constant',
            'type':'string',
            'label':'Participant Type',
            'tooltip':'Participant Type',
            'description':'Participant Type',
            'mandatory':true,
            'dataSensitivity':'low'
          },
          'reason': {
            'source':'constant',
            'type':'string',
            'label':'Reason',
            'tooltip':'Reason',
            'description':'',
            'mandatory':true,
            'dataSensitivity':'low'
          },
          'reasonDescription': {
            'source':'constant',
            'type':'string',
            'label':'Reason Description',
            'tooltip':'Reason Description',
            'description':'',
            'mandatory':false,
            'dataSensitivity':'low'
          },
          'throwAbandonEvent': {
            'source':'constant',
            'type':'boolean',
            'label':'Throw Abandon Event',
            'tooltip':'Throw Abandon Event',
            'description':'',
            'mandatory':false,
            'dataSensitivity':'low'
          }
        }
      },
      {
        'bindings': {},
        'name': 'add-participant',
        'entity': 'activity',
        'label': 'Add Participant',
        'description': 'Add Participant',
        'type': 'task',
        'params': {}
      }
    ],
    demoFlow: {
      cells: [{
        'id' : 'b0a86b10-08d2-11e5-9eb8-4481758c9805',
        'entity' : 'start',
        'type' : 'none',
        'children' : ['b0a89220-08d2-11e5-9eb8-4481758c9805'],
        'parents' : [ ],
        'rendering-data': {
          'x': 30,
          'y':30
        }
      }, {
        'id' : 'b0a89220-08d2-11e5-9eb8-4481758c9805',
        'entity' : 'activity',
        'type' : 'task',
        'name' : 'collect-digits',
        'params' : {
          'participant': {
            'source': 'constant',
            'type': 'string',
            'value': 'resource'
          },
          'mediaCollections' : {
            'source' : 'system',
            'type':'mediaCollection',
            'id' : 'media_3'
          },
          'mediaKey': {
            'source': 'variable',
            'type': 'string',
            'variable': 'en'
          },
          'numDigits' : {
            'source' : 'constant',
            'type' : 'integer',
            'value' : 2
          },
          'finishOnKey' : {
            'source' : 'constant',
            'type' : 'string',
            'value' : '#'
          }
        },
        'bindings' : {
          'digits' : 'digits'
        },
        'children' : ['b0a89221-08d2-11e5-9eb8-4481758c9805'],
        'parents' : ['b0a86b10-08d2-11e5-9eb8-4481758c9805'],
        'rendering-data': {
          'label': 'Collect Digits',
          'x': 140,
          'y': 30
        }
      }, {
        'id' : 'b0a89221-08d2-11e5-9eb8-4481758c9805',
        'entity' : 'gateway',
        'type' : 'exclusive',
        'children' : [
        'b0a89222-08d2-11e5-9eb8-4481758c9805',
        'b0a89223-08d2-11e5-9eb8-4481758c9805'
        ],
        'parents' : ['b0a89220-08d2-11e5-9eb8-4481758c9805'],
        'rendering-data': {
          'x': 300,
          'y': 30,
        }
      }, {
        'id' : 'b0a89222-08d2-11e5-9eb8-4481758c9805',
        'entity' : 'activity',
        'type' : 'task',
        'name' : 'enqueue',
        'params' : {
          'queue' : {
            'source' : 'constant',
            'type' : 'uuid',
            'value' : 'f7ff93a4-5aa1-4f87-b7dd-c816f0dcdcbf'
          }
        },
        'bindings' : {
          'the-resource' : 'resource'
        },
        'children' : [
        'b0a89225-08d2-11e5-9eb8-4481758c9805'
        ],
        'parents' : [
        'b0a89221-08d2-11e5-9eb8-4481758c9805'
        ],
        'rendering-data': {
          'label': 'Enqueue',
          'x': 240,
          'y': 200
        }
      }, {
        'id': 'b0a89223-08d2-11e5-9eb8-4481758c9805',
        'children' : [ ],
        'parents' : [
        'b0a89221-08d2-11e5-9eb8-4481758c9805'
        ],
        'decorations': [
        'b0a89224-08d2-11e5-9eb8-4481758c9805'
        ],
        'bindings' : {},
        'name' : 'play-media',
        'entity' : 'activity',
        'type' : 'task',
        'params' : {
          'media' : {
            'source' : 'system',
            'store' : 'media-collection',
            'id' : 'f0291924-1363-4cc0-9d03-45db9aff5280'
          },
          'media-key' : {
            'source' : 'variable',
            'type' : 'string',
            'variable' : 'the-media-key'
          }
        },
        'rendering-data': {
          'label': 'Play Media',
          'x': 400,
          'y': 200
        }
      }, {
        'id': 'b0a89224-08d2-11e5-9eb8-4481758c9805',
        'entity' : 'catch',
        'type' : 'signal',
        'bindings' : {},
        'target' : 'resource-acquired',
        'interrupting' : true,
        'children': [
        'b0a89225-08d2-11e5-9eb8-4481758c9805'
        ],
        'parents': [
        'b0a89223-08d2-11e5-9eb8-4481758c9805'
        ],
        'rendering-data': {
          'x': 70,
          'y':10
        }
      }, {
        'id': 'b0a89225-08d2-11e5-9eb8-4481758c9805',
        'entity' : 'gateway',
        'type' : 'inclusive',
        'children': [
        'b0a89226-08d2-11e5-9eb8-4481758c9805'
        ],
        'parents': [
        'b0a89222-08d2-11e5-9eb8-4481758c9805',
        'b0a89224-08d2-11e5-9eb8-4481758c9805'
        ],
        'rendering-data': {
          'x': 300,
          'y': 300,
        }
      }, {
        'id': 'b0a89226-08d2-11e5-9eb8-4481758c9805',
        'entity' : 'activity',
        'type' : 'task',
        'name' : 'add-participant',
        'params' : {
          'resource' : {
            'source' : 'variable',
            'type' : 'string',
            'variable' : 'the-resource'
          }
        },
        'bindings' : {},
        'children': [
        'b0a89227-08d2-11e5-9eb8-4481758c9805'
        ],
        'parents': [
        'b0a89225-08d2-11e5-9eb8-4481758c9805'
        ],
        'rendering-data': {
          'label': 'Add Participant',
          'x': 290,
          'y': 420
        }
      }, {
        'id': 'b0a89227-08d2-11e5-9eb8-4481758c9805',
        'entity' : 'catch',
        'type' : 'signal',
        'bindings' : {},
        'target' : 'conversation-ended',
        'interrupting' : true,
        'children': [
        'b0a89228-08d2-11e5-9eb8-4481758c9805'
        ],
        'parents': [
        'b0a89226-08d2-11e5-9eb8-4481758c9805'
        ],
        'rendering-data': {
          'x': 430,
          'y': 420
        }
      }, {
        'id': 'b0a89228-08d2-11e5-9eb8-4481758c9805',
        'entity' : 'end',
        'type' : 'none',
        'terminate' : true,
        'children' : [ ],
        'parents': [
        'b0a89227-08d2-11e5-9eb8-4481758c9805'
        ],
        'rendering-data': {
          'x': 540,
          'y': 420
        }
      }]
    }
  };

  angular.module('liveopsConfigPanel').constant('flowMocks', flowMocks);
})();