angular.module('liveopsConfigPanel.config').constant('dashboardResources',

{
  "id": "resources-dashboard",
  "name": "Resources Dashboard",
  "widgets": [
    {
      "id": "title-widget1",
      "type": "label",
      "presentation": {
        "show": true,
        "text": "Ready Resources"
      },
      "sizeX": 15,
      "sizeY": 1,
      "col": 4,
      "row": 2
    },
    {
      "id": "title-widget2",
      "type": "label",
      "presentation": {
        "show": true,
        "text": "Not Ready Resources"
      },
      "sizeX": 15,
      "sizeY": 1,
      "col": 4,
      "row": 7
    },
    {
      "id": "title-widget3",
      "type": "label",
      "presentation": {
        "show": true,
        "text": "Busy Resources"
      },
      "sizeX": 15,
      "sizeY": 1,
      "col": 21,
      "row": 2
    },
    {
      "id": "title-widget4",
      "type": "label",
      "presentation": {
        "show": true,
        "text": "Hold Duration"
      },
      "sizeX": 15,
      "sizeY": 1,
      "col": 4,
      "row": 12
    },
    {
      "id": "title-widget5",
      "type": "label",
      "presentation": {
        "show": true,
        "text": "In Conversation Duration"
      },
      "sizeX": 15,
      "sizeY": 1,
      "col": 21,
      "row": 7
    },
    {
      "id": "title-widget6",
      "type": "label",
      "presentation": {
        "show": true,
        "text": "Time To Answer Duration"
      },
      "sizeX": 15,
      "sizeY": 1,
      "col": 21,
      "row": 12
    },
    {
      "id": "widget1",
      "type": "statistic",
      "query": {
        "api": "realtime-statistics",
        "endpoint": "resources-ready",
        "responseKey": "value",
        "latestResult": null,
        "parameters": {}
      },
      "presentation": {
        "header": {
          "show": true,
          "text": "Concurrent"
        },
        "value": {
          "format": "count"
        },
        "footer": {
          "show": true,
          "text": "Ready Resources"
        }
      },
      "sizeX": 5,
      "sizeY": 3,
      "minSizeX": 5,
      "minSizeY": 3,
      "col": 4,
      "row": 3
    },
    {
      "id": "widget2",
      "type": "statistic",
      "query": {
        "api": "realtime-statistics",
        "endpoint": "resources-ready",
        "responseKey": "max",
        "latestResult": null,
        "parameters": {
          "gauge-start": "2015-10-25T00:00:00.000",
          "gauge-end": "2015-10-25T23:59:59.999"
        }
      },
      "presentation": {
        "header": {
          "show": true,
          "text": "Max"
        },
        "value": {
          "format": "count"
        },
        "footer": {
          "show": true,
          "text": "Ready Resources"
        }
      },
      "sizeX": 5,
      "sizeY": 3,
      "minSizeX": 5,
      "minSizeY": 3,
      "col": 9,
      "row": 3
    },
    {
      "id": "widget3",
      "type": "statistic",
      "query": {
        "api": "realtime-statistics",
        "endpoint": "resources-ready",
        "responseKey": "min",
        "latestResult": null,
        "parameters": {
          "gauge-start": "2015-10-25T00:00:00.000",
          "gauge-end": "2015-10-25T23:59:59.999"
        }
      },
      "presentation": {
        "header": {
          "show": true,
          "text": "Min"
        },
        "value": {
          "format": "count"
        },
        "footer": {
          "show": true,
          "text": "Ready Resources"
        }
      },
      "sizeX": 5,
      "sizeY": 3,
      "minSizeX": 5,
      "minSizeY": 3,
      "col": 14,
      "row": 3
    },
    {
      "id": "widget4",
      "type": "statistic",
      "query": {
        "api": "realtime-statistics",
        "endpoint": "resources-away",
        "responseKey": "value",
        "latestResult": null,
        "parameters": {}
      },
      "presentation": {
        "header": {
          "show": true,
          "text": "Concurrent"
        },
        "value": {
          "format": "count"
        },
        "footer": {
          "show": true,
          "text": "Not Ready Resources"
        }
      },
      "sizeX": 5,
      "sizeY": 3,
      "minSizeX": 5,
      "minSizeY": 3,
      "col": 4,
      "row": 8
    },
    {
      "id": "widget5",
      "type": "statistic",
      "query": {
        "api": "realtime-statistics",
        "endpoint": "resources-away",
        "responseKey": "max",
        "latestResult": null,
        "parameters": {
          "gauge-start": "2015-10-25T00:00:00.000",
          "gauge-end": "2015-10-25T23:59:59.999"
        }
      },
      "presentation": {
        "header": {
          "show": true,
          "text": "Max"
        },
        "value": {
          "format": "count"
        },
        "footer": {
          "show": true,
          "text": "Not Ready Resources"
        }
      },
      "sizeX": 5,
      "sizeY": 3,
      "minSizeX": 5,
      "minSizeY": 3,
      "col": 9,
      "row": 8
    },
    {
      "id": "widget6",
      "type": "statistic",
      "query": {
        "api": "realtime-statistics",
        "endpoint": "resources-away",
        "responseKey": "min",
        "latestResult": null,
        "parameters": {
          "gauge-start": "2015-10-25T00:00:00.000",
          "gauge-end": "2015-10-25T23:59:59.999"
        }
      },
      "presentation": {
        "header": {
          "show": true,
          "text": "Min"
        },
        "value": {
          "format": "count"
        },
        "footer": {
          "show": true,
          "text": "Not Ready Resources"
        }
      },
      "sizeX": 5,
      "sizeY": 3,
      "minSizeX": 5,
      "minSizeY": 3,
      "col": 14,
      "row": 8
    },
    {
      "id": "widget7",
      "type": "statistic",
      "query": {
        "api": "realtime-statistics",
        "endpoint": "resources-busy",
        "responseKey": "value",
        "latestResult": null,
        "parameters": {}
      },
      "presentation": {
        "header": {
          "show": true,
          "text": "Concurrent"
        },
        "value": {
          "format": "count"
        },
        "footer": {
          "show": true,
          "text": "Busy Resources"
        }
      },
      "sizeX": 5,
      "sizeY": 3,
      "minSizeX": 5,
      "minSizeY": 3,
      "col": 21,
      "row": 3
    },
    {
      "id": "widget8",
      "type": "statistic",
      "query": {
        "api": "realtime-statistics",
        "endpoint": "resources-busy",
        "responseKey": "max",
        "latestResult": null,
        "parameters": {
          "gauge-start": "2015-10-25T00:00:00.000",
          "gauge-end": "2015-10-25T23:59:59.999"
        }
      },
      "presentation": {
        "header": {
          "show": true,
          "text": "Max"
        },
        "value": {
          "format": "count"
        },
        "footer": {
          "show": true,
          "text": "Busy Resources"
        }
      },
      "sizeX": 5,
      "sizeY": 3,
      "minSizeX": 5,
      "minSizeY": 3,
      "col": 26,
      "row": 3
    },
    {
      "id": "widget9",
      "type": "statistic",
      "query": {
        "api": "realtime-statistics",
        "endpoint": "resources-busy",
        "responseKey": "min",
        "latestResult": null,
        "parameters": {
          "gauge-start": "2015-10-25T00:00:00.000",
          "gauge-end": "2015-10-25T23:59:59.999"
        }
      },
      "presentation": {
        "header": {
          "show": true,
          "text": "Min"
        },
        "value": {
          "format": "count"
        },
        "footer": {
          "show": true,
          "text": "Busy Resources"
        }
      },
      "sizeX": 5,
      "sizeY": 3,
      "minSizeX": 5,
      "minSizeY": 3,
      "col": 31,
      "row": 3
    },
    {
      "id": "widget10",
      "type": "statistic",
      "query": {
        "api": "realtime-statistics",
        "endpoint": "conversation-duration",
        "responseKey": "avg",
        "latestResult": null,
        "parameters": {}
      },
      "presentation": {
        "header": {
          "show": true,
          "text": "Average Time"
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
      "col": 21,
      "row": 8
    },
    {
      "id": "widget11",
      "type": "statistic",
      "query": {
        "api": "realtime-statistics",
        "endpoint": "conversation-duration",
        "responseKey": "max",
        "latestResult": null,
        "parameters": {}
      },
      "presentation": {
        "header": {
          "show": true,
          "text": "Max Time"
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
      "col": 26,
      "row": 8
    },
    {
      "id": "widget12",
      "type": "statistic",
      "query": {
        "api": "realtime-statistics",
        "endpoint": "conversation-duration",
        "responseKey": "min",
        "latestResult": null,
        "parameters": {}
      },
      "presentation": {
        "header": {
          "show": true,
          "text": "Min Time"
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
      "col": 31,
      "row": 8
    },
    {
      "id": "widget13",
      "type": "statistic",
      "query": {
        "api": "realtime-statistics",
        "endpoint": "interaction-hold-duration",
        "responseKey": "avg",
        "latestResult": null,
        "parameters": {}
      },
      "presentation": {
        "header": {
          "show": true,
          "text": "Average Time"
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
      "col": 4,
      "row": 13
    },
    {
      "id": "widget14",
      "type": "statistic",
      "query": {
        "api": "realtime-statistics",
        "endpoint": "interaction-hold-duration",
        "responseKey": "max",
        "latestResult": null,
        "parameters": {}
      },
      "presentation": {
        "header": {
          "show": true,
          "text": "Max Time"
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
      "col": 9,
      "row": 13
    },
    {
      "id": "widget15",
      "type": "statistic",
      "query": {
        "api": "realtime-statistics",
        "endpoint": "interaction-hold-duration",
        "responseKey": "min",
        "latestResult": null,
        "parameters": {}
      },
      "presentation": {
        "header": {
          "show": true,
          "text": "Min Time"
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
      "col": 14,
      "row": 13
    },
    {
      "id": "widget16",
      "type": "statistic",
      "query": {
        "api": "realtime-statistics",
        "endpoint": "time-to-answer-duration",
        "responseKey": "avg",
        "latestResult": null,
        "parameters": {}
      },
      "presentation": {
        "header": {
          "show": true,
          "text": "Average Time"
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
      "col": 21,
      "row": 13
    },
    {
      "id": "widget17",
      "type": "statistic",
      "query": {
        "api": "realtime-statistics",
        "endpoint": "time-to-answer-duration",
        "responseKey": "max",
        "latestResult": null,
        "parameters": {}
      },
      "presentation": {
        "header": {
          "show": true,
          "text": "Max Time"
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
      "col": 26,
      "row": 13
    },
    {
      "id": "widget18",
      "type": "statistic",
      "query": {
        "api": "realtime-statistics",
        "endpoint": "time-to-answer-duration",
        "responseKey": "min",
        "latestResult": null,
        "parameters": {}
      },
      "presentation": {
        "header": {
          "show": true,
          "text": "Min Time"
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
      "col": 31,
      "row": 13
    }
  ]
}

);
