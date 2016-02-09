(function(){
  'use strict';
  angular.module('liveopsConfigPanel.config').constant('dashboardOverview',

  {
    'id': 'overview-dashboard',
    'name': 'Overview Dashboard',
    'widgets': [
      {
        'id': 'title-widget1',
        'type': 'label',
        'presentation': {
          'show': true,
          'text': 'All Agents'
        },
        'sizeX': 15,
        'sizeY': 1,
        'col': 4,
        'row': 2
      },
      {
        'id': 'title-widget2',
        'type': 'label',
        'presentation': {
          'show': true,
          'text': 'All Interactions'
        },
        'sizeX': 15,
        'sizeY': 1,
        'col': 21,
        'row': 2
      },
      {
        'id': 'widget1',
        'type': 'statistic',
        'query': {
          'api': 'realtime-statistics',
          'endpoint': 'resources-ready',
          'responseKey': 'value',
          'parameters': {}
        },
        'presentation': {
          'header': {
            'show': true,
            'text': 'Agents Currently Ready'
          },
          'value': {
            'format': 'count'
          },
          'footer': {
            'show': true,
            'text': 'agents'
          }
        },
        'sizeX': 5,
        'sizeY': 3,
        'minSizeX': 5,
        'minSizeY': 3,
        'col': 4,
        'row': 3
      },
      {
        'id': 'widget2',
        'type': 'statistic',
        'query': {
          'api': 'realtime-statistics',
          'endpoint': 'resources-away',
          'responseKey': 'value',
          'parameters': {}
        },
        'presentation': {
          'header': {
            'show': true,
            'text': 'Agents Currently Away'
          },
          'value': {
            'format': 'count'
          },
          'footer': {
            'show': true,
            'text': 'agents'
          }
        },
        'sizeX': 5,
        'sizeY': 3,
        'minSizeX': 5,
        'minSizeY': 3,
        'col': 9,
        'row': 3
      },
      {
        'id': 'widget3',
        'type': 'statistic',
        'query': {
          'api': 'realtime-statistics',
          'endpoint': 'resources-busy',
          'responseKey': 'value',
          'parameters': {}
        },
        'presentation': {
          'header': {
            'show': true,
            'text': 'Agents Currently Busy'
          },
          'value': {
            'format': 'count'
          },
          'footer': {
            'show': true,
            'text': 'agents'
          }
        },
        'sizeX': 5,
        'sizeY': 3,
        'minSizeX': 5,
        'minSizeY': 3,
        'col': 14,
        'row': 3
      },
      {
        'id': 'widget4',
        'type': 'statistic',
        'query': {
          'api': 'realtime-statistics',
          'endpoint': 'conversation-duration',
          'responseKey': 'avg',
          'parameters': {}
        },
        'presentation': {
          'header': {
            'show': true,
            'text': 'Avg. Conversation Duration'
          },
          'value': {
            'format': 'time'
          },
          'footer': {
            'show': false,
            'text': ''
          }
        },
        'sizeX': 5,
        'sizeY': 3,
        'minSizeX': 5,
        'minSizeY': 3,
        'col': 9,
        'row': 6
      },
      {
        'id': 'widget5',
        'type': 'statistic',
        'query': {
          'api': 'realtime-statistics',
          'endpoint': 'time-to-answer-duration',
          'responseKey': 'avg',
          'parameters': {}
        },
        'presentation': {
          'header': {
            'show': true,
            'text': 'Avg. Time To Answer'
          },
          'value': {
            'format': 'time'
          },
          'footer': {
            'show': false,
            'text': ''
          }
        },
        'sizeX': 5,
        'sizeY': 3,
        'minSizeX': 5,
        'minSizeY': 3,
        'col': 4,
        'row': 6
      },
      {
        'id': 'widget6',
        'type': 'statistic',
        'query': {
          'api': 'realtime-statistics',
          'endpoint': 'resource-hold-start-instance',
          'responseKey': 'recordsCount',
          'parameters': {}
        },
        'presentation': {
          'header': {
            'show': true,
            'text': 'Total Holds Triggered'
          },
          'value': {
            'format': 'count'
          },
          'footer': {
            'show': true,
            'text': 'holds'
          }
        },
        'sizeX': 5,
        'sizeY': 3,
        'minSizeX': 5,
        'minSizeY': 3,
        'col': 14,
        'row': 6
      },
      {
        'id': 'widget7',
        'type': 'statistic',
        'query': {
          'api': 'realtime-statistics',
          'endpoint': 'queue-length',
          'responseKey': 'recordsCount',
          'parameters': {}
        },
        'presentation': {
          'header': {
            'show': true,
            'text': 'Currently In Queue'
          },
          'value': {
            'format': 'count'
          },
          'footer': {
            'show': true,
            'text': 'customers'
          }
        },
        'sizeX': 5,
        'sizeY': 3,
        'minSizeX': 5,
        'minSizeY': 3,
        'col': 21,
        'row': 3
      },
      {
        'id': 'widget8',
        'type': 'statistic',
        'query': {
          'api': 'realtime-statistics',
          'endpoint': 'queue-duration',
          'responseKey': 'max',
          'parameters': {}
        },
        'presentation': {
          'header': {
            'show': true,
            'text': 'Max Queue Wait Time'
          },
          'value': {
            'format': 'time'
          },
          'footer': {
            'show': false,
            'text': ''
          }
        },
        'sizeX': 5,
        'sizeY': 3,
        'minSizeX': 5,
        'minSizeY': 3,
        'col': 26,
        'row': 3
      },
      {
        'id': 'widget9',
        'type': 'statistic',
        'query': {
          'api': 'realtime-statistics',
          'endpoint': 'abandon-queue-instance',
          'responseKey': 'recordsCount',
          'parameters': {}
        },
        'presentation': {
          'header': {
            'show': true,
            'text': 'Queue Abandons'
          },
          'value': {
            'format': 'count'
          },
          'footer': {
            'show': false,
            'text': ''
          }
        },
        'sizeX': 5,
        'sizeY': 3,
        'minSizeX': 5,
        'minSizeY': 3,
        'col': 31,
        'row': 3
      },
      {
        'id': 'widget10',
        'type': 'statistic',
        'query': {
          'api': 'realtime-statistics',
          'endpoint': 'interaction-duration',
          'responseKey': 'avg',
          'parameters': {}
        },
        'presentation': {
          'header': {
            'show': true,
            'text': 'Avg. Interaction Time'
          },
          'value': {
            'format': 'time'
          },
          'footer': {
            'show': false,
            'text': ''
          }
        },
        'sizeX': 5,
        'sizeY': 3,
        'minSizeX': 5,
        'minSizeY': 3,
        'col': 21,
        'row': 6
      },
      {
        'id': 'widget11',
        'type': 'statistic',
        'query': {
          'api': 'realtime-statistics',
          'endpoint': 'interactions-in-conversation-count',
          'responseKey': 'recordsCount',
          'parameters': {}
        },
        'presentation': {
          'header': {
            'show': true,
            'text': 'In Conversation'
          },
          'value': {
            'format': 'count'
          },
          'footer': {
            'show': false,
            'text': ''
          }
        },
        'sizeX': 5,
        'sizeY': 3,
        'minSizeX': 5,
        'minSizeY': 3,
        'col': 26,
        'row': 6
      },
      {
        'id': 'widget12',
        'type': 'statistic',
        'query': {
          'api': 'realtime-statistics',
          'endpoint': 'abandon-time-duration',
          'responseKey': 'avg',
          'parameters': {}
        },
        'presentation': {
          'header': {
            'show': true,
            'text': 'Avg. Abandon Time'
          },
          'value': {
            'format': 'time'
          },
          'footer': {
            'show': false,
            'text': ''
          }
        },
        'sizeX': 5,
        'sizeY': 3,
        'minSizeX': 5,
        'minSizeY': 3,
        'col': 31,
        'row': 6
      },
      {
        'id': 'source-switcher1',
        'type': 'source-switcher',
        'entity': 'queue',
        'presentation': {
          'title': {
            'show': true,
            'text': 'Specific Queue'
          }
        },
        'sizeX': 15,
        'sizeY': 2,
        'minSizeX': 10,
        'minSizeY': 2,
        'col': 4,
        'row': 10
      },
      {
        'id': 'widget13',
        'type': 'statistic',
        'query': {
          'api': 'realtime-statistics',
          'endpoint': 'queue-length',
          'responseKey': 'recordsCount',
          'parameters': {
            'queue-id': 'source-switcher1'
          }
        },
        'presentation': {
          'header': {
            'show': true,
            'text': 'Currently In Queue'
          },
          'value': {
            'format': 'count'
          },
          'footer': {
            'show': false,
            'text': ''
          }
        },
        'sizeX': 5,
        'sizeY': 3,
        'minSizeX': 5,
        'minSizeY': 3,
        'col': 4,
        'row': 12
      },
      {
        'id': 'widget14',
        'type': 'statistic',
        'query': {
          'api': 'realtime-statistics',
          'endpoint': 'service-level',
          'responseKey': 'serviceLevel',
          'parameters': {
            'queue-id': 'source-switcher1'
          }
        },
        'presentation': {
          'header': {
            'show': true,
            'text': 'Answered in < 20s'
          },
          'value': {
            'format': 'percent'
          },
          'footer': {
            'show': false,
            'text': ''
          }
        },
        'sizeX': 5,
        'sizeY': 3,
        'minSizeX': 5,
        'minSizeY': 3,
        'col': 9,
        'row': 12
      },
      {
        'id': 'widget15',
        'type': 'statistic',
        'query': {
          'api': 'realtime-statistics',
          'endpoint': 'abandon-queue-instance',
          'responseKey': 'recordsCount',
          'parameters': {
            'queue-id': 'source-switcher1'
          }
        },
        'presentation': {
          'header': {
            'show': true,
            'text': 'Queue Abandons'
          },
          'value': {
            'format': 'count'
          },
          'footer': {
            'show': false,
            'text': ''
          }
        },
        'sizeX': 5,
        'sizeY': 3,
        'minSizeX': 5,
        'minSizeY': 3,
        'col': 14,
        'row': 12
      },
      {
        'id': 'widget16',
        'type': 'statistic',
        'query': {
          'api': 'realtime-statistics',
          'endpoint': 'queue-duration',
          'responseKey': 'avg',
          'parameters': {
            'queue-id': 'source-switcher1'
          }
        },
        'presentation': {
          'header': {
            'show': true,
            'text': 'Avg. Queue Wait Time'
          },
          'value': {
            'format': 'time'
          },
          'footer': {
            'show': false,
            'text': ''
          }
        },
        'sizeX': 5,
        'sizeY': 3,
        'minSizeX': 5,
        'minSizeY': 3,
        'col': 4,
        'row': 15
      },
      {
        'id': 'widget17',
        'type': 'statistic',
        'query': {
          'api': 'realtime-statistics',
          'endpoint': 'queue-duration',
          'responseKey': 'min',
          'parameters': {
            'queue-id': 'source-switcher1'
          }
        },
        'presentation': {
          'header': {
            'show': true,
            'text': 'Min Queue Wait Time'
          },
          'value': {
            'format': 'time'
          },
          'footer': {
            'show': false,
            'text': ''
          }
        },
        'sizeX': 5,
        'sizeY': 3,
        'minSizeX': 5,
        'minSizeY': 3,
        'col': 9,
        'row': 15
      },
      {
        'id': 'widget18',
        'type': 'statistic',
        'query': {
          'api': 'realtime-statistics',
          'endpoint': 'queue-duration',
          'responseKey': 'max',
          'parameters': {
            'queue-id': 'source-switcher1'
          }
        },
        'presentation': {
          'header': {
            'show': true,
            'text': 'Max Queue Wait Time'
          },
          'value': {
            'format': 'time'
          },
          'footer': {
            'show': false,
            'text': ''
          }
        },
        'sizeX': 5,
        'sizeY': 3,
        'minSizeX': 5,
        'minSizeY': 3,
        'col': 14,
        'row': 15
      },
      {
        'id': 'source-switcher2',
        'type': 'source-switcher',
        'entity': 'queue',
        'presentation': {
          'title': {
            'show': true,
            'text': 'Specific Queue'
          }
        },
        'sizeX': 15,
        'sizeY': 2,
        'minSizeX': 10,
        'minSizeY': 2,
        'col': 21,
        'row': 10
      },
      {
        'id': 'widget19',
        'type': 'statistic',
        'query': {
          'api': 'realtime-statistics',
          'endpoint': 'queue-length',
          'responseKey': 'recordsCount',
          'parameters': {
            'queue-id': 'source-switcher2'
          }
        },
        'presentation': {
          'header': {
            'show': true,
            'text': 'Currently In Queue'
          },
          'value': {
            'format': 'count'
          },
          'footer': {
            'show': false,
            'text': ''
          }
        },
        'sizeX': 5,
        'sizeY': 3,
        'minSizeX': 5,
        'minSizeY': 3,
        'col': 21,
        'row': 12
      },
      {
        'id': 'widget20',
        'type': 'statistic',
        'query': {
          'api': 'realtime-statistics',
          'endpoint': 'service-level',
          'responseKey': 'serviceLevel',
          'parameters': {
            'queue-id': 'source-switcher2'
          }
        },
        'presentation': {
          'header': {
            'show': true,
            'text': 'Answered in < 20s'
          },
          'value': {
            'format': 'percent'
          },
          'footer': {
            'show': false,
            'text': ''
          }
        },
        'sizeX': 5,
        'sizeY': 3,
        'minSizeX': 5,
        'minSizeY': 3,
        'col': 26,
        'row': 12
      },
      {
        'id': 'widget21',
        'type': 'statistic',
        'query': {
          'api': 'realtime-statistics',
          'endpoint': 'abandon-queue-instance',
          'responseKey': 'recordsCount',
          'parameters': {
            'queue-id': 'source-switcher2'
          }
        },
        'presentation': {
          'header': {
            'show': true,
            'text': 'Queue Abandons'
          },
          'value': {
            'format': 'count'
          },
          'footer': {
            'show': false,
            'text': ''
          }
        },
        'sizeX': 5,
        'sizeY': 3,
        'minSizeX': 5,
        'minSizeY': 3,
        'col': 31,
        'row': 12
      },
      {
        'id': 'widget22',
        'type': 'statistic',
        'query': {
          'api': 'realtime-statistics',
          'endpoint': 'queue-duration',
          'responseKey': 'avg',
          'parameters': {
            'queue-id': 'source-switcher2'
          }
        },
        'presentation': {
          'header': {
            'show': true,
            'text': 'Avg. Queue Wait Time'
          },
          'value': {
            'format': 'time'
          },
          'footer': {
            'show': false,
            'text': ''
          }
        },
        'sizeX': 5,
        'sizeY': 3,
        'minSizeX': 5,
        'minSizeY': 3,
        'col': 21,
        'row': 15
      },
      {
        'id': 'widget23',
        'type': 'statistic',
        'query': {
          'api': 'realtime-statistics',
          'endpoint': 'queue-duration',
          'responseKey': 'min',
          'parameters': {
            'queue-id': 'source-switcher2'
          }
        },
        'presentation': {
          'header': {
            'show': true,
            'text': 'Min Queue Wait Time'
          },
          'value': {
            'format': 'time'
          },
          'footer': {
            'show': false,
            'text': ''
          }
        },
        'sizeX': 5,
        'sizeY': 3,
        'minSizeX': 5,
        'minSizeY': 3,
        'col': 26,
        'row': 15
      },
      {
        'id': 'widget24',
        'type': 'statistic',
        'query': {
          'api': 'realtime-statistics',
          'endpoint': 'queue-duration',
          'responseKey': 'max',
          'parameters': {
            'queue-id': 'source-switcher2'
          }
        },
        'presentation': {
          'header': {
            'show': true,
            'text': 'Max Queue Wait Time'
          },
          'value': {
            'format': 'time'
          },
          'footer': {
            'show': false,
            'text': ''
          }
        },
        'sizeX': 5,
        'sizeY': 3,
        'minSizeX': 5,
        'minSizeY': 3,
        'col': 31,
        'row': 15
      }
    ]
  }

);

})();
