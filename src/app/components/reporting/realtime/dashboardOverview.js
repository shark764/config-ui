angular.module('liveopsConfigPanel.config').constant('dashboardOverview',

{
  "id": "overview-dashboard",
  "name": "Overview Dashboard",
  "widgets": [
    {
      "id": "title-widget1",
      "type": "label",
      "presentation": {
        "show": true,
        "text": "All Agents"
      },
      "sizeX": 15,
      "sizeY": 2,
      "col": 4,
      "row": 1
    },
    {
      "id": "title-widget2",
      "type": "label",
      "presentation": {
        "show": true,
        "text": "All Interactions"
      },
      "sizeX": 15,
      "sizeY": 2,
      "col": 21,
      "row": 1
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
          "text": "Agents Currently Ready"
        },
        "value": {
          "format": "count"
        },
        "footer": {
          "show": true,
          "text": "agents"
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
        "endpoint": "resources-away",
        "responseKey": "value",
        "latestResult": null,
        "parameters": {}
      },
      "presentation": {
        "header": {
          "show": true,
          "text": "Agents Currently Away"
        },
        "value": {
          "format": "count"
        },
        "footer": {
          "show": true,
          "text": "agents"
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
        "endpoint": "resources-busy",
        "responseKey": "value",
        "latestResult": null,
        "parameters": {}
      },
      "presentation": {
        "header": {
          "show": true,
          "text": "Agents Currently Busy"
        },
        "value": {
          "format": "count"
        },
        "footer": {
          "show": true,
          "text": "agents"
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
        "endpoint": "conversation-duration",
        "responseKey": "avg",
        "latestResult": null,
        "parameters": {}
      },
      "presentation": {
        "header": {
          "show": true,
          "text": "Avg. Conversation Duration"
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
      "row": 6
    },
    {
      "id": "widget5",
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
          "text": "Avg. Time To Answer"
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
      "row": 6
    },
    {
      "id": "widget6",
      "type": "statistic",
      "query": {
        "api": "realtime-statistics",
        "endpoint": "resource-hold-start-instance",
        "responseKey": "recordsCount",
        "latestResult": null,
        "parameters": {}
      },
      "presentation": {
        "header": {
          "show": true,
          "text": "Total Holds Triggered"
        },
        "value": {
          "format": "count"
        },
        "footer": {
          "show": true,
          "text": "holds"
        }
      },
      "sizeX": 5,
      "sizeY": 3,
      "minSizeX": 5,
      "minSizeY": 3,
      "col": 14,
      "row": 6
    },
    {
      "id": "widget7",
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
          "text": "Total In Queue"
        },
        "value": {
          "format": "count"
        },
        "footer": {
          "show": true,
          "text": "customers"
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
        "endpoint": "queue-duration",
        "responseKey": "max",
        "latestResult": null,
        "parameters": {}
      },
      "presentation": {
        "header": {
          "show": true,
          "text": "Max Queue Wait Time"
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
      "row": 3
    },
    {
      "id": "widget9",
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
          "text": "Queue Abandons"
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
      "col": 31,
      "row": 3
    },
    {
      "id": "widget10",
      "type": "statistic",
      "query": {
        "api": "realtime-statistics",
        "endpoint": "interaction-duration",
        "responseKey": "avg",
        "latestResult": null,
        "parameters": {}
      },
      "presentation": {
        "header": {
          "show": true,
          "text": "Avg. Interaction Time"
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
      "row": 6
    },
    {
      "id": "widget11",
      "type": "statistic",
      "query": {
        "api": "realtime-statistics",
        "endpoint": "interactions-in-conversation-count",
        "responseKey": "recordsCount",
        "latestResult": null,
        "parameters": {}
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
      "col": 26,
      "row": 6
    },
    {
      "id": "widget12",
      "type": "statistic",
      "query": {
        "api": "realtime-statistics",
        "endpoint": "abandon-time-duration",
        "responseKey": "avg",
        "latestResult": null,
        "parameters": {}
      },
      "presentation": {
        "header": {
          "show": true,
          "text": "Avg. Abandon Time"
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
      "row": 6
    }
  ]
}

);
