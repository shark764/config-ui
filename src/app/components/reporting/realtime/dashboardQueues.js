(function(){
  'use strict';
  angular.module('liveopsConfigPanel.config').constant('dashboardQueues',

  {
    'id': 'queues-dashboard',
    'name': 'Queues Dashboard',
    'widgets': [
      {
        'id': 'title-widget1',
        'type': 'label',
        'presentation': {
          'show': true,
          'text': 'All Queues'
        },
        'sizeX': 30,
        'sizeY': 1,
        'col': 5,
        'row': 2
      },
      {
        'id': 'widget1',
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
            'text': 'Queue Length'
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
        'col': 5,
        'row': 3
      },
      {
        'id': 'widget2',
        'type': 'statistic',
        'query': {
          'api': 'realtime-statistics',
          'endpoint': 'service-level',
          'responseKey': 'serviceLevel',
          'parameters': {},
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
        'col': 10,
        'row': 3
      },
      {
        'id': 'widget3',
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
            'text': 'Abandons'
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
        'col': 15,
        'row': 3
      },
      {
        'id': 'widget4',
        'type': 'statistic',
        'query': {
          'api': 'realtime-statistics',
          'endpoint': 'queue-duration',
          'responseKey': 'avg',
          'parameters': {}
        },
        'presentation': {
          'header': {
            'show': true,
            'text': 'Average Wait Time'
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
        'col': 20,
        'row': 3
      },
      {
        'id': 'widget5',
        'type': 'statistic',
        'query': {
          'api': 'realtime-statistics',
          'endpoint': 'queue-duration',
          'responseKey': 'min',
          'parameters': {}
        },
        'presentation': {
          'header': {
            'show': true,
            'text': 'Min Wait Time'
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
        'col': 30,
        'row': 3
      },
      {
        'id': 'widget6',
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
            'text': 'Max Wait Time'
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
        'col': 25,
        'row': 3
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
