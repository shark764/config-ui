'use strict';

angular.module('liveopsConfigPanel.config').constant('dashboardInteractions',

{
  "id": "interactions-dashboard",
  "name": "Interactions Dashboard",
  "widgets": [
    {
      "id": "title-widget1",
      "type": "label",
      "presentation": {
        "show": true,
        "text": "All Interactions"
      },
      "sizeX": 20,
      "sizeY": 1,
      "col": 10,
      "row": 2
    },
    {
      "id": "widget1",
      "type": "statistic",
      "query": {
        "api": "realtime-statistics",
        "endpoint": "interactions-in-conversation-count",
        "responseKey": "recordsCount",
        "parameters": {
          "queue": "source-switcher1"
        }
      },
      "presentation": {
        "header": {
          "show": true,
          "text": "In Conversation"
        },
        "value": {
          "format": "count"
        },
        "footer": {
          "show": false,
          "text": ""
        }
      },
      "sizeX": 5,
      "sizeY": 3,
      "minSizeX": 5,
      "minSizeY": 3,
      "col": 25,
      "row": 3
    },
    {
      "id": "widget2",
      "type": "statistic",
      "query": {
        "api": "realtime-statistics",
        "endpoint": "interaction-start-instance",
        "responseKey": "recordsCount",
        "parameters": {}
      },
      "presentation": {
        "header": {
          "show": true,
          "text": "Interactions Started"
        },
        "value": {
          "format": "count"
        },
        "footer": {
          "show": false,
          "text": ""
        }
      },
      "sizeX": 5,
      "sizeY": 3,
      "minSizeX": 5,
      "minSizeY": 3,
      "col": 20,
      "row": 3
    },
    {
      "id": "widget3",
      "type": "statistic",
      "query": {
        "api": "realtime-statistics",
        "endpoint": "queue-length",
        "responseKey": "recordsCount",
        "parameters": {}
      },
      "presentation": {
        "header": {
          "show": true,
          "text": "In Queue"
        },
        "value": {
          "format": "count"
        },
        "footer": {
          "show": false,
          "text": ""
        }
      },
      "sizeX": 5,
      "sizeY": 3,
      "minSizeX": 5,
      "minSizeY": 3,
      "col": 15,
      "row": 3
    },
    {
      "id": "widget4",
      "type": "statistic",
      "query": {
        "api": "realtime-statistics",
        "endpoint": "abandon-queue-instance",
        "responseKey": "recordsCount",
        "parameters": {}
      },
      "presentation": {
        "header": {
          "show": true,
          "text": "Queues Abandoned"
        },
        "value": {
          "format": "count"
        },
        "footer": {
          "show": false,
          "text": ""
        }
      },
      "sizeX": 5,
      "sizeY": 3,
      "minSizeX": 5,
      "minSizeY": 3,
      "col": 10,
      "row": 3
    },
    {
      "id": "widget5",
      "type": "statistic",
      "query": {
        "api": "realtime-statistics",
        "endpoint": "interactions-in-routing-abandon-count",
        "responseKey": "recordsCount",
        "parameters": {}
      },
      "presentation": {
        "header": {
          "show": true,
          "text": "IVR Abandons"
        },
        "value": {
          "format": "count"
        },
        "footer": {
          "show": false,
          "text": ""
        }
      },
      "sizeX": 5,
      "sizeY": 3,
      "minSizeX": 5,
      "minSizeY": 3,
      "col": 25,
      "row": 6
    },
    {
      "id": "widget6",
      "type": "statistic",
      "query": {
        "api": "realtime-statistics",
        "endpoint": "abandon-time-duration",
        "responseKey": "avg",
        "parameters": {}
      },
      "presentation": {
        "header": {
          "show": true,
          "text": "Average Abandon Time"
        },
        "value": {
          "format": "time"
        },
        "footer": {
          "show": false,
          "text": ""
        }
      },
      "sizeX": 5,
      "sizeY": 3,
      "minSizeX": 5,
      "minSizeY": 3,
      "col": 20,
      "row": 6
    },
    {
      "id": "widget7",
      "type": "statistic",
      "query": {
        "api": "realtime-statistics",
        "endpoint": "abandon-time-duration",
        "responseKey": "max",
        "parameters": {}
      },
      "presentation": {
        "header": {
          "show": true,
          "text": "Max Abandon Time"
        },
        "value": {
          "format": "time"
        },
        "footer": {
          "show": false,
          "text": ""
        }
      },
      "sizeX": 5,
      "sizeY": 3,
      "minSizeX": 5,
      "minSizeY": 3,
      "col": 15,
      "row": 6
    },
    {
      "id": "widget8",
      "type": "statistic",
      "query": {
        "api": "realtime-statistics",
        "endpoint": "abandon-time-duration",
        "responseKey": "min",
        "parameters": {}
      },
      "presentation": {
        "header": {
          "show": true,
          "text": "Min Abandon Time"
        },
        "value": {
          "format": "time"
        },
        "footer": {
          "show": false,
          "text": ""
        }
      },
      "sizeX": 5,
      "sizeY": 3,
      "minSizeX": 5,
      "minSizeY": 3,
      "col": 10,
      "row": 6
    },
    {
      "id": "widget9",
      "type": "statistic",
      "query": {
        "api": "realtime-statistics",
        "endpoint": "interaction-duration",
        "responseKey": "avg",
        "parameters": {}
      },
      "presentation": {
        "header": {
          "show": true,
          "text": "Average Interaction Time"
        },
        "value": {
          "format": "time"
        },
        "footer": {
          "show": false,
          "text": ""
        }
      },
      "sizeX": 5,
      "sizeY": 3,
      "minSizeX": 5,
      "minSizeY": 3,
      "col": 10,
      "row": 9
    },
    {
      "id": "widget10",
      "type": "statistic",
      "query": {
        "api": "realtime-statistics",
        "endpoint": "interaction-duration",
        "responseKey": "total",
        "parameters": {}
      },
      "presentation": {
        "header": {
          "show": true,
          "text": "Total Interaction Time"
        },
        "value": {
          "format": "time"
        },
        "footer": {
          "show": false,
          "text": ""
        }
      },
      "sizeX": 5,
      "sizeY": 3,
      "minSizeX": 5,
      "minSizeY": 3,
      "col": 15,
      "row": 9
    },
    {
      "id": "widget11",
      "type": "statistic",
      "query": {
        "api": "realtime-statistics",
        "endpoint": "interaction-duration",
        "responseKey": "max",
        "parameters": {}
      },
      "presentation": {
        "header": {
          "show": true,
          "text": "Max Interaction Time"
        },
        "value": {
          "format": "time"
        },
        "footer": {
          "show": false,
          "text": ""
        }
      },
      "sizeX": 5,
      "sizeY": 3,
      "minSizeX": 5,
      "minSizeY": 3,
      "col": 20,
      "row": 9
    },
    {
      "id": "widget12",
      "type": "statistic",
      "query": {
        "api": "realtime-statistics",
        "endpoint": "interaction-duration",
        "responseKey": "min",
        "parameters": {}
      },
      "presentation": {
        "header": {
          "show": true,
          "text": "Min Interaction Duration"
        },
        "value": {
          "format": "time"
        },
        "footer": {
          "show": false,
          "text": "Min Interaction Time"
        }
      },
      "sizeX": 5,
      "sizeY": 3,
      "minSizeX": 5,
      "minSizeY": 3,
      "col": 25,
      "row": 9
    },
    {
      "id": "widget13",
      "type": "statistic",
      "query": {
        "api": "realtime-statistics",
        "endpoint": "interaction-hold-duration",
        "responseKey": "avg",
        "parameters": {}
      },
      "presentation": {
        "header": {
          "show": true,
          "text": "Average Hold Duration"
        },
        "value": {
          "format": "time"
        },
        "footer": {
          "show": false,
          "text": ""
        }
      },
      "sizeX": 5,
      "sizeY": 3,
      "minSizeX": 5,
      "minSizeY": 3,
      "col": 10,
      "row": 12
    },
    {
      "id": "widget14",
      "type": "statistic",
      "query": {
        "api": "realtime-statistics",
        "endpoint": "interaction-hold-duration",
        "responseKey": "total",
        "parameters": {}
      },
      "presentation": {
        "header": {
          "show": true,
          "text": "Total Hold Duration"
        },
        "value": {
          "format": "time"
        },
        "footer": {
          "show": false,
          "text": ""
        }
      },
      "sizeX": 5,
      "sizeY": 3,
      "minSizeX": 5,
      "minSizeY": 3,
      "col": 15,
      "row": 12
    },
    {
      "id": "widget15",
      "type": "statistic",
      "query": {
        "api": "realtime-statistics",
        "endpoint": "interaction-hold-duration",
        "responseKey": "max",
        "parameters": {}
      },
      "presentation": {
        "header": {
          "show": true,
          "text": "Max Hold Duration"
        },
        "value": {
          "format": "time"
        },
        "footer": {
          "show": false,
          "text": ""
        }
      },
      "sizeX": 5,
      "sizeY": 3,
      "minSizeX": 5,
      "minSizeY": 3,
      "col": 20,
      "row": 12
    },
    {
      "id": "widget16",
      "type": "statistic",
      "query": {
        "api": "realtime-statistics",
        "endpoint": "interaction-hold-duration",
        "responseKey": "min",
        "parameters": {}
      },
      "presentation": {
        "header": {
          "show": true,
          "text": "Min Hold Duration"
        },
        "value": {
          "format": "time"
        },
        "footer": {
          "show": false,
          "text": ""
        }
      },
      "sizeX": 5,
      "sizeY": 3,
      "minSizeX": 5,
      "minSizeY": 3,
      "col": 25,
      "row": 12
    }
  ]
}

);
