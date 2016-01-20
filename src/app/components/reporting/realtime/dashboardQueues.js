angular.module('liveopsConfigPanel.config').constant('dashboardQueues',

{
  "id": "queues-dashboard",
  "name": "Queues Dashboard",
  "widgets": [
    {
      "id": "title-widget1",
      "type": "label",
      "presentation": {
        "show": true,
        "text": "All Queues"
      },
      "sizeX": 30,
      "sizeY": 2,
      "col": 5,
      "row": 1
    },
    {
      "id": "widget1",
      "type": "statistic",
      "query": {
        "api": "realtime-statistics",
        "endpoint": "queue-length",
        "responseKey": "recordsCount",
        "latestResult": null,
        "parameters": {}
      },
      "presentation": {
        "header": {
          "show": true,
          "text": "Queue Length"
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
      "col": 5,
      "row": 3
    },
    {
      "id": "widget2",
      "type": "statistic",
      "query": {
        "api": "realtime-statistics",
        "endpoint": "service-level",
        "responseKey": "serviceLevel",
        "parameters": {}
      },
      "presentation": {
        "header": {
          "show": true,
          "text": "Answered < 20s"
        },
        "value": {
          "format": "percent"
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
      "id": "widget3",
      "type": "statistic",
      "query": {
        "api": "realtime-statistics",
        "endpoint": "abandon-queue-instance",
        "responseKey": "recordsCount",
        "latestResult": null,
        "parameters": {}
      },
      "presentation": {
        "header": {
          "show": true,
          "text": "Abandons"
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
        "endpoint": "queue-duration",
        "responseKey": "avg",
        "latestResult": null,
        "parameters": {}
      },
      "presentation": {
        "header": {
          "show": true,
          "text": "Average Wait Time"
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
      "row": 3
    },
    {
      "id": "widget5",
      "type": "statistic",
      "query": {
        "api": "realtime-statistics",
        "endpoint": "queue-duration",
        "responseKey": "min",
        "latestResult": null,
        "parameters": {}
      },
      "presentation": {
        "header": {
          "show": true,
          "text": "Min Wait Time"
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
      "col": 30,
      "row": 3
    },
    {
      "id": "widget6",
      "type": "statistic",
      "query": {
        "api": "realtime-statistics",
        "endpoint": "queue-duration",
        "responseKey": "max",
        "latestResult": null,
        "parameters": {}
      },
      "presentation": {
        "header": {
          "show": true,
          "text": "Max Wait Time"
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
      "row": 3
    }
  ]
}

);
