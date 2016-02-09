(function() {
  'use strict';
  angular.module('liveopsConfigPanel.config').constant('dashboardResources',

  {
    'id': 'resources-dashboard',
    'name': 'Resources Dashboard',
    'widgets': [
      {
        'id': 'title-widget1',
        'type': 'label',
        'presentation': {
          'show': true,
          'text': 'Ready Resources'
        },
        'sizeX': 15,
        'sizeY': 1,
        'col': 4,
        'row': 0
      },
      {
        'id': 'title-widget2',
        'type': 'label',
        'presentation': {
          'show': true,
          'text': 'Resources Away'
        },
        'sizeX': 15,
        'sizeY': 1,
        'col': 4,
        'row': 4
      },
      {
        'id': 'title-widget3',
        'type': 'label',
        'presentation': {
          'show': true,
          'text': 'Busy Resources'
        },
        'sizeX': 15,
        'sizeY': 1,
        'col': 21,
        'row': 0
      },
      {
        'id': 'title-widget4',
        'type': 'label',
        'presentation': {
          'show': true,
          'text': 'Hold Duration'
        },
        'sizeX': 15,
        'sizeY': 1,
        'col': 4,
        'row': 8
      },
      {
        'id': 'title-widget5',
        'type': 'label',
        'presentation': {
          'show': true,
          'text': 'In Conversation Duration'
        },
        'sizeX': 15,
        'sizeY': 1,
        'col': 21,
        'row': 4
      },
      {
        'id': 'title-widget6',
        'type': 'label',
        'presentation': {
          'show': true,
          'text': 'Time To Answer Duration'
        },
        'sizeX': 15,
        'sizeY': 1,
        'col': 21,
        'row': 8
      },
      {
        'id': 'source-switcher1',
        'type': 'source-switcher',
        'entity': 'user',
        'presentation': {
          'title': {
            'show': true,
            'text': 'Specific Resource'
          }
        },
        'sizeX': 15,
        'sizeY': 2,
        'minSizeX': 10,
        'minSizeY': 2,
        'col': 4,
        'row': 12
      },
      {
        'id': 'source-switcher2',
        'type': 'source-switcher',
        'entity': 'user',
        'presentation': {
          'title': {
            'show': true,
            'text': 'Specific Resource'
          }
        },
        'sizeX': 15,
        'sizeY': 2,
        'minSizeX': 10,
        'minSizeY': 2,
        'col': 21,
        'row': 12
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
            'text': 'Concurrent'
          },
          'value': {
            'format': 'count'
          },
          'footer': {
            'show': true,
            'text': 'Ready Resources'
          }
        },
        'sizeX': 5,
        'sizeY': 3,
        'minSizeX': 5,
        'minSizeY': 3,
        'col': 4,
        'row': 1
      },
      {
        'id': 'widget2',
        'type': 'statistic',
        'query': {
          'api': 'realtime-statistics',
          'endpoint': 'resources-ready',
          'responseKey': 'max',
          'parameters': {
            'gauge-start': '2015-10-25T00:00:00.000',
            'gauge-end': '2015-10-25T23:59:59.999'
          }
        },
        'presentation': {
          'header': {
            'show': true,
            'text': 'Max'
          },
          'value': {
            'format': 'count'
          },
          'footer': {
            'show': true,
            'text': 'Ready Resources'
          }
        },
        'sizeX': 5,
        'sizeY': 3,
        'minSizeX': 5,
        'minSizeY': 3,
        'col': 9,
        'row': 1
      },
      {
        'id': 'widget3',
        'type': 'statistic',
        'query': {
          'api': 'realtime-statistics',
          'endpoint': 'resources-ready',
          'responseKey': 'min',
          'parameters': {
            'gauge-start': '2015-10-25T00:00:00.000',
            'gauge-end': '2015-10-25T23:59:59.999'
          }
        },
        'presentation': {
          'header': {
            'show': true,
            'text': 'Min'
          },
          'value': {
            'format': 'count'
          },
          'footer': {
            'show': true,
            'text': 'Ready Resources'
          }
        },
        'sizeX': 5,
        'sizeY': 3,
        'minSizeX': 5,
        'minSizeY': 3,
        'col': 14,
        'row': 1
      },
      {
        'id': 'widget4',
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
            'text': 'Concurrent'
          },
          'value': {
            'format': 'count'
          },
          'footer': {
            'show': true,
            'text': 'Resources Away'
          }
        },
        'sizeX': 5,
        'sizeY': 3,
        'minSizeX': 5,
        'minSizeY': 3,
        'col': 4,
        'row': 5
      },
      {
        'id': 'widget5',
        'type': 'statistic',
        'query': {
          'api': 'realtime-statistics',
          'endpoint': 'resources-away',
          'responseKey': 'max',
          'parameters': {
            'gauge-start': '2015-10-25T00:00:00.000',
            'gauge-end': '2015-10-25T23:59:59.999'
          }
        },
        'presentation': {
          'header': {
            'show': true,
            'text': 'Max'
          },
          'value': {
            'format': 'count'
          },
          'footer': {
            'show': true,
            'text': 'Resources Away'
          }
        },
        'sizeX': 5,
        'sizeY': 3,
        'minSizeX': 5,
        'minSizeY': 3,
        'col': 9,
        'row': 5
      },
      {
        'id': 'widget6',
        'type': 'statistic',
        'query': {
          'api': 'realtime-statistics',
          'endpoint': 'resources-away',
          'responseKey': 'min',
          'parameters': {
            'gauge-start': '2015-10-25T00:00:00.000',
            'gauge-end': '2015-10-25T23:59:59.999'
          }
        },
        'presentation': {
          'header': {
            'show': true,
            'text': 'Min'
          },
          'value': {
            'format': 'count'
          },
          'footer': {
            'show': true,
            'text': 'Resources Away'
          }
        },
        'sizeX': 5,
        'sizeY': 3,
        'minSizeX': 5,
        'minSizeY': 3,
        'col': 14,
        'row': 5
      },
      {
        'id': 'widget7',
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
            'text': 'Concurrent'
          },
          'value': {
            'format': 'count'
          },
          'footer': {
            'show': true,
            'text': 'Busy Resources'
          }
        },
        'sizeX': 5,
        'sizeY': 3,
        'minSizeX': 5,
        'minSizeY': 3,
        'col': 21,
        'row': 1
      },
      {
        'id': 'widget8',
        'type': 'statistic',
        'query': {
          'api': 'realtime-statistics',
          'endpoint': 'resources-busy',
          'responseKey': 'max',
          'parameters': {
            'gauge-start': '2015-10-25T00:00:00.000',
            'gauge-end': '2015-10-25T23:59:59.999'
          }
        },
        'presentation': {
          'header': {
            'show': true,
            'text': 'Max'
          },
          'value': {
            'format': 'count'
          },
          'footer': {
            'show': true,
            'text': 'Busy Resources'
          }
        },
        'sizeX': 5,
        'sizeY': 3,
        'minSizeX': 5,
        'minSizeY': 3,
        'col': 26,
        'row': 1
      },
      {
        'id': 'widget9',
        'type': 'statistic',
        'query': {
          'api': 'realtime-statistics',
          'endpoint': 'resources-busy',
          'responseKey': 'min',
          'parameters': {
            'gauge-start': '2015-10-25T00:00:00.000',
            'gauge-end': '2015-10-25T23:59:59.999'
          }
        },
        'presentation': {
          'header': {
            'show': true,
            'text': 'Min'
          },
          'value': {
            'format': 'count'
          },
          'footer': {
            'show': true,
            'text': 'Busy Resources'
          }
        },
        'sizeX': 5,
        'sizeY': 3,
        'minSizeX': 5,
        'minSizeY': 3,
        'col': 31,
        'row': 1
      },
      {
        'id': 'widget10',
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
            'text': 'Average Time'
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
        'row': 5
      },
      {
        'id': 'widget11',
        'type': 'statistic',
        'query': {
          'api': 'realtime-statistics',
          'endpoint': 'conversation-duration',
          'responseKey': 'max',
          'parameters': {}
        },
        'presentation': {
          'header': {
            'show': true,
            'text': 'Max Time'
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
        'row': 5
      },
      {
        'id': 'widget12',
        'type': 'statistic',
        'query': {
          'api': 'realtime-statistics',
          'endpoint': 'conversation-duration',
          'responseKey': 'min',
          'parameters': {}
        },
        'presentation': {
          'header': {
            'show': true,
            'text': 'Min Time'
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
        'row': 5
      },
      {
        'id': 'widget13',
        'type': 'statistic',
        'query': {
          'api': 'realtime-statistics',
          'endpoint': 'interaction-hold-duration',
          'responseKey': 'avg',
          'parameters': {}
        },
        'presentation': {
          'header': {
            'show': true,
            'text': 'Average Time'
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
        'row': 9
      },
      {
        'id': 'widget14',
        'type': 'statistic',
        'query': {
          'api': 'realtime-statistics',
          'endpoint': 'interaction-hold-duration',
          'responseKey': 'max',
          'parameters': {}
        },
        'presentation': {
          'header': {
            'show': true,
            'text': 'Max Time'
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
        'row': 9
      },
      {
        'id': 'widget15',
        'type': 'statistic',
        'query': {
          'api': 'realtime-statistics',
          'endpoint': 'interaction-hold-duration',
          'responseKey': 'min',
          'parameters': {}
        },
        'presentation': {
          'header': {
            'show': true,
            'text': 'Min Time'
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
        'row': 9
      },
      {
        'id': 'widget16',
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
            'text': 'Average Time'
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
        'row': 9
      },
      {
        'id': 'widget17',
        'type': 'statistic',
        'query': {
          'api': 'realtime-statistics',
          'endpoint': 'time-to-answer-duration',
          'responseKey': 'max',
          'parameters': {}
        },
        'presentation': {
          'header': {
            'show': true,
            'text': 'Max Time'
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
        'row': 9
      },
      {
        'id': 'widget18',
        'type': 'statistic',
        'query': {
          'api': 'realtime-statistics',
          'endpoint': 'time-to-answer-duration',
          'responseKey': 'min',
          'parameters': {}
        },
        'presentation': {
          'header': {
            'show': true,
            'text': 'Min Time'
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
        'row': 9
      },
      {
        'id': 'widget19',
        'type': 'statistic',
        'query': {
          'api': 'realtime-statistics',
          'endpoint': 'handle-time-duration',
          'responseKey': 'avg',
          'parameters': {
            'resource-id': 'source-switcher1'
          }
        },
        'presentation': {
          'header': {
            'show': true,
            'text': 'Average Handle Time'
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
        'row': 14
      },
      {
        'id': 'widget20',
        'type': 'statistic',
        'query': {
          'api': 'realtime-statistics',
          'endpoint': 'handle-time-duration',
          'responseKey': 'max',
          'parameters': {
            'resource-id': 'source-switcher1'
          }
        },
        'presentation': {
          'header': {
            'show': true,
            'text': 'Max Handle Time'
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
        'row': 14
      },
      {
        'id': 'widget21',
        'type': 'statistic',
        'query': {
          'api': 'realtime-statistics',
          'endpoint': 'handle-time-duration',
          'responseKey': 'min',
          'parameters': {
            'resource-id': 'source-switcher1'
          }
        },
        'presentation': {
          'header': {
            'show': true,
            'text': 'Min Handle Time'
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
        'row': 14
      },
      {
        'id': 'widget22',
        'type': 'statistic',
        'query': {
          'api': 'realtime-statistics',
          'endpoint': 'handle-time-duration',
          'responseKey': 'avg',
          'parameters': {
            'resource-id': 'source-switcher2'
          }
        },
        'presentation': {
          'header': {
            'show': true,
            'text': 'Average Handle Time'
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
        'row': 14
      },
      {
        'id': 'widget23',
        'type': 'statistic',
        'query': {
          'api': 'realtime-statistics',
          'endpoint': 'handle-time-duration',
          'responseKey': 'max',
          'parameters': {
            'resource-id': 'source-switcher2'
          }
        },
        'presentation': {
          'header': {
            'show': true,
            'text': 'Max Handle Time'
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
        'row': 14
      },
      {
        'id': 'widget24',
        'type': 'statistic',
        'query': {
          'api': 'realtime-statistics',
          'endpoint': 'handle-time-duration',
          'responseKey': 'min',
          'parameters': {
            'resource-id': 'source-switcher2'
          }
        },
        'presentation': {
          'header': {
            'show': true,
            'text': 'Min Handle Time'
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
        'row': 14
      }
    ]
  }

);
})();
