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
          "unit": "mm:ss",
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
          "unit": "mm:ss",
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
          "unit": "mm:ss",
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
          "unit": "mm:ss",
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
        "statistic": "interaction-start-instance",
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
          "unit": "mm:ss",
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
          "unit": "mm:ss",
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
      "id": "00000000-0000-0000-000000000005",
      "type": "table",
      "config": {
        "ui": {
          "size": {
            "width": 9,
            "height": 9
          },
          "position": {
            row: 5,
            col: 0
          }
        }
      },
      "chart": {
        'data': {
          'headers': [
            'Agent',
            'ID',
            'Groups',
            'Reason'
          ],
          'rows': [
            [
              'user@test.com',
              '15678',
              'Support A, MultiLingual',
              'Awaiting Work'
            ], [
              'user@example.com',
              '98332',
              'MultiLingual, Billing',
              'Awaiting Work'
            ]
          ]
        }
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
      "id": "00000000-0000-0000-000000000010",
      "type": "table",
      "config": {
        "ui": {
          "size": {
            "width": 9,
            "height": 9
          },
          "position": {
            row: 5,
            col: 10
          }
        }
      },
      "chart": {
        'data': {
          'headers': [
            'Agent',
            'ID',
            'Groups',
            'Reason'
          ],
          'rows': [
            [
              'agent@test.com',
              '56666',
              'Support C, Technical Support',
              'Lunch'
            ], [
              'trainee@test.com',
              '44665',
              'Trainee',
              'Training'
            ]
          ]
        }
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

    }, {
      "id": "00000000-0000-0000-000000000015",
      "type": "table",
      "config": {
        "ui": {
          "size": {
            "width": 9,
            "height": 7
          },
          "position": {
            row: 5,
            col: 20
          }
        }
      },
      "chart": {
        'data': {
          'headers': [
            'Agent',
            'ID',
            'Groups',
            'Reason'
          ],
          'rows': [
            [
              'agenta@test.com',
              '1244',
              'MultiLingual',
              'In Conversation'
            ], [
              'agentb@test.com',
              '2355',
              'Support A, Tech Support',
              'In Conversation'
            ], [
              'agentc@example.com',
              '64344',
              'Trainee',
              'Wrap-Up'
            ]
          ]
        }
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
          "unit": "mm:ss",
          "size": {
            "width": 3,
            "height": 2
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
        "statistic": "handle-time-duration",
        "statisticLookup": "max",
        "ui": {
          "title": {
            "show": true,
            "text": "Max Wait Time"
          },
          "unit": "mm:ss",
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
            col: 0
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
            "text": "Queue Length"
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
      "id": "00000000-0000-0000-000000000005",
      "type": "table",
      "config": {
        "ui": {
          "size": {
            "width": 10,
            "height": 12
          },
          "position": {
            row: 6,
            col: 0
          }
        }
      },
      "chart": {
        'data': {
          'headers': [
            'ID',
            'Customer',
            'ANI',
            'Flow',
            'Queue',
            'Priority'
          ],
          'rows': [
            [
              '12454333',
              'John Doe',
              '1-555-555-5555',
              'Support',
              'Support Level A',
              '40'
            ], [
              '12454533',
              'Jane Dane',
              '1-555-555-5555',
              'Support',
              'Support Level A',
              '60'
            ], [
              '12454224',
              'Jill Dill',
              '1-555-555-5555',
              'Support',
              'Queue A',
              '60'
            ], [
              '12454775',
              'Jake Drake',
              '1-555-555-5555',
              'Support',
              'Queue B',
              '40'
            ]
          ]
        }
      }
    }, {
      "id": "00000000-0000-0000-000000000006",
      "type": "title",
      "config": {
        "ui": {
          "size": {
            "width": 10,
            "height": 2
          },
          "position": {
            row: 0,
            col: 10
          }
        }
      },
      "chart": {
        "data": "Queue A"
      }

    }, {
      "id": "00000000-0000-0000-000000000007",
      "type": "statistic",
      "config": {
        "statistic": "handle-time-duration",
        "statisticLookup": "avg",
        "ui": {
          "title": {
            "show": true,
            "text": "Avg Wait Time"
          },
          "unit": "mm:ss",
          "size": {
            "width": 3,
            "height": 2
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
        "statistic": "handle-time-duration",
        "statisticLookup": "max",
        "ui": {
          "title": {
            "show": true,
            "text": "Max Wait Time"
          },
          "unit": "mm:ss",
          "size": {
            "width": 3,
            "height": 2
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
            col: 10
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
        "statistic": "queue-duration",
        "statisticLookup": "recordsCount",
        "ui": {
          "title": {
            "show": true,
            "text": "Queue Length"
          },
          "unit": "Customers",
          "size": {
            "width": 3,
            "height": 2
          },
          "position": {
            row: 4,
            col: 13
          }
        }
      },
      "chart": {
        "indicator": {}
      }

    }, {
      "id": "00000000-0000-0000-000000000011",
      "type": "table",
      "config": {
        "ui": {
          "size": {
            "width": 10,
            "height": 5
          },
          "position": {
            row: 6,
            col: 10
          }
        }
      },
      "chart": {
        'data': {
          'headers': [
            'ID',
            'Customer',
            'ANI',
            'Flow',
            'Queue',
            'Priority'
          ],
          'rows': [
            [
              '12454224',
              'Jill Dill',
              '1-555-555-5555',
              'Support',
              'Queue A',
              '60'
            ]
          ]
        }
      }
    }, {
      "id": "00000000-0000-0000-000000000012",
      "type": "title",
      "config": {
        "ui": {
          "size": {
            "width": 10,
            "height": 2
          },
          "position": {
            row: 0,
            col: 20
          }
        }
      },
      "chart": {
        "data": "Queue B"
      }

    }, {
      "id": "00000000-0000-0000-000000000013",
      "type": "statistic",
      "config": {
        "statistic": "handle-time-duration",
        "statisticLookup": "avg",
        "ui": {
          "title": {
            "show": true,
            "text": "Avg Wait Time"
          },
          "unit": "mm:ss",
          "size": {
            "width": 3,
            "height": 2
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
      "id": "00000000-0000-0000-000000000014",
      "type": "statistic",
      "config": {
        "statistic": "handle-time-duration",
        "statisticLookup": "max",
        "ui": {
          "title": {
            "show": true,
            "text": "Max Wait Time"
          },
          "unit": "mm:ss",
          "size": {
            "width": 3,
            "height": 2
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
      "id": "00000000-0000-0000-000000000015",
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
            col: 20
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
        "statistic": "queue-duration",
        "statisticLookup": "recordsCount",
        "ui": {
          "title": {
            "show": true,
            "text": "Queue Length"
          },
          "unit": "Customers",
          "size": {
            "width": 3,
            "height": 2
          },
          "position": {
            row: 4,
            col: 23
          }
        }
      },
      "chart": {
        "indicator": {}
      }

    }, {
      "id": "00000000-0000-0000-000000000017",
      "type": "table",
      "config": {
        "ui": {
          "size": {
            "width": 10,
            "height": 5
          },
          "position": {
            row: 6,
            col: 20
          }
        }
      },
      "chart": {
        'data': {
          'headers': [
            'ID',
            'Customer',
            'ANI',
            'Flow',
            'Queue',
            'Priority'
          ],
          'rows': [
            [
              '12454775',
              'Jake Drake',
              '1-555-555-5555',
              'Support',
              'Queue B',
              '40'
            ]
          ]
        }
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
          "unit": "mm:ss",
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

    }, {
      "id": "00000000-0000-0000-000000000005",
      "type": "table",
      "config": {
        "ui": {
          "size": {
            "width": 20,
            "height": 12
          },
          "position": {
            row: 8,
            col: 0
          }
        }
      },
      "chart": {
        'data': {
          'headers': [
            'Interaction ID',
            'ANI',
            'Flow',
            'Priority',
            'State',
            'Description'
          ],
          'rows': [
            [
              '124543333434',
              '1-555-555-5555',
              'Support',
              '40',
              'In Conversation',
              'Speaking with Agent A'
            ], [
              '124534343434',
              '1-555-555-5555',
              'Support',
              '40',
              'In Queue',
              'Waiting in Support Level A Queue'
            ], [
              '173346894323',
              '1-555-555-5555',
              'Support',
              '40',
              'In Flight',
              'Moving through Support Flow'
            ], [
              '124876266335',
              '1-555-555-5555',
              'Support',
              '60',
              'In Conversation',
              'Speaking with Agent B'
            ]
          ]
        }
      }
    }]
  }]);
