/*jshint quotmark: false */

angular.module('liveopsConfigPanel')
  .value('realtimeDashboards', [{
    "id": "overview",
    "dashId": "overview",
    "name": "Overview Dashboard",
    "refreshRate": 30000,
    "gridster": {
      "columns": 60,
      "minRows": 10,
      "maxRows": 40,
      "margins": [
        20,
        20
      ],
      "outerMargin": false,
      "draggable": {
        "enabled": false
      },
      "resizable": {
        "enabled": false
      }
    },
    "widgets": [{
      "id": "00000000-0000-0000-000000000065",
      "type": "sourceSwitcher",
      "config": {
        "groupName": "queue1",
        "sourceType": "queue",
        "items": [],
        "ui": {
          "title": {
            "show": true,
            "text": "Queue:"
          },
          "size": {
            "width": 11,
            "height": 3
          }
        }
      }
    }, {
      "id": "00000000-0000-0000-000000000002",
      "type": "statistic",
      "config": {
        "statistic": "queue-duration",
        "statisticLookup": "recordsCount",
        "groupName": "queue1",
        "resourceIdName": "queue-id",
        "resourceId": null,
        "ui": {
          "title": {
            "show": true,
            "text": "Queue Length"
          },
          "unit": "Customers",
          "size": {
            "width": 6,
            "height": 8
          },
          "position": {
            row: 2,
            col: 0
          }
        }
      },
      "chart": {
        "indicator": {}
      }

    }, {
      "id": "00000000-0000-0000-000000000001",
      "type": "statistic",
      "config": {
        "statistic": "queue-duration",
        "statisticLookup": "avg",
        "groupName": "queue1",
        "resourceIdName": "queue-id",
        "resourceId": null,
        "ui": {
          "title": {
            "show": true,
            "text": "Avg. Wait Time"
          },
          "unit": "seconds",
          "size": {
            "width": 5,
            "height": 4
          },
          "position": {
            row: 4,
            col: 6
          }
        }
      },
      "chart": {
        "indicator": {}
      }
    }, {
      "id": "00000000-0000-0000-000000000003",
      "type": "statistic",
      "config": {
        "statistic": "interaction-abandon-instance",
        "statisticLookup": "recordsCount",
        "groupName": "queue1",
        "resourceIdName": "queue-id",
        "resourceId": null,
        "ui": {
          "title": {
            "show": true,
            "text": "Total Abandons"
          },
          "unit": "Customers",
          "size": {
            "width": 5,
            "height": 4
          },
          "position": {
            row: 8,
            col: 6
          }
        }
      },
      "chart": {
        "indicator": {}
      }

    }, {
      "id": "00000000-0000-0000-000000000066",
      "type": "sourceSwitcher",
      "config": {
        "groupName": "queue2",
        "sourceType": "queue",
        "items": [],
        "ui": {
          "title": {
            "show": true,
            "text": "Queue:"
          },
          "size": {
            "width": 11,
            "height": 3
          },
          "position": {
            "row": 0,
            "col": 12
          }
        }
      }
    }, {
      "id": "00000000-0000-0000-000000000068",
      "type": "statistic",
      "config": {
        "statistic": "queue-duration",
        "statisticLookup": "recordsCount",
        "groupName": "queue2",
        "resourceIdName": "queue-id",
        "resourceId": null,
        "ui": {
          "title": {
            "show": true,
            "text": "Queue Length"
          },
          "unit": "Customers",
          "size": {
            "width": 6,
            "height": 8
          },
          "position": {
            row: 4,
            col: 12
          }
        }
      },
      "chart": {
        "indicator": {}
      }

    }, {
      "id": "00000000-0000-0000-000000000067",
      "type": "statistic",
      "config": {
        "statistic": "queue-duration",
        "statisticLookup": "avg",
        "groupName": "queue2",
        "resourceIdName": "queue-id",
        "resourceId": null,
        "ui": {
          "title": {
            "show": true,
            "text": "Avg. Wait Time"
          },
          "unit": "seconds",
          "size": {
            "width": 5,
            "height": 4
          },
          "position": {
            row: 4,
            col: 18
          }
        }
      },
      "chart": {
        "indicator": {}
      }
    }, {
      "id": "00000000-0000-0000-000000000069",
      "type": "statistic",
      "config": {
        "statistic": "interaction-abandon-instance",
        "statisticLookup": "recordsCount",
        "groupName": "queue2",
        "resourceIdName": "queue-id",
        "resourceId": null,
        "ui": {
          "title": {
            "show": true,
            "text": "Total Abandons"
          },
          "unit": "Customers",
          "size": {
            "width": 5,
            "height": 4
          },
          "position": {
            row: 8,
            col: 18
          }
        }
      },
      "chart": {
        "indicator": {}
      }
    }, {
      "id": "00000000-0000-0000-000000000081",
      "type": "title",
      "config": {
        "ui": {
          "size": {
            "width": 15,
            "height": 3
          },
          "position": {
            row: 0,
            col: 25
          }
        }
      },
      "chart": {
        "data": 'All Agents'
      }
    }, {
      "id": "00000000-0000-0000-000000000082",
      "type": "statistic",
      "config": {
        "statistic": "resource-ready-instance",
        "statisticLookup": "recordsCount",
        "ui": {
          "title": {
            "show": true,
            "text": "Agents Ready"
          },
          "unit": "Agents",
          "size": {
            "width": 5,
            "height": 5
          },
          "position": {
            row: 4,
            col: 25
          }
        }
      },
      "chart": {
        "indicator": {}
      }
    }, {
      "id": "00000000-0000-0000-000000000083",
      "type": "statistic",
      "config": {
        "statistic": "resource-not-ready-instance",
        "statisticLookup": "recordsCount",
        "ui": {
          "title": {
            "show": true,
            "text": "Agents Not Ready"
          },
          "unit": "Agents",
          "size": {
            "width": 5,
            "height": 5
          },
          "position": {
            row: 4,
            col: 30
          }
        }
      },
      "chart": {
        "indicator": {}
      }
    }, {
      "id": "00000000-0000-0000-000000000084",
      "type": "statistic",
      "config": {
        "statistic": "resource-busy-duration",
        "statisticLookup": "recordsCount",
        "ui": {
          "title": {
            "show": true,
            "text": "Agents Busy"
          },
          "unit": "Agents",
          "size": {
            "width": 5,
            "height": 5
          },
          "position": {
            row: 4,
            col: 35
          }
        }
      },
      "chart": {
        "indicator": {}
      }
    }, {
      "id": "00000000-0000-0000-000000000085",
      "type": "statistic",
      "config": {
        "statistic": "resource-conversation-duration",
        "statisticLookup": "avg",
        "ui": {
          "title": {
            "show": true,
            "text": "Avg. Conversation Time"
          },
          "unit": "seconds",
          "size": {
            "width": 5,
            "height": 5
          },
          "position": {
            row: 9,
            col: 25
          }
        }
      },
      "chart": {
        "indicator": {}
      }
    }, {
      "id": "00000000-0000-0000-000000000086",
      "type": "statistic",
      "config": {
        "statistic": "wrap-up-duration",
        "statisticLookup": "avg",
        "ui": {
          "title": {
            "show": true,
            "text": "Avg. Wrap-up Time"
          },
          "unit": "seconds",
          "size": {
            "width": 5,
            "height": 5
          },
          "position": {
            row: 9,
            col: 30
          }
        }
      },
      "chart": {
        "indicator": {}
      }
    }, {
      "id": "00000000-0000-0000-000000000087",
      "type": "statistic",
      "config": {
        "statistic": "resource-hold-duration",
        "statisticLookup": "recordsCount",
        "ui": {
          "title": {
            "show": true,
            "text": "Hold Count"
          },
          "unit": "Holds",
          "size": {
            "width": 5,
            "height": 5
          },
          "position": {
            row: 9,
            col: 35
          }
        }
      },
      "chart": {
        "indicator": {}
      }
    }, {
      "id": "00000000-0000-0000-000000000070",
      "type": "title",
      "config": {
        "ui": {
          "size": {
            "width": 18,
            "height": 3
          },
          "position": {
            row: 0,
            col: 42
          }
        }
      },
      "chart": {
        "data": 'All Interactions'
      }

    }, {
      "id": "00000000-0000-0000-000000000073",
      "type": "statistic",
      "config": {
        "statistic": "queue-duration",
        "statisticLookup": "recordsCount",
        "ui": {
          "title": {
            "show": true,
            "text": "Total in Queue"
          },
          "unit": "Customers",
          "size": {
            "width": 6,
            "height": 6
          },
          "position": {
            row: 4,
            col: 42
          }
        }
      },
      "chart": {
        "indicator": {}
      }
    }, {
      "id": "00000000-0000-0000-000000000072",
      "type": "statistic",
      "config": {
        "statistic": "interactions",
        "statisticLookup": "recordsCount",
        "ui": {
          "title": {
            "show": true,
            "text": "Interactions in Conversation"
          },
          "unit": "Interactions",
          "size": {
            "width": 6,
            "height": 6
          },
          "position": {
            row: 4,
            col: 48
          }
        }
      },
      "chart": {
        "indicator": {}
      }
    }, {
      "id": "00000000-0000-0000-000000000074",
      "type": "statistic",
      "config": {
        "statistic": "abandon-queue-instance",
        "statisticLookup": "recordsCount",
        "ui": {
          "title": {
            "show": true,
            "text": "Queue Abandons"
          },
          "unit": "Customers",
          "size": {
            "width": 6,
            "height": 6
          },
          "position": {
            row: 4,
            col: 55
          }
        }
      },
      "chart": {
        "indicator": {}
      }
    }, {
      "id": "00000000-0000-0000-000000000076",
      "type": "statistic",
      "config": {
        "statistic": "interaction-duration",
        "statisticLookup": "avg",
        "ui": {
          "title": {
            "show": true,
            "text": "Avg. Interaction Time"
          },
          "unit": "seconds",
          "size": {
            "width": 9,
            "height": 5
          },
          "position": {
            row: 12,
            col: 42
          }
        }
      },
      "chart": {
        "indicator": {}
      }
    }, {
      "id": "00000000-0000-0000-000000000079",
      "type": "statistic",
      "config": {
        "statistic": "abandon-time-duration",
        "statisticLookup": "avg",
        "ui": {
          "title": {
            "show": true,
            "text": "Avg. Abandon Time"
          },
          "unit": "seconds",
          "size": {
            "width": 9,
            "height": 5
          },
          "position": {
            row: 12,
            col: 51
          }
        }
      },
      "chart": {
        "indicator": {}
      }
    }]
  }, {
    "id": "resource",
    "dashId": "resource",
    "name": "Resource Dashboard",
    "refreshRate": 30000,
    "gridster": {
      "columns": 29,
      "minRows": 10,
      "maxRows": 40,
      "margins": [
        20,
        20
      ],
      "outerMargin": false,
      "draggable": {
        "enabled": false
      },
      "resizable": {
        "enabled": false
      }
    },
    "widgets": [{
      "id": "00000000-0000-0000-000000000001",
      "type": "title",
      "config": {
        "ui": {
          "size": {
            "width": 9,
            "height": 2
          },
          "position": {
            row: 0,
            col: 0
          }
        }
      },
      "chart": {
        "data": "Ready Resources"
      }

    }, {
      "id": "00000000-0000-0000-000000000002",
      "type": "statistic",
      "config": {
        "statistic": "resource-ready-instance",
        "statisticLookup": "recordsCount",
        "ui": {
          "title": {
            "show": true,
            "text": "Current"
          },
          "unit": "Resources",
          "size": {
            "width": 3,
            "height": 3
          },
          "position": {
            row: 2,
            col: 0
          }
        }
      },
      "chart": {
        "indicator": {}
      }

    }, {
      "id": "00000000-0000-0000-000000000003",
      "type": "statistic",
      "config": {
        "statistic": "resource-ready-instance",
        "statisticLookup": "recordsCount",
        "ui": {
          "title": {
            "show": true,
            "text": "Max Concurrent"
          },
          "unit": "Resources",
          "size": {
            "width": 3,
            "height": 3
          },
          "position": {
            row: 2,
            col: 3
          }
        }
      },
      "chart": {
        "indicator": {}
      }
    }, {
      "id": "00000000-0000-0000-000000000004",
      "type": "statistic",
      "config": {
        "statistic": "resource-ready-instance",
        "statisticLookup": "recordsCount",
        "ui": {
          "title": {
            "show": true,
            "text": "Min Concurrent"
          },
          "unit": "Resources",
          "size": {
            "width": 3,
            "height": 3
          },
          "position": {
            row: 2,
            col: 6
          }
        }
      },
      "chart": {
        "indicator": {}
      }

    }, {
      "id": "00000000-0000-0000-000000000006",
      "type": "title",
      "config": {
        "ui": {
          "size": {
            "width": 9,
            "height": 2
          },
          "position": {
            row: 0,
            col: 10
          }
        }
      },
      "chart": {
        "data": "Not Ready Resources"
      }

    }, {
      "id": "00000000-0000-0000-000000000007",
      "type": "statistic",
      "config": {
        "statistic": "resource-not-ready-instance",
        "statisticLookup": "recordsCount",
        "ui": {
          "title": {
            "show": true,
            "text": "Concurrent"
          },
          "unit": "Resources",
          "size": {
            "width": 3,
            "height": 3
          },
          "position": {
            row: 2,
            col: 10
          }
        }
      },
      "chart": {
        "indicator": {}
      }
    }, {
      "id": "00000000-0000-0000-000000000008",
      "type": "statistic",
      "config": {
        "statistic": "resource-not-ready-instance",
        "statisticLookup": "recordsCount",
        "ui": {
          "title": {
            "show": true,
            "text": "Max Concurrent"
          },
          "unit": "Resources",
          "size": {
            "width": 3,
            "height": 3
          },
          "position": {
            row: 2,
            col: 13
          }
        }
      },
      "chart": {
        "indicator": {}
      }

    }, {
      "id": "00000000-0000-0000-000000000009",
      "type": "statistic",
      "config": {
        "statistic": "resource-not-ready-instance",
        "statisticLookup": "recordsCount",
        "ui": {
          "title": {
            "show": true,
            "text": "Min Concurrent"
          },
          "unit": "Resources",
          "size": {
            "width": 3,
            "height": 3
          },
          "position": {
            row: 2,
            col: 16
          }
        }
      },
      "chart": {
        "indicator": {}
      }

    }, {
      "id": "00000000-0000-0000-000000000011",
      "type": "title",
      "config": {
        "ui": {
          "size": {
            "width": 9,
            "height": 2
          },
          "position": {
            row: 0,
            col: 20
          }
        }
      },
      "chart": {
        "data": "Busy Resources"
      }

    }, {
      "id": "00000000-0000-0000-000000000012",
      "type": "statistic",
      "config": {
        "statistic": "resource-busy-duration",
        "statisticLookup": "recordsCount",
        "ui": {
          "title": {
            "show": true,
            "text": "Concurrent"
          },
          "unit": "Resources",
          "size": {
            "width": 3,
            "height": 3
          },
          "position": {
            row: 2,
            col: 20
          }
        }
      },
      "chart": {
        "indicator": {}
      }
    }, {
      "id": "00000000-0000-0000-000000000013",
      "type": "statistic",
      "config": {
        "statistic": "resource-busy-duration",
        "statisticLookup": "recordsCount",
        "ui": {
          "title": {
            "show": true,
            "text": "Max Concurrent"
          },
          "unit": "Resources",
          "size": {
            "width": 3,
            "height": 3
          },
          "position": {
            row: 2,
            col: 23
          }
        }
      },
      "chart": {
        "indicator": {}
      }

    }, {
      "id": "00000000-0000-0000-000000000014",
      "type": "statistic",
      "config": {
        "statistic": "resource-busy-duration",
        "statisticLookup": "recordsCount",
        "ui": {
          "title": {
            "show": true,
            "text": "Min Concurrent"
          },
          "unit": "Resources",
          "size": {
            "width": 3,
            "height": 3
          },
          "position": {
            row: 2,
            col: 26
          }
        }
      },
      "chart": {
        "indicator": {}
      }

    }]
  }, {
    "id": "queues",
    "dashId": "queues",
    "name": "Queue Dashboard",
    "refreshRate": 30000,
    "gridster": {
      "columns": 30,
      "minRows": 10,
      "maxRows": 40,
      "margins": [
        20,
        20
      ],
      "outerMargin": false,
      "draggable": {
        "enabled": false
      },
      "resizable": {
        "enabled": false
      }
    },
    "widgets": [{
      "id": "00000000-0000-0000-000000000001",
      "type": "title",
      "config": {
        "ui": {
          "size": {
            "width": 10,
            "height": 2
          },
          "position": {
            row: 0,
            col: 0
          }
        }
      },
      "chart": {
        "data": "All Queues"
      }

    }, {
      "id": "00000000-0000-0000-000000000090",
      "type": "gauge",
      "config": {
        "statistic": "calls-answered-percent",
        "statisticLookup": "calls-answered",
        "ui": {
          "title": {
            "show": true,
            "text": "Answered < 20s"
          },
          "unit": "Answered < 20s",
          "size": {
            "width": 3,
            "height": 4
          },
          "position": {
            "row": 2,
            "col": 0
          }
        }
      },
      "chart": {
        "data": {
          "type": "gauge",
          "columns": [["Name of graph",12]]
        }
      }

    }, {
      "id": "00000000-0000-0000-000000000002",
      "type": "statistic",
      "config": {
        "statistic": "handle-time-duration",
        "statisticLookup": "avg",
        "ui": {
          "title": {
            "show": true,
            "text": "Avg Wait Time"
          },
          "unit": "seconds",
          "size": {
            "width": 3,
            "height": 2
          },
          "position": {
            row: 2,
            col: 3
          }
        }
      },
      "chart": {
        "indicator": {}
      }

    }, {
      "id": "00000000-0000-0000-000000000003",
      "type": "statistic",
      "config": {
        "statistic": "handle-time-duration",
        "statisticLookup": "max",
        "ui": {
          "title": {
            "show": true,
            "text": "Max Wait Time"
          },
          "unit": "seconds",
          "size": {
            "width": 3,
            "height": 2
          },
          "position": {
            row: 2,
            col: 6
          }
        }
      },
      "chart": {
        "indicator": {}
      }
    }, {
      "id": "00000000-0000-0000-000000000004",
      "type": "statistic",
      "config": {
        "statistic": "interaction-abandon-instance",
        "statisticLookup": "recordsCount",
        "ui": {
          "title": {
            "show": true,
            "text": "Abandons"
          },
          "unit": "Customers",
          "size": {
            "width": 3,
            "height": 2
          },
          "position": {
            row: 4,
            col: 3
          }
        }
      },
      "chart": {
        "indicator": {}
      }

    }, {
      "id": "00000000-0000-0000-000000000030",
      "type": "statistic",
      "config": {
        "statistic": "queue-length",
        "statisticLookup": "recordsCount",
        "ui": {
          "title": {
            "show": true,
            "text": "Queue Length"
          },
          "size": {
            "width": 3,
            "height": 2
          },
          "position": {
            row: 4,
            col: 6
          }
        }
      },
      "chart": {
        "indicator": {}
      }

    }, {
      "id": "00000000-0000-0000-000000000066",
      "type": "sourceSwitcher",
      "config": {
        "groupName": "queue1",
        "sourceType": "queue",
        "items": [],
        "ui": {
          "title": {
            "show": true,
            "text": "Queue:"
          },
          "size": {
            "width": 10,
            "height": 2
          },
          "position": {
            "row": 0,
            "col": 10
          }
        }
      }
    }, {
      "id": "00000000-0000-0000-000000000091",
      "type": "gauge",
      "config": {
        "statistic": "calls-answered-percent",
        "statisticLookup": "calls-answered",
        "groupName": "queue1",
        "resourceIdName": "queue-id",
        "resourceId": null,
        "ui": {
          "title": {
            "show": true,
            "text": "Answered < 20s"
          },
          "unit": "Answered < 20s",
          "size": {
            "width": 3,
            "height": 4
          },
          "position": {
            "row": 3,
            "col": 10
          }
        }
      },
      "chart": {
        "data": {
          "type": "gauge",
          "columns": [["Name of graph",20]]
        }
      }

    }, {
      "id": "00000000-0000-0000-000000000007",
      "type": "statistic",
      "config": {
        "statistic": "handle-time-duration",
        "statisticLookup": "avg",
        "groupName": "queue1",
        "resourceIdName": "queue-id",
        "resourceId": null,
        "ui": {
          "title": {
            "show": true,
            "text": "Avg Wait Time"
          },
          "unit": "seconds",
          "size": {
            "width": 3,
            "height": 2
          },
          "position": {
            row: 3,
            col: 13
          }
        }
      },
      "chart": {
        "indicator": {}
      }

    }, {
      "id": "00000000-0000-0000-000000000008",
      "type": "statistic",
      "config": {
        "statistic": "handle-time-duration",
        "statisticLookup": "max",
        "groupName": "queue1",
        "resourceIdName": "queue-id",
        "resourceId": null,
        "ui": {
          "title": {
            "show": true,
            "text": "Max Wait Time"
          },
          "unit": "seconds",
          "size": {
            "width": 3,
            "height": 2
          },
          "position": {
            row: 3,
            col: 16
          }
        }
      },
      "chart": {
        "indicator": {}
      }
    }, {
      "id": "00000000-0000-0000-000000000009",
      "type": "statistic",
      "config": {
        "statistic": "interaction-abandon-instance",
        "statisticLookup": "recordsCount",
        "groupName": "queue1",
        "resourceIdName": "queue-id",
        "resourceId": null,
        "ui": {
          "title": {
            "show": true,
            "text": "Abandons"
          },
          "unit": "Customers",
          "size": {
            "width": 3,
            "height": 2
          },
          "position": {
            row: 5,
            col: 13
          }
        }
      },
      "chart": {
        "indicator": {}
      }

    }, {
      "id": "00000000-0000-0000-000000000010",
      "type": "statistic",
      "config": {
        "statistic": "queue-length",
        "statisticLookup": "recordsCount",
        "groupName": "queue1",
        "resourceIdName": "queue-id",
        "resourceId": null,
        "ui": {
          "title": {
            "show": true,
            "text": "Queue Length"
          },
          "size": {
            "width": 3,
            "height": 2
          },
          "position": {
            row: 5,
            col: 16
          }
        }
      },
      "chart": {
        "indicator": {}
      }

    }, {
      "id": "00000000-0000-0000-000000000066",
      "type": "sourceSwitcher",
      "config": {
        "groupName": "queue2",
        "sourceType": "queue",
        "items": [],
        "ui": {
          "title": {
            "show": true,
            "text": "Queue:"
          },
          "size": {
            "width": 10,
            "height": 2
          },
          "position": {
            "row": 0,
            "col": 20
          }
        }
      }
    },{
      "id": "00000000-0000-0000-000000000092",
      "type": "gauge",
      "config": {
        "statistic": "calls-answered-percent",
        "statisticLookup": "calls-answered",
        "groupName": "queue2",
        "resourceIdName": "queue-id",
        "resourceId": null,
        "ui": {
          "title": {
            "show": true,
            "text": "Answered < 20s"
          },
          "unit": "Answered < 20s",
          "size": {
            "width": 3,
            "height": 4
          },
          "position": {
            "row": 3,
            "col": 20
          }
        }
      },
      "chart": {
        "data": {
          "columns": [["Name of graph",12]]
        }
      }

    }, {
      "id": "00000000-0000-0000-000000000013",
      "type": "statistic",
      "config": {
        "statistic": "handle-time-duration",
        "statisticLookup": "avg",
        "groupName": "queue2",
        "resourceIdName": "queue-id",
        "resourceId": null,
        "ui": {
          "title": {
            "show": true,
            "text": "Avg Wait Time"
          },
          "unit": "seconds",
          "size": {
            "width": 3,
            "height": 2
          },
          "position": {
            row: 3,
            col: 23
          }
        }
      },
      "chart": {
        "indicator": {}
      }

    }, {
      "id": "00000000-0000-0000-000000000014",
      "type": "statistic",
      "config": {
        "statistic": "handle-time-duration",
        "statisticLookup": "max",
        "groupName": "queue2",
        "resourceIdName": "queue-id",
        "resourceId": null,
        "ui": {
          "title": {
            "show": true,
            "text": "Max Wait Time"
          },
          "unit": "seconds",
          "size": {
            "width": 3,
            "height": 2
          },
          "position": {
            row: 3,
            col: 26
          }
        }
      },
      "chart": {
        "indicator": {}
      }
    }, {
      "id": "00000000-0000-0000-000000000015",
      "type": "statistic",
      "config": {
        "statistic": "interaction-abandon-instance",
        "statisticLookup": "recordsCount",
        "groupName": "queue2",
        "resourceIdName": "queue-id",
        "resourceId": null,
        "ui": {
          "title": {
            "show": true,
            "text": "Abandons"
          },
          "unit": "Customers",
          "size": {
            "width": 3,
            "height": 2
          },
          "position": {
            row: 5,
            col: 23
          }
        }
      },
      "chart": {
        "indicator": {}
      }

    }, {
      "id": "00000000-0000-0000-000000000016",
      "type": "statistic",
      "config": {
        "statistic": "queue-length",
        "statisticLookup": "recordsCount",
        "groupName": "queue2",
        "resourceIdName": "queue-id",
        "resourceId": null,
        "ui": {
          "title": {
            "show": true,
            "text": "Queue Length"
          },
          "size": {
            "width": 3,
            "height": 2
          },
          "position": {
            row: 5,
            col: 26
          }
        }
      },
      "chart": {
        "indicator": {}
      }

    }]
  }, {
    "id": "interactions",
    "dashId": "interactions",
    "name": "Interactions Dashboard",
    "refreshRate": 30000,
    "gridster": {
      "columns": 20,
      "minRows": 10,
      "maxRows": 40,
      "margins": [
        20,
        20
      ],
      "outerMargin": false,
      "draggable": {
        "enabled": false
      },
      "resizable": {
        "enabled": false
      }
    },
    "widgets": [{
      "id": "00000000-0000-0000-000000000001",
      "type": "title",
      "config": {
        "ui": {
          "size": {
            "width": 20,
            "height": 1
          },
          "position": {
            row: 0,
            col: 0
          }
        }
      },
      "chart": {
        "data": "All Interactions"
      }

    }, {
      "id": "00000000-0000-0000-000000000002",
      "type": "statistic",
      "config": {
        "statistic": "interaction-duration",
        "statisticLookup": "recordsCount",
        "ui": {
          "title": {
            "show": true,
            "text": "Total Active"
          },
          "unit": "Interactions",
          "size": {
            "width": 4,
            "height": 4
          },
          "position": {
            row: 2,
            col: 0
          }
        }
      },
      "chart": {
        "indicator": {}
      }

    }, {
      "id": "00000000-0000-0000-000000000003",
      "type": "statistic",
      "config": {
        "statistic": "resource-conversation-duration",
        "statisticLookup": "recordsCount",
        "ui": {
          "title": {
            "show": true,
            "text": "In Conversation"
          },
          "unit": "Interactions",
          "size": {
            "width": 4,
            "height": 4
          },
          "position": {
            row: 2,
            col: 4
          }
        }
      },
      "chart": {
        "indicator": {}
      }
    }, {
      "id": "00000000-0000-0000-000000000004",
      "type": "statistic",
      "config": {
        "statistic": "interaction-duration",
        "statisticLookup": "recordsCount",
        "ui": {
          "title": {
            "show": true,
            "text": "Total Today"
          },
          "unit": "Interactions",
          "size": {
            "width": 4,
            "height": 2
          },
          "position": {
            row: 2,
            col: 8
          }
        }
      },
      "chart": {
        "indicator": {}
      }

    }, {
      "id": "00000000-0000-0000-000000000030",
      "type": "statistic",
      "config": {
        "statistic": "queue-duration",
        "statisticLookup": "recordsCount",
        "ui": {
          "title": {
            "show": true,
            "text": "In Queue"
          },
          "unit": "Interactions",
          "size": {
            "width": 4,
            "height": 2
          },
          "position": {
            row: 6,
            col: 8
          }
        }
      },
      "chart": {
        "indicator": {}
      }

    }, {
      "id": "00000000-0000-0000-000000000006",
      "type": "statistic",
      "config": {
        "statistic": "interaction-duration",
        "statisticLookup": "avg",
        "ui": {
          "title": {
            "show": true,
            "text": "Avg. Interaction Duration"
          },
          "unit": "seconds",
          "size": {
            "width": 4,
            "height": 2
          },
          "position": {
            row: 2,
            col: 12
          }
        }
      },
      "chart": {
        "indicator": {}
      }

    }, {
      "id": "00000000-0000-0000-000000000007",
      "type": "statistic",
      "config": {
        "statistic": "interaction-abandon-instance",
        "statisticLookup": "recordsCount",
        "ui": {
          "title": {
            "show": true,
            "text": "Abandons"
          },
          "unit": "Interactions",
          "size": {
            "width": 4,
            "height": 2
          },
          "position": {
            row: 6,
            col: 12
          }
        }
      },
      "chart": {
        "indicator": {}
      }

    }, {
      "id": "00000000-0000-0000-000000000008",
      "type": "statistic",
      "config": {
        "statistic": "interaction-transfer-instance",
        "statisticLookup": "recordsCount",
        "ui": {
          "title": {
            "show": true,
            "text": "Transfers"
          },
          "unit": "Interactions",
          "size": {
            "width": 4,
            "height": 2
          },
          "position": {
            row: 2,
            col: 16
          }
        }
      },
      "chart": {
        "indicator": {}
      }

    }, {
      "id": "00000000-0000-0000-000000000009",
      "type": "statistic",
      "config": {
        "statistic": "interaction-abandon-instance",
        "statisticLookup": "recordsCount",
        "ui": {
          "title": {
            "show": true,
            "text": "IVR Abandons"
          },
          "unit": "Interactions",
          "size": {
            "width": 4,
            "height": 2
          },
          "position": {
            row: 6,
            col: 16
          }
        }
      },
      "chart": {
        "indicator": {}
      }

    }]
  }]);
