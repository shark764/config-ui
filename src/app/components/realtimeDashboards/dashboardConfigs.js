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
      "id": "source-switcher-1",
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
      "id": "queue-group-1-queue-length",
      "type": "statistic",
      "config": {
        "statistic": "queue-length",
        "statisticLookup": "value",
        "groupName": "queue1",
        "resourceIdName": "queue-id",
        "resourceId": null,
        "ui": {
          "title": {
            "show": true,
            "text": "Current Queue Length"
          },
          "unit": "customers",
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
      "id": "queue-group-1-queue-duration",
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
            "text": "Avg. Queue Wait Time"
          },
          "unit": "",
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
      "id": "queue-group-1-queue-abandons",
      "type": "statistic",
      "config": {
        "statistic": "abandon-queue-instance",
        "statisticLookup": "recordsCount",
        "groupName": "queue1",
        "resourceIdName": "queue-id",
        "resourceId": null,
        "ui": {
          "title": {
            "show": true,
            "text": "Total Abandons"
          },
          "unit": "customers",
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
      "id": "source-switcher-2",
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
      "id": "queue-group-2-queue-length",
      "type": "statistic",
      "config": {
        "statistic": "queue-length",
        "statisticLookup": "value",
        "groupName": "queue2",
        "resourceIdName": "queue-id",
        "resourceId": null,
        "ui": {
          "title": {
            "show": true,
            "text": "Current Queue Length"
          },
          "unit": "customers",
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
      "id": "queue-group-2-queue-duration",
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
            "text": "Avg. Queue Wait Time"
          },
          "unit": "",
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
      "id": "queue-group-2-queue-abandons",
      "type": "statistic",
      "config": {
        "statistic": "abandon-queue-instance",
        "statisticLookup": "recordsCount",
        "groupName": "queue2",
        "resourceIdName": "queue-id",
        "resourceId": null,
        "ui": {
          "title": {
            "show": true,
            "text": "Total Abandons"
          },
          "unit": "customers",
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
      "id": "all-agents-group-title",
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
      "id": "all-agents-group-resources-currently-ready",
      "type": "statistic",
      "config": {
        "statistic": "resources-ready",
        "statisticLookup": "value",
        "ui": {
          "title": {
            "show": true,
            "text": "Agents Currently Ready"
          },
          "unit": "agents",
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
      "id": "all-agents-group-resources-currently-away",
      "type": "statistic",
      "config": {
        "statistic": "resources-away",
        "statisticLookup": "value",
        "ui": {
          "title": {
            "show": true,
            "text": "Agents Currently Away"
          },
          "unit": "agents",
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
      "id": "all-agents-group-resources-currently-busy",
      "type": "statistic",
      "config": {
        "statistic": "resources-busy",
        "statisticLookup": "value",
        "ui": {
          "title": {
            "show": true,
            "text": "Agents Currently Busy"
          },
          "unit": "agents",
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
      "id": "all-agents-group-average-conversation-duration",
      "type": "statistic",
      "config": {
        "statistic": "conversation-duration",
        "statisticLookup": "avg",
        "ui": {
          "title": {
            "show": true,
            "text": "Avg. Conversation Duration"
          },
          "unit": "",
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
      "id": "all-agents-group-average-wrap-up-time",
      "type": "statistic",
      "config": {
        "statistic": "wrap-up-duration",
        "statisticLookup": "avg",
        "ui": {
          "title": {
            "show": true,
            "text": "Avg. Wrap-up Duration"
          },
          "unit": "",
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
      "id": "all-agents-group-agents-hold-count",
      "type": "statistic",
      "config": {
        "statistic": "resource-hold-duration",
        "statisticLookup": "recordsCount",
        "ui": {
          "title": {
            "show": true,
            "text": "Total Holds Triggered"
          },
          "unit": "holds",
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
      "id": "all-interactions-group-title",
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
      "id": "all-interactions-group-total-interactions-in-queues",
      "type": "statistic",
      "config": {
        "statistic": "queue-length",
        "statisticLookup": "value",
        "ui": {
          "title": {
            "show": true,
            "text": "Total in Queue"
          },
          "unit": "customers",
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
      "id": "all-interactions-group-total-interactions-in-conversation",
      "type": "statistic",
      "config": {
        "statistic": "interactions-in-conversation-count",
        "statisticLookup": "recordsCount",
        "ui": {
          "title": {
            "show": true,
            "text": "Interactions in Conversation"
          },
          "unit": "interactions",
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
      "id": "all-interactions-group-total-queue-abandons-for-tenant",
      "type": "statistic",
      "config": {
        "statistic": "abandon-queue-instance",
        "statisticLookup": "recordsCount",
        "ui": {
          "title": {
            "show": true,
            "text": "Queue Abandons"
          },
          "unit": "customers",
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
      "id": "all-interactions-group-avg-interaction-duration",
      "type": "statistic",
      "config": {
        "statistic": "interaction-duration",
        "statisticLookup": "avg",
        "ui": {
          "title": {
            "show": true,
            "text": "Avg. Interaction Time"
          },
          "unit": "",
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
      "id": "all-interactions-group-avg-abandon-time-duration",
      "type": "statistic",
      "config": {
        "statistic": "abandon-time-duration",
        "statisticLookup": "avg",
        "ui": {
          "title": {
            "show": true,
            "text": "Avg. Abandon Time"
          },
          "unit": "",
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
  }]);

  // , {
  //   "id": "resource",
  //   "dashId": "resource",
  //   "name": "Resource Dashboard",
  //   "refreshRate": 30000,
  //   "gridster": {
  //     "columns": 29,
  //     "minRows": 10,
  //     "maxRows": 40,
  //     "margins": [
  //       20,
  //       20
  //     ],
  //     "outerMargin": false,
  //     "draggable": {
  //       "enabled": false
  //     },
  //     "resizable": {
  //       "enabled": false
  //     }
  //   },
  //   "widgets": [{
  //     "id": "00000000-0000-0000-000000000001",
  //     "type": "title",
  //     "config": {
  //       "ui": {
  //         "size": {
  //           "width": 9,
  //           "height": 2
  //         },
  //         "position": {
  //           row: 0,
  //           col: 0
  //         }
  //       }
  //     },
  //     "chart": {
  //       "data": "Ready Resources"
  //     }

  //   }, {
  //     "id": "00000000-0000-0000-000000000002",
  //     "type": "statistic",
  //     "config": {
  //       "statistic": "resource-ready-instance",
  //       "statisticLookup": "recordsCount",
  //       "ui": {
  //         "title": {
  //           "show": true,
  //           "text": "Current"
  //         },
  //         "unit": "Resources",
  //         "size": {
  //           "width": 3,
  //           "height": 3
  //         },
  //         "position": {
  //           row: 2,
  //           col: 0
  //         }
  //       }
  //     },
  //     "chart": {
  //       "indicator": {}
  //     }

  //   }, {
  //     "id": "00000000-0000-0000-000000000003",
  //     "type": "statistic",
  //     "config": {
  //       "statistic": "resource-ready-instance",
  //       "statisticLookup": "recordsCount",
  //       "ui": {
  //         "title": {
  //           "show": true,
  //           "text": "Max Concurrent"
  //         },
  //         "unit": "Resources",
  //         "size": {
  //           "width": 3,
  //           "height": 3
  //         },
  //         "position": {
  //           row: 2,
  //           col: 3
  //         }
  //       }
  //     },
  //     "chart": {
  //       "indicator": {}
  //     }
  //   }, {
  //     "id": "00000000-0000-0000-000000000004",
  //     "type": "statistic",
  //     "config": {
  //       "statistic": "resource-ready-instance",
  //       "statisticLookup": "recordsCount",
  //       "ui": {
  //         "title": {
  //           "show": true,
  //           "text": "Min Concurrent"
  //         },
  //         "unit": "Resources",
  //         "size": {
  //           "width": 3,
  //           "height": 3
  //         },
  //         "position": {
  //           row: 2,
  //           col: 6
  //         }
  //       }
  //     },
  //     "chart": {
  //       "indicator": {}
  //     }

  //   }, {
  //     "id": "00000000-0000-0000-000000000006",
  //     "type": "title",
  //     "config": {
  //       "ui": {
  //         "size": {
  //           "width": 9,
  //           "height": 2
  //         },
  //         "position": {
  //           row: 0,
  //           col: 10
  //         }
  //       }
  //     },
  //     "chart": {
  //       "data": "Not Ready Resources"
  //     }

  //   }, {
  //     "id": "00000000-0000-0000-000000000007",
  //     "type": "statistic",
  //     "config": {
  //       "statistic": "resource-away-instance",
  //       "statisticLookup": "recordsCount",
  //       "ui": {
  //         "title": {
  //           "show": true,
  //           "text": "Concurrent"
  //         },
  //         "unit": "Resources",
  //         "size": {
  //           "width": 3,
  //           "height": 3
  //         },
  //         "position": {
  //           row: 2,
  //           col: 10
  //         }
  //       }
  //     },
  //     "chart": {
  //       "indicator": {}
  //     }
  //   }, {
  //     "id": "00000000-0000-0000-000000000008",
  //     "type": "statistic",
  //     "config": {
  //       "statistic": "resource-away-instance",
  //       "statisticLookup": "recordsCount",
  //       "ui": {
  //         "title": {
  //           "show": true,
  //           "text": "Max Concurrent"
  //         },
  //         "unit": "Resources",
  //         "size": {
  //           "width": 3,
  //           "height": 3
  //         },
  //         "position": {
  //           row: 2,
  //           col: 13
  //         }
  //       }
  //     },
  //     "chart": {
  //       "indicator": {}
  //     }

  //   }, {
  //     "id": "00000000-0000-0000-000000000009",
  //     "type": "statistic",
  //     "config": {
  //       "statistic": "resource-away-instance",
  //       "statisticLookup": "recordsCount",
  //       "ui": {
  //         "title": {
  //           "show": true,
  //           "text": "Min Concurrent"
  //         },
  //         "unit": "Resources",
  //         "size": {
  //           "width": 3,
  //           "height": 3
  //         },
  //         "position": {
  //           row: 2,
  //           col: 16
  //         }
  //       }
  //     },
  //     "chart": {
  //       "indicator": {}
  //     }

  //   }, {
  //     "id": "00000000-0000-0000-000000000011",
  //     "type": "title",
  //     "config": {
  //       "ui": {
  //         "size": {
  //           "width": 9,
  //           "height": 2
  //         },
  //         "position": {
  //           row: 0,
  //           col: 20
  //         }
  //       }
  //     },
  //     "chart": {
  //       "data": "Busy Resources"
  //     }

  //   }, {
  //     "id": "00000000-0000-0000-000000000012",
  //     "type": "statistic",
  //     "config": {
  //       "statistic": "resource-busy-duration",
  //       "statisticLookup": "recordsCount",
  //       "ui": {
  //         "title": {
  //           "show": true,
  //           "text": "Concurrent"
  //         },
  //         "unit": "Resources",
  //         "size": {
  //           "width": 3,
  //           "height": 3
  //         },
  //         "position": {
  //           row: 2,
  //           col: 20
  //         }
  //       }
  //     },
  //     "chart": {
  //       "indicator": {}
  //     }
  //   }, {
  //     "id": "00000000-0000-0000-000000000013",
  //     "type": "statistic",
  //     "config": {
  //       "statistic": "resource-busy-duration",
  //       "statisticLookup": "recordsCount",
  //       "ui": {
  //         "title": {
  //           "show": true,
  //           "text": "Max Concurrent"
  //         },
  //         "unit": "Resources",
  //         "size": {
  //           "width": 3,
  //           "height": 3
  //         },
  //         "position": {
  //           row: 2,
  //           col: 23
  //         }
  //       }
  //     },
  //     "chart": {
  //       "indicator": {}
  //     }

  //   }, {
  //     "id": "00000000-0000-0000-000000000014",
  //     "type": "statistic",
  //     "config": {
  //       "statistic": "resource-busy-duration",
  //       "statisticLookup": "recordsCount",
  //       "ui": {
  //         "title": {
  //           "show": true,
  //           "text": "Min Concurrent"
  //         },
  //         "unit": "Resources",
  //         "size": {
  //           "width": 3,
  //           "height": 3
  //         },
  //         "position": {
  //           row: 2,
  //           col: 26
  //         }
  //       }
  //     },
  //     "chart": {
  //       "indicator": {}
  //     }

  //   }]
  // }, {
  //   "id": "queues",
  //   "dashId": "queues",
  //   "name": "Queue Dashboard",
  //   "refreshRate": 30000,
  //   "gridster": {
  //     "columns": 30,
  //     "minRows": 10,
  //     "maxRows": 40,
  //     "margins": [
  //       20,
  //       20
  //     ],
  //     "outerMargin": false,
  //     "draggable": {
  //       "enabled": false
  //     },
  //     "resizable": {
  //       "enabled": false
  //     }
  //   },
  //   "widgets": [{
  //     "id": "00000000-0000-0000-000000000001",
  //     "type": "title",
  //     "config": {
  //       "ui": {
  //         "size": {
  //           "width": 10,
  //           "height": 2
  //         },
  //         "position": {
  //           row: 0,
  //           col: 0
  //         }
  //       }
  //     },
  //     "chart": {
  //       "data": "All Queues"
  //     }

  //   }, {
  //     "id": "00000000-0000-0000-000000000090",
  //     "type": "gauge",
  //     "config": {
  //       "statistic": "calls-answered-percent",
  //       "statisticLookup": "calls-answered",
  //       "ui": {
  //         "title": {
  //           "show": true,
  //           "text": "Answered < 20s"
  //         },
  //         "unit": "Answered < 20s",
  //         "size": {
  //           "width": 3,
  //           "height": 4
  //         },
  //         "position": {
  //           "row": 2,
  //           "col": 0
  //         }
  //       }
  //     },
  //     "chart": {
  //       "data": {
  //         "type": "gauge",
  //         "columns": [["Name of graph",12]]
  //       }
  //     }

  //   }, {
  //     "id": "00000000-0000-0000-000000000002",
  //     "type": "statistic",
  //     "config": {
  //       "statistic": "handle-time-duration",
  //       "statisticLookup": "avg",
  //       "ui": {
  //         "title": {
  //           "show": true,
  //           "text": "Avg Wait Time"
  //         },
  //         "unit": "",
  //         "size": {
  //           "width": 3,
  //           "height": 2
  //         },
  //         "position": {
  //           row: 2,
  //           col: 3
  //         }
  //       }
  //     },
  //     "chart": {
  //       "indicator": {}
  //     }

  //   }, {
  //     "id": "00000000-0000-0000-000000000003",
  //     "type": "statistic",
  //     "config": {
  //       "statistic": "handle-time-duration",
  //       "statisticLookup": "max",
  //       "ui": {
  //         "title": {
  //           "show": true,
  //           "text": "Max Wait Time"
  //         },
  //         "unit": "",
  //         "size": {
  //           "width": 3,
  //           "height": 2
  //         },
  //         "position": {
  //           row: 2,
  //           col: 6
  //         }
  //       }
  //     },
  //     "chart": {
  //       "indicator": {}
  //     }
  //   }, {
  //     "id": "00000000-0000-0000-000000000004",
  //     "type": "statistic",
  //     "config": {
  //       "statistic": "interaction-abandon-instance",
  //       "statisticLookup": "recordsCount",
  //       "ui": {
  //         "title": {
  //           "show": true,
  //           "text": "Abandons"
  //         },
  //         "unit": "customers",
  //         "size": {
  //           "width": 3,
  //           "height": 2
  //         },
  //         "position": {
  //           row: 4,
  //           col: 3
  //         }
  //       }
  //     },
  //     "chart": {
  //       "indicator": {}
  //     }

  //   }, {
  //     "id": "00000000-0000-0000-000000000030",
  //     "type": "statistic",
  //     "config": {
  //       "statistic": "queue-length",
  //       "statisticLookup": "recordsCount",
  //       "ui": {
  //         "title": {
  //           "show": true,
  //           "text": "Queue Length"
  //         },
  //         "size": {
  //           "width": 3,
  //           "height": 2
  //         },
  //         "position": {
  //           row: 4,
  //           col: 6
  //         }
  //       }
  //     },
  //     "chart": {
  //       "indicator": {}
  //     }

  //   }, {
  //     "id": "00000000-0000-0000-000000000066",
  //     "type": "sourceSwitcher",
  //     "config": {
  //       "groupName": "queue1",
  //       "sourceType": "queue",
  //       "items": [],
  //       "ui": {
  //         "title": {
  //           "show": true,
  //           "text": "Queue:"
  //         },
  //         "size": {
  //           "width": 10,
  //           "height": 2
  //         },
  //         "position": {
  //           "row": 0,
  //           "col": 10
  //         }
  //       }
  //     }
  //   }, {
  //     "id": "00000000-0000-0000-000000000091",
  //     "type": "gauge",
  //     "config": {
  //       "statistic": "calls-answered-percent",
  //       "statisticLookup": "calls-answered",
  //       "groupName": "queue1",
  //       "resourceIdName": "queue-id",
  //       "resourceId": null,
  //       "ui": {
  //         "title": {
  //           "show": true,
  //           "text": "Answered < 20s"
  //         },
  //         "unit": "Answered < 20s",
  //         "size": {
  //           "width": 3,
  //           "height": 4
  //         },
  //         "position": {
  //           "row": 3,
  //           "col": 10
  //         }
  //       }
  //     },
  //     "chart": {
  //       "data": {
  //         "type": "gauge",
  //         "columns": [["Name of graph",20]]
  //       }
  //     }

  //   }, {
  //     "id": "00000000-0000-0000-000000000007",
  //     "type": "statistic",
  //     "config": {
  //       "statistic": "handle-time-duration",
  //       "statisticLookup": "avg",
  //       "groupName": "queue1",
  //       "resourceIdName": "queue-id",
  //       "resourceId": null,
  //       "ui": {
  //         "title": {
  //           "show": true,
  //           "text": "Avg Wait Time"
  //         },
  //         "unit": "",
  //         "size": {
  //           "width": 3,
  //           "height": 2
  //         },
  //         "position": {
  //           row: 3,
  //           col: 13
  //         }
  //       }
  //     },
  //     "chart": {
  //       "indicator": {}
  //     }

  //   }, {
  //     "id": "00000000-0000-0000-000000000008",
  //     "type": "statistic",
  //     "config": {
  //       "statistic": "handle-time-duration",
  //       "statisticLookup": "max",
  //       "groupName": "queue1",
  //       "resourceIdName": "queue-id",
  //       "resourceId": null,
  //       "ui": {
  //         "title": {
  //           "show": true,
  //           "text": "Max Wait Time"
  //         },
  //         "unit": "",
  //         "size": {
  //           "width": 3,
  //           "height": 2
  //         },
  //         "position": {
  //           row: 3,
  //           col: 16
  //         }
  //       }
  //     },
  //     "chart": {
  //       "indicator": {}
  //     }
  //   }, {
  //     "id": "00000000-0000-0000-000000000009",
  //     "type": "statistic",
  //     "config": {
  //       "statistic": "interaction-abandon-instance",
  //       "statisticLookup": "recordsCount",
  //       "groupName": "queue1",
  //       "resourceIdName": "queue-id",
  //       "resourceId": null,
  //       "ui": {
  //         "title": {
  //           "show": true,
  //           "text": "Abandons"
  //         },
  //         "unit": "customers",
  //         "size": {
  //           "width": 3,
  //           "height": 2
  //         },
  //         "position": {
  //           row: 5,
  //           col: 13
  //         }
  //       }
  //     },
  //     "chart": {
  //       "indicator": {}
  //     }

  //   }, {
  //     "id": "00000000-0000-0000-000000000010",
  //     "type": "statistic",
  //     "config": {
  //       "statistic": "queue-length",
  //       "statisticLookup": "recordsCount",
  //       "groupName": "queue1",
  //       "resourceIdName": "queue-id",
  //       "resourceId": null,
  //       "ui": {
  //         "title": {
  //           "show": true,
  //           "text": "Queue Length"
  //         },
  //         "size": {
  //           "width": 3,
  //           "height": 2
  //         },
  //         "position": {
  //           row: 5,
  //           col: 16
  //         }
  //       }
  //     },
  //     "chart": {
  //       "indicator": {}
  //     }

  //   }, {
  //     "id": "00000000-0000-0000-000000000066",
  //     "type": "sourceSwitcher",
  //     "config": {
  //       "groupName": "queue2",
  //       "sourceType": "queue",
  //       "items": [],
  //       "ui": {
  //         "title": {
  //           "show": true,
  //           "text": "Queue:"
  //         },
  //         "size": {
  //           "width": 10,
  //           "height": 2
  //         },
  //         "position": {
  //           "row": 0,
  //           "col": 20
  //         }
  //       }
  //     }
  //   },{
  //     "id": "00000000-0000-0000-000000000092",
  //     "type": "gauge",
  //     "config": {
  //       "statistic": "calls-answered-percent",
  //       "statisticLookup": "calls-answered",
  //       "groupName": "queue2",
  //       "resourceIdName": "queue-id",
  //       "resourceId": null,
  //       "ui": {
  //         "title": {
  //           "show": true,
  //           "text": "Answered < 20s"
  //         },
  //         "unit": "Answered < 20s",
  //         "size": {
  //           "width": 3,
  //           "height": 4
  //         },
  //         "position": {
  //           "row": 3,
  //           "col": 20
  //         }
  //       }
  //     },
  //     "chart": {
  //       "data": {
  //         "columns": [["Name of graph",12]]
  //       }
  //     }

  //   }, {
  //     "id": "00000000-0000-0000-000000000013",
  //     "type": "statistic",
  //     "config": {
  //       "statistic": "handle-time-duration",
  //       "statisticLookup": "avg",
  //       "groupName": "queue2",
  //       "resourceIdName": "queue-id",
  //       "resourceId": null,
  //       "ui": {
  //         "title": {
  //           "show": true,
  //           "text": "Avg Wait Time"
  //         },
  //         "unit": "",
  //         "size": {
  //           "width": 3,
  //           "height": 2
  //         },
  //         "position": {
  //           row: 3,
  //           col: 23
  //         }
  //       }
  //     },
  //     "chart": {
  //       "indicator": {}
  //     }

  //   }, {
  //     "id": "00000000-0000-0000-000000000014",
  //     "type": "statistic",
  //     "config": {
  //       "statistic": "handle-time-duration",
  //       "statisticLookup": "max",
  //       "groupName": "queue2",
  //       "resourceIdName": "queue-id",
  //       "resourceId": null,
  //       "ui": {
  //         "title": {
  //           "show": true,
  //           "text": "Max Wait Time"
  //         },
  //         "unit": "",
  //         "size": {
  //           "width": 3,
  //           "height": 2
  //         },
  //         "position": {
  //           row: 3,
  //           col: 26
  //         }
  //       }
  //     },
  //     "chart": {
  //       "indicator": {}
  //     }
  //   }, {
  //     "id": "00000000-0000-0000-000000000015",
  //     "type": "statistic",
  //     "config": {
  //       "statistic": "interaction-abandon-instance",
  //       "statisticLookup": "recordsCount",
  //       "groupName": "queue2",
  //       "resourceIdName": "queue-id",
  //       "resourceId": null,
  //       "ui": {
  //         "title": {
  //           "show": true,
  //           "text": "Abandons"
  //         },
  //         "unit": "customers",
  //         "size": {
  //           "width": 3,
  //           "height": 2
  //         },
  //         "position": {
  //           row: 5,
  //           col: 23
  //         }
  //       }
  //     },
  //     "chart": {
  //       "indicator": {}
  //     }

  //   }, {
  //     "id": "00000000-0000-0000-000000000016",
  //     "type": "statistic",
  //     "config": {
  //       "statistic": "queue-length",
  //       "statisticLookup": "recordsCount",
  //       "groupName": "queue2",
  //       "resourceIdName": "queue-id",
  //       "resourceId": null,
  //       "ui": {
  //         "title": {
  //           "show": true,
  //           "text": "Queue Length"
  //         },
  //         "size": {
  //           "width": 3,
  //           "height": 2
  //         },
  //         "position": {
  //           row: 5,
  //           col: 26
  //         }
  //       }
  //     },
  //     "chart": {
  //       "indicator": {}
  //     }

  //   }]
  // }, {
  //   "id": "interactions",
  //   "dashId": "interactions",
  //   "name": "Interactions Dashboard",
  //   "refreshRate": 30000,
  //   "gridster": {
  //     "columns": 20,
  //     "minRows": 10,
  //     "maxRows": 40,
  //     "margins": [
  //       20,
  //       20
  //     ],
  //     "outerMargin": false,
  //     "draggable": {
  //       "enabled": false
  //     },
  //     "resizable": {
  //       "enabled": false
  //     }
  //   },
  //   "widgets": [{
  //     "id": "00000000-0000-0000-000000000001",
  //     "type": "title",
  //     "config": {
  //       "ui": {
  //         "size": {
  //           "width": 20,
  //           "height": 1
  //         },
  //         "position": {
  //           row: 0,
  //           col: 0
  //         }
  //       }
  //     },
  //     "chart": {
  //       "data": "All Interactions"
  //     }

  //   }, {
  //     "id": "00000000-0000-0000-000000000002",
  //     "type": "statistic",
  //     "config": {
  //       "statistic": "interaction-duration",
  //       "statisticLookup": "recordsCount",
  //       "ui": {
  //         "title": {
  //           "show": true,
  //           "text": "Total Active"
  //         },
  //         "unit": "interactions",
  //         "size": {
  //           "width": 4,
  //           "height": 4
  //         },
  //         "position": {
  //           row: 2,
  //           col: 0
  //         }
  //       }
  //     },
  //     "chart": {
  //       "indicator": {}
  //     }

  //   }, {
  //     "id": "00000000-0000-0000-000000000003",
  //     "type": "statistic",
  //     "config": {
  //       "statistic": "conversation-duration",
  //       "statisticLookup": "recordsCount",
  //       "ui": {
  //         "title": {
  //           "show": true,
  //           "text": "In Conversation"
  //         },
  //         "unit": "interactions",
  //         "size": {
  //           "width": 4,
  //           "height": 4
  //         },
  //         "position": {
  //           row: 2,
  //           col: 4
  //         }
  //       }
  //     },
  //     "chart": {
  //       "indicator": {}
  //     }
  //   }, {
  //     "id": "00000000-0000-0000-000000000004",
  //     "type": "statistic",
  //     "config": {
  //       "statistic": "interaction-duration",
  //       "statisticLookup": "recordsCount",
  //       "ui": {
  //         "title": {
  //           "show": true,
  //           "text": "Total Today"
  //         },
  //         "unit": "interactions",
  //         "size": {
  //           "width": 4,
  //           "height": 2
  //         },
  //         "position": {
  //           row: 2,
  //           col: 8
  //         }
  //       }
  //     },
  //     "chart": {
  //       "indicator": {}
  //     }

  //   }, {
  //     "id": "00000000-0000-0000-000000000030",
  //     "type": "statistic",
  //     "config": {
  //       "statistic": "queue-duration",
  //       "statisticLookup": "recordsCount",
  //       "ui": {
  //         "title": {
  //           "show": true,
  //           "text": "In Queue"
  //         },
  //         "unit": "interactions",
  //         "size": {
  //           "width": 4,
  //           "height": 2
  //         },
  //         "position": {
  //           row: 6,
  //           col: 8
  //         }
  //       }
  //     },
  //     "chart": {
  //       "indicator": {}
  //     }

  //   }, {
  //     "id": "00000000-0000-0000-000000000006",
  //     "type": "statistic",
  //     "config": {
  //       "statistic": "interaction-duration",
  //       "statisticLookup": "avg",
  //       "ui": {
  //         "title": {
  //           "show": true,
  //           "text": "Avg. Interaction Duration"
  //         },
  //         "unit": "",
  //         "size": {
  //           "width": 4,
  //           "height": 2
  //         },
  //         "position": {
  //           row: 2,
  //           col: 12
  //         }
  //       }
  //     },
  //     "chart": {
  //       "indicator": {}
  //     }

  //   }, {
  //     "id": "00000000-0000-0000-000000000007",
  //     "type": "statistic",
  //     "config": {
  //       "statistic": "interaction-abandon-instance",
  //       "statisticLookup": "recordsCount",
  //       "ui": {
  //         "title": {
  //           "show": true,
  //           "text": "Abandons"
  //         },
  //         "unit": "interactions",
  //         "size": {
  //           "width": 4,
  //           "height": 2
  //         },
  //         "position": {
  //           row: 6,
  //           col: 12
  //         }
  //       }
  //     },
  //     "chart": {
  //       "indicator": {}
  //     }

  //   }, {
  //     "id": "00000000-0000-0000-000000000008",
  //     "type": "statistic",
  //     "config": {
  //       "statistic": "interaction-transfer-instance",
  //       "statisticLookup": "recordsCount",
  //       "ui": {
  //         "title": {
  //           "show": true,
  //           "text": "Transfers"
  //         },
  //         "unit": "interactions",
  //         "size": {
  //           "width": 4,
  //           "height": 2
  //         },
  //         "position": {
  //           row: 2,
  //           col: 16
  //         }
  //       }
  //     },
  //     "chart": {
  //       "indicator": {}
  //     }

  //   }, {
  //     "id": "00000000-0000-0000-000000000009",
  //     "type": "statistic",
  //     "config": {
  //       "statistic": "interaction-abandon-instance",
  //       "statisticLookup": "recordsCount",
  //       "ui": {
  //         "title": {
  //           "show": true,
  //           "text": "IVR Abandons"
  //         },
  //         "unit": "interactions",
  //         "size": {
  //           "width": 4,
  //           "height": 2
  //         },
  //         "position": {
  //           row: 6,
  //           col: 16
  //         }
  //       }
  //     },
  //     "chart": {
  //       "indicator": {}
  //     }

  //   }]
  // }

