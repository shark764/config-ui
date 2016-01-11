/*jshint quotmark: false */
angular.module("liveopsConfigPanel")
.value("realtimeDashboards", [

{
    "id":"overview",
    "dashId":"overview",
    "name":"Overview Dashboard",
    "refreshRate":15000,
    "gridster":{
        "columns":60,
        "minRows":10,
        "maxRows":40,
        "margins":[
            20,
            20
        ],
        "outerMargin":false,
        "draggable":{
            "enabled":false
        },
        "resizable":{
            "enabled":false
        }
    },
    "widgets":[
        {
            "id":"source-switcher-1",
            "type":"sourceSwitcher",
            "config":{
                "groupName":"queue1",
                "sourceType":"queue",
                "items":[

                ],
                "ui":{
                    "title":{
                        "show":true,
                        "text":"Queue:"
                    },
                    "size":{
                        "width":11,
                        "height":3
                    },
                    "position":{
                        "row":0,
                        "col":2
                    }
                }
            }
        },
        {
            "id":"queue-group-1-queue-length",
            "type":"statistic",
            "config":{
                "statistic":"queue-length",
                "statisticLookup":"recordsCount",
                "additionalParams":['gaugeStart','gaugeEnd'],
                "groupName":"queue1",
                "resourceIdName":"queue-id",
                "resourceId":null,
                "ui":{
                    "title":{
                        "show":true,
                        "text":"Current Queue Length"
                    },
                    "unit":"customers",
                    "size":{
                        "width":5,
                        "height":5
                    },
                    "position":{
                        "row":3,
                        "col":2
                    }
                }
            },
            "chart":{
                "indicator":{

                }
            }
        },
        {
            "id":"queue-group-1-queue-duration",
            "type":"statistic",
            "config":{
                "statistic":"queue-duration",
                "statisticLookup":"avg",
                "additionalParams":['gaugeStart','gaugeEnd'],
                "groupName":"queue1",
                "resourceIdName":"queue-id",
                "resourceId":null,
                "ui":{
                    "title":{
                        "show":true,
                        "text":"Avg. Queue Wait Time"
                    },
                    "unit":"",
                    "size":{
                        "width":5,
                        "height":5
                    },
                    "position":{
                        "row":3,
                        "col":8
                    }
                }
            },
            "chart":{
                "indicator":{

                }
            }
        },
        {
            "id":"queue-group-1-queue-abandons",
            "type":"statistic",
            "config":{
                "statistic":"abandon-queue-instance",
                "statisticLookup":"recordsCount",
                "additionalParams":['gaugeStart','gaugeEnd'],
                "groupName":"queue1",
                "resourceIdName":"queue-id",
                "resourceId":null,
                "ui":{
                    "title":{
                        "show":true,
                        "text":"Total Abandons"
                    },
                    "unit":"customers",
                    "size":{
                        "width":5,
                        "height":5
                    },
                    "position":{
                        "row":9,
                        "col":5
                    }
                }
            },
            "chart":{
                "indicator":{

                }
            }
        },
        {
            "id":"source-switcher-2",
            "type":"sourceSwitcher",
            "config":{
                "groupName":"queue2",
                "sourceType":"queue",
                "items":[

                ],
                "ui":{
                    "title":{
                        "show":true,
                        "text":"Queue:"
                    },
                    "size":{
                        "width":11,
                        "height":3
                    },
                    "position":{
                        "row":0,
                        "col":15
                    }
                }
            }
        },
        {
            "id":"queue-group-2-queue-length",
            "type":"statistic",
            "config":{
                "statistic":"queue-length",
                "statisticLookup":"recordsCount",
                "additionalParams":['gaugeStart','gaugeEnd'],
                "groupName":"queue2",
                "resourceIdName":"queue-id",
                "resourceId":null,
                "ui":{
                    "title":{
                        "show":true,
                        "text":"Current Queue Length"
                    },
                    "unit":"customers",
                    "size":{
                        "width":5,
                        "height":5
                    },
                    "position":{
                        "row":3,
                        "col":15
                    }
                }
            },
            "chart":{
                "indicator":{

                }
            }
        },
        {
            "id":"queue-group-2-queue-duration",
            "type":"statistic",
            "config":{
                "statistic":"queue-duration",
                "statisticLookup":"avg",
                "additionalParams":['gaugeStart','gaugeEnd'],
                "groupName":"queue2",
                "resourceIdName":"queue-id",
                "resourceId":null,
                "ui":{
                    "title":{
                        "show":true,
                        "text":"Avg. Queue Wait Time"
                    },
                    "unit":"",
                    "size":{
                        "width":5,
                        "height":5
                    },
                    "position":{
                        "row":3,
                        "col":21
                    }
                }
            },
            "chart":{
                "indicator":{

                }
            }
        },
        {
            "id":"queue-group-2-queue-abandons",
            "type":"statistic",
            "config":{
                "statistic":"abandon-queue-instance",
                "statisticLookup":"recordsCount",
                "additionalParams":['gaugeStart','gaugeEnd'],
                "groupName":"queue2",
                "resourceIdName":"queue-id",
                "resourceId":null,
                "ui":{
                    "title":{
                        "show":true,
                        "text":"Total Abandons"
                    },
                    "unit":"customers",
                    "size":{
                        "width":5,
                        "height":5
                    },
                    "position":{
                        "row":9,
                        "col":18
                    }
                }
            },
            "chart":{
                "indicator":{

                }
            }
        },
        {
            "id":"all-agents-group-title",
            "type":"title",
            "config":{
                "ui":{
                    "size":{
                        "width":15,
                        "height":3
                    },
                    "position":{
                        "row":0,
                        "col":27
                    }
                }
            },
            "chart":{
                "data":"All Agents"
            }
        },
        {
            "id":"all-agents-group-resources-currently-ready",
            "type":"statistic",
            "config":{
                "statistic":"resources-ready",
                "statisticLookup":"value",
                "additionalParams":['gaugeStart','gaugeEnd'],
                "ui":{
                    "title":{
                        "show":true,
                        "text":"Agents Currently Ready"
                    },
                    "unit":"agents",
                    "size":{
                        "width":5,
                        "height":5
                    },
                    "position":{
                        "row":3,
                        "col":27
                    }
                }
            },
            "chart":{
                "indicator":{

                }
            }
        },
        {
            "id":"all-agents-group-resources-currently-away",
            "type":"statistic",
            "config":{
                "statistic":"resources-away",
                "statisticLookup":"value",
                "additionalParams":['gaugeStart','gaugeEnd'],
                "ui":{
                    "title":{
                        "show":true,
                        "text":"Agents Currently Away"
                    },
                    "unit":"agents",
                    "size":{
                        "width":5,
                        "height":5
                    },
                    "position":{
                        "row":3,
                        "col":32
                    }
                }
            },
            "chart":{
                "indicator":{

                }
            }
        },
        {
            "id":"all-agents-group-resources-currently-busy",
            "type":"statistic",
            "config":{
                "statistic":"resources-busy",
                "statisticLookup":"value",
                "additionalParams":['gaugeStart','gaugeEnd'],
                "ui":{
                    "title":{
                        "show":true,
                        "text":"Agents Currently Busy"
                    },
                    "unit":"agents",
                    "size":{
                        "width":5,
                        "height":5
                    },
                    "position":{
                        "row":3,
                        "col":37
                    }
                }
            },
            "chart":{
                "indicator":{

                }
            }
        },
        {
            "id":"all-agents-group-average-conversation-duration",
            "type":"statistic",
            "config":{
                "statistic":"conversation-duration",
                "statisticLookup":"avg",
                "additionalParams":['gaugeStart','gaugeEnd'],
                "ui":{
                    "title":{
                        "show":true,
                        "text":"Avg. Conversation Duration"
                    },
                    "unit":"",
                    "size":{
                        "width":5,
                        "height":5
                    },
                    "position":{
                        "row":9,
                        "col":27
                    }
                }
            },
            "chart":{
                "indicator":{

                }
            }
        },
        {
            "id":"all-agents-group-time-to-answer",
            "type":"statistic",
            "config":{
                "statistic":"time-to-answer-duration",
                "statisticLookup":"avg",
                "additionalParams":['gaugeStart','gaugeEnd'],
                "ui":{
                    "title":{
                        "show":true,
                        "text":"Avg. Time To Answer"
                    },
                    "unit":"",
                    "size":{
                        "width":5,
                        "height":5
                    },
                    "position":{
                        "row":9,
                        "col":32
                    }
                }
            },
            "chart":{
                "indicator":{

                }
            }
        },
        {
            "id":"all-agents-group-agents-hold-count",
            "type":"statistic",
            "config":{
                "statistic":"resource-hold-duration",
                "statisticLookup":"recordsCount",
                "additionalParams":['gaugeStart','gaugeEnd'],
                "ui":{
                    "title":{
                        "show":true,
                        "text":"Total Holds Triggered"
                    },
                    "unit":"holds",
                    "size":{
                        "width":5,
                        "height":5
                    },
                    "position":{
                        "row":9,
                        "col":37
                    }
                }
            },
            "chart":{
                "indicator":{

                }
            }
        },
        {
            "id":"all-interactions-group-title",
            "type":"title",
            "config":{
                "ui":{
                    "size":{
                        "width":15,
                        "height":3
                    },
                    "position":{
                        "row":0,
                        "col":43
                    }
                }
            },
            "chart":{
                "data":"All Interactions"
            }
        },
        {
            "id":"all-interactions-group-total-interactions-in-queues",
            "type":"statistic",
            "config":{
                "statistic":"queue-length",
                "statisticLookup":"recordsCount",
                "additionalParams":['gaugeStart','gaugeEnd'],
                "ui":{
                    "title":{
                        "show":true,
                        "text":"Total in Queue"
                    },
                    "unit":"customers",
                    "size":{
                        "width":5,
                        "height":5
                    },
                    "position":{
                        "row":3,
                        "col":43
                    }
                }
            },
            "chart":{
                "indicator":{

                }
            }
        },
        {
            "id":"all-interactions-group-total-interactions-in-conversation",
            "type":"statistic",
            "config":{
                "statistic":"interactions-in-conversation-count",
                "statisticLookup":"recordsCount",
                "additionalParams":['gaugeStart','gaugeEnd'],
                "ui":{
                    "title":{
                        "show":true,
                        "text":"Interactions in Conversation"
                    },
                    "unit":"interactions",
                    "size":{
                        "width":5,
                        "height":5
                    },
                    "position":{
                        "row":3,
                        "col":48
                    }
                }
            },
            "chart":{
                "indicator":{

                }
            }
        },
        {
            "id":"all-interactions-group-total-queue-abandons-for-tenant",
            "type":"statistic",
            "config":{
                "statistic":"abandon-queue-instance",
                "statisticLookup":"recordsCount",
                "additionalParams":['gaugeStart','gaugeEnd'],
                "ui":{
                    "title":{
                        "show":true,
                        "text":"Queue Abandons"
                    },
                    "unit":"customers",
                    "size":{
                        "width":5,
                        "height":5
                    },
                    "position":{
                        "row":3,
                        "col":53
                    }
                }
            },
            "chart":{
                "indicator":{

                }
            }
        },
        {
            "id":"all-interactions-group-avg-interaction-duration",
            "type":"statistic",
            "config":{
                "statistic":"interaction-duration",
                "statisticLookup":"avg",
                "additionalParams":['gaugeStart','gaugeEnd'],
                "ui":{
                    "title":{
                        "show":true,
                        "text":"Avg. Interaction Time"
                    },
                    "unit":"",
                    "size":{
                        "width":5,
                        "height":5
                    },
                    "position":{
                        "row":9,
                        "col":45
                    }
                }
            },
            "chart":{
                "indicator":{

                }
            }
        },
        {
            "id":"all-interactions-group-avg-abandon-time-duration",
            "type":"statistic",
            "config":{
                "statistic":"abandon-time-duration",
                "statisticLookup":"avg",
                "additionalParams":['gaugeStart','gaugeEnd'],
                "ui":{
                    "title":{
                        "show":true,
                        "text":"Avg. Abandon Time"
                    },
                    "unit":"",
                    "size":{
                        "width":5,
                        "height":5
                    },
                    "position":{
                        "row":9,
                        "col":50
                    }
                }
            },
            "chart":{
                "indicator":{

                }
            }
        }]
},
{
    "id":"resource",
    "dashId":"resource",
    "name":"Resource Dashboard",
    "refreshRate":15000,
    "gridster":{
        "columns":60,
        "minRows":10,
        "maxRows":40,
        "margins":[
            20,
            20
        ],
        "outerMargin":false,
        "draggable":{
            "enabled":false
        },
        "resizable":{
            "enabled":false
        }
    },
    "widgets":[
        {
            "id":"ready-resources-title",
            "type":"title",
            "config":{
                "ui":{
                    "size":{
                        "width":15,
                        "height":2
                    },
                    "position":{
                        "row":0,
                        "col":6
                    }
                }
            },
            "chart":{
                "data":"Ready Resources"
            }
        },
        {
            "id":"ready-resources-current",
            "type":"statistic",
            "config":{
                "statistic":"resources-ready",
                "statisticLookup":"value",
                "additionalParams":[],
                "ui":{
                    "title":{
                        "show":true,
                        "text":"Current"
                    },
                    "unit":"Resources",
                    "size":{
                        "width":5,
                        "height":5
                    },
                    "position":{
                        "row":3,
                        "col":6
                    }
                }
            },
            "chart":{
                "indicator":{

                }
            }
        },
        {
            "id":"ready-resources-max",
            "type":"statistic",
            "config":{
                "statistic":"resources-ready",
                "statisticLookup":"max",
                "additionalParams":['gaugeStart','gaugeEnd'],
                "ui":{
                    "title":{
                        "show":true,
                        "text":"Max Concurrent"
                    },
                    "unit":"Resources",
                    "size":{
                        "width":5,
                        "height":5
                    },
                    "position":{
                        "row":3,
                        "col":11
                    }
                }
            },
            "chart":{
                "indicator":{

                }
            }
        },
        {
            "id":"ready-resources-min",
            "type":"statistic",
            "config":{
                "statistic":"resources-ready",
                "statisticLookup":"min",
                "additionalParams":['gaugeStart','gaugeEnd'],
                "ui":{
                    "title":{
                        "show":true,
                        "text":"Min Concurrent"
                    },
                    "unit":"Resources",
                    "size":{
                        "width":5,
                        "height":5
                    },
                    "position":{
                        "row":3,
                        "col":16
                    }
                }
            },
            "chart":{
                "indicator":{

                }
            }
        },
        {
            "id":"resources-not-ready-title",
            "type":"title",
            "config":{
                "ui":{
                    "size":{
                        "width":15,
                        "height":2
                    },
                    "position":{
                        "row":0,
                        "col":23
                    }
                }
            },
            "chart":{
                "data":"Not Ready Resources"
            }
        },
        {
            "id":"resources-not-ready-current",
            "type":"statistic",
            "config":{
                "statistic":"resources-away",
                "statisticLookup":"value",
                "additionalParams":[],
                "ui":{
                    "title":{
                        "show":true,
                        "text":"Concurrent"
                    },
                    "unit":"Resources",
                    "size":{
                        "width":5,
                        "height":5
                    },
                    "position":{
                        "row":3,
                        "col":23
                    }
                }
            },
            "chart":{
                "indicator":{

                }
            }
        },
        {
            "id":"resources-not-ready-max",
            "type":"statistic",
            "config":{
                "statistic":"resources-away",
                "statisticLookup":"max",
                "additionalParams":['gaugeStart','gaugeEnd'],
                "ui":{
                    "title":{
                        "show":true,
                        "text":"Max Concurrent"
                    },
                    "unit":"Resources",
                    "size":{
                        "width":5,
                        "height":5
                    },
                    "position":{
                        "row":3,
                        "col":28
                    }
                }
            },
            "chart":{
                "indicator":{

                }
            }
        },
        {
            "id":"resources-not-ready-min",
            "type":"statistic",
            "config":{
                "statistic":"resources-away",
                "statisticLookup":"min",
                "additionalParams":['gaugeStart','gaugeEnd'],
                "ui":{
                    "title":{
                        "show":true,
                        "text":"Min Concurrent"
                    },
                    "unit":"Resources",
                    "size":{
                        "width":5,
                        "height":5
                    },
                    "position":{
                        "row":3,
                        "col":33
                    }
                }
            },
            "chart":{
                "indicator":{

                }
            }
        },
        {
            "id":"resources-busy-title",
            "type":"title",
            "config":{
                "ui":{
                    "size":{
                        "width":15,
                        "height":2
                    },
                    "position":{
                        "row":0,
                        "col":40
                    }
                }
            },
            "chart":{
                "data":"Busy Resources"
            }
        },
        {
            "id":"resources-busy-current",
            "type":"statistic",
            "config":{
                "statistic":"resources-busy",
                "statisticLookup":"value",
                "additionalParams":[],
                "ui":{
                    "title":{
                        "show":true,
                        "text":"Concurrent"
                    },
                    "unit":"Resources",
                    "size":{
                        "width":5,
                        "height":5
                    },
                    "position":{
                        "row":3,
                        "col":40
                    }
                }
            },
            "chart":{
                "indicator":{

                }
            }
        },
        {
            "id":"resources-busy-max",
            "type":"statistic",
            "config":{
                "statistic":"resources-busy",
                "statisticLookup":"max",
                "additionalParams":['gaugeStart','gaugeEnd'],
                "ui":{
                    "title":{
                        "show":true,
                        "text":"Max Concurrent"
                    },
                    "unit":"Resources",
                    "size":{
                        "width":5,
                        "height":5
                    },
                    "position":{
                        "row":3,
                        "col":45
                    }
                }
            },
            "chart":{
                "indicator":{

                }
            }
        },
        {
            "id":"resources-busy-min",
            "type":"statistic",
            "config":{
                "statistic":"resources-busy",
                "statisticLookup":"min",
                "additionalParams":['gaugeStart','gaugeEnd'],
                "ui":{
                    "title":{
                        "show":true,
                        "text":"Min Concurrent"
                    },
                    "unit":"Resources",
                    "size":{
                        "width":5,
                        "height":5
                    },
                    "position":{
                        "row":3,
                        "col":50
                    }
                }
            },
            "chart":{
                "indicator":{

                }
            }
        }
    ]
}
// {
//     "id":"queues",
//     "dashId":"queues",
//     "name":"Queue Dashboard",
//     "refreshRate":15000,
//     "gridster":{
//         "columns":60,
//         "minRows":10,
//         "maxRows":40,
//         "margins":[
//             20,
//             20
//         ],
//         "outerMargin":false,
//         "draggable":{
//             "enabled":false
//         },
//         "resizable":{
//             "enabled":false
//         }
//     },
//     "widgets":[
//         {
//             "id":"00000000-0000-0000-000000000001",
//             "type":"title",
//             "config":{
//                 "ui":{
//                     "size":{
//                         "width":10,
//                         "height":2
//                     },
//                     "position":{
//                         "row":0,
//                         "col":0
//                     }
//                 }
//             },
//             "chart":{
//                 "data":"All Queues"
//             }
//         },
//         {
//             "id":"00000000-0000-0000-000000000090",
//             "type":"gauge",
//             "config":{
//                 "statistic":"calls-answered-percent",
//                 "statisticLookup":"calls-answered",
//                 "additionalParams":['gaugeStart','gaugeEnd'],
//                 "ui":{
//                     "title":{
//                         "show":true,
//                         "text":"Answered < 20s"
//                     },
//                     "unit":"Answered < 20s",
//                     "size":{
//                         "width":3,
//                         "height":4
//                     },
//                     "position":{
//                         "row":2,
//                         "col":0
//                     }
//                 }
//             },
//             "chart":{
//                 "data":{
//                     "type":"gauge",
//                     "columns":[
//                         [
//                             "Name of graph",
//                             12
//                         ]
//                     ]
//                 }
//             }
//         },
//         {
//             "id":"00000000-0000-0000-000000000002",
//             "type":"statistic",
//             "config":{
//                 "statistic":"handle-time-duration",
//                 "statisticLookup":"avg",
//                 "additionalParams":['gaugeStart','gaugeEnd'],
//                 "ui":{
//                     "title":{
//                         "show":true,
//                         "text":"Avg Wait Time"
//                     },
//                     "unit":"",
//                     "size":{
//                         "width":3,
//                         "height":2
//                     },
//                     "position":{
//                         "row":2,
//                         "col":3
//                     }
//                 }
//             },
//             "chart":{
//                 "indicator":{
//
//                 }
//             }
//         },
//         {
//             "id":"00000000-0000-0000-000000000003",
//             "type":"statistic",
//             "config":{
//                 "statistic":"handle-time-duration",
//                 "statisticLookup":"max",
//                 "additionalParams":['gaugeStart','gaugeEnd'],
//                 "ui":{
//                     "title":{
//                         "show":true,
//                         "text":"Max Wait Time"
//                     },
//                     "unit":"",
//                     "size":{
//                         "width":3,
//                         "height":2
//                     },
//                     "position":{
//                         "row":2,
//                         "col":6
//                     }
//                 }
//             },
//             "chart":{
//                 "indicator":{
//
//                 }
//             }
//         },
//         {
//             "id":"00000000-0000-0000-000000000004",
//             "type":"statistic",
//             "config":{
//                 "statistic":"interaction-abandon-instance",
//                 "statisticLookup":"recordsCount",
//                 "additionalParams":['gaugeStart','gaugeEnd'],
//                 "ui":{
//                     "title":{
//                         "show":true,
//                         "text":"Abandons"
//                     },
//                     "unit":"customers",
//                     "size":{
//                         "width":3,
//                         "height":2
//                     },
//                     "position":{
//                         "row":4,
//                         "col":3
//                     }
//                 }
//             },
//             "chart":{
//                 "indicator":{
//
//                 }
//             }
//         },
//         {
//             "id":"00000000-0000-0000-000000000030",
//             "type":"statistic",
//             "config":{
//                 "statistic":"queue-length",
//                 "statisticLookup":"recordsCount",
//                 "additionalParams":['gaugeStart','gaugeEnd'],
//                 "ui":{
//                     "title":{
//                         "show":true,
//                         "text":"Queue Length"
//                     },
//                     "size":{
//                         "width":3,
//                         "height":2
//                     },
//                     "position":{
//                         "row":4,
//                         "col":6
//                     }
//                 }
//             },
//             "chart":{
//                 "indicator":{
//
//                 }
//             }
//         },
//         {
//             "id":"00000000-0000-0000-000000000066",
//             "type":"sourceSwitcher",
//             "config":{
//                 "groupName":"queue1",
//                 "sourceType":"queue",
//                 "items":[
//
//                 ],
//                 "ui":{
//                     "title":{
//                         "show":true,
//                         "text":"Queue:"
//                     },
//                     "size":{
//                         "width":10,
//                         "height":2
//                     },
//                     "position":{
//                         "row":0,
//                         "col":10
//                     }
//                 }
//             }
//         },
//         {
//             "id":"00000000-0000-0000-000000000091",
//             "type":"gauge",
//             "config":{
//                 "statistic":"calls-answered-percent",
//                 "statisticLookup":"calls-answered",
//                 "additionalParams":['gaugeStart','gaugeEnd'],
//                 "groupName":"queue1",
//                 "resourceIdName":"queue-id",
//                 "resourceId":null,
//                 "ui":{
//                     "title":{
//                         "show":true,
//                         "text":"Answered < 20s"
//                     },
//                     "unit":"Answered < 20s",
//                     "size":{
//                         "width":3,
//                         "height":4
//                     },
//                     "position":{
//                         "row":3,
//                         "col":10
//                     }
//                 }
//             },
//             "chart":{
//                 "data":{
//                     "type":"gauge",
//                     "columns":[
//                         [
//                             "Name of graph",
//                             20
//                         ]
//                     ]
//                 }
//             }
//         },
//         {
//             "id":"00000000-0000-0000-000000000007",
//             "type":"statistic",
//             "config":{
//                 "statistic":"handle-time-duration",
//                 "statisticLookup":"avg",
//                 "additionalParams":['gaugeStart','gaugeEnd'],
//                 "groupName":"queue1",
//                 "resourceIdName":"queue-id",
//                 "resourceId":null,
//                 "ui":{
//                     "title":{
//                         "show":true,
//                         "text":"Avg Wait Time"
//                     },
//                     "unit":"",
//                     "size":{
//                         "width":3,
//                         "height":2
//                     },
//                     "position":{
//                         "row":3,
//                         "col":13
//                     }
//                 }
//             },
//             "chart":{
//                 "indicator":{
//
//                 }
//             }
//         },
//         {
//             "id":"00000000-0000-0000-000000000008",
//             "type":"statistic",
//             "config":{
//                 "statistic":"handle-time-duration",
//                 "statisticLookup":"max",
//                 "additionalParams":['gaugeStart','gaugeEnd'],
//                 "groupName":"queue1",
//                 "resourceIdName":"queue-id",
//                 "resourceId":null,
//                 "ui":{
//                     "title":{
//                         "show":true,
//                         "text":"Max Wait Time"
//                     },
//                     "unit":"",
//                     "size":{
//                         "width":3,
//                         "height":2
//                     },
//                     "position":{
//                         "row":3,
//                         "col":16
//                     }
//                 }
//             },
//             "chart":{
//                 "indicator":{
//
//                 }
//             }
//         },
//         {
//             "id":"00000000-0000-0000-000000000009",
//             "type":"statistic",
//             "config":{
//                 "statistic":"interaction-abandon-instance",
//                 "statisticLookup":"recordsCount",
//                 "additionalParams":['gaugeStart','gaugeEnd'],
//                 "groupName":"queue1",
//                 "resourceIdName":"queue-id",
//                 "resourceId":null,
//                 "ui":{
//                     "title":{
//                         "show":true,
//                         "text":"Abandons"
//                     },
//                     "unit":"customers",
//                     "size":{
//                         "width":3,
//                         "height":2
//                     },
//                     "position":{
//                         "row":5,
//                         "col":13
//                     }
//                 }
//             },
//             "chart":{
//                 "indicator":{
//
//                 }
//             }
//         },
//         {
//             "id":"00000000-0000-0000-000000000010",
//             "type":"statistic",
//             "config":{
//                 "statistic":"queue-length",
//                 "statisticLookup":"recordsCount",
//                 "additionalParams":['gaugeStart','gaugeEnd'],
//                 "groupName":"queue1",
//                 "resourceIdName":"queue-id",
//                 "resourceId":null,
//                 "ui":{
//                     "title":{
//                         "show":true,
//                         "text":"Queue Length"
//                     },
//                     "size":{
//                         "width":3,
//                         "height":2
//                     },
//                     "position":{
//                         "row":5,
//                         "col":16
//                     }
//                 }
//             },
//             "chart":{
//                 "indicator":{
//
//                 }
//             }
//         },
//         {
//             "id":"00000000-0000-0000-000000000066",
//             "type":"sourceSwitcher",
//             "config":{
//                 "groupName":"queue2",
//                 "sourceType":"queue",
//                 "items":[
//
//                 ],
//                 "ui":{
//                     "title":{
//                         "show":true,
//                         "text":"Queue:"
//                     },
//                     "size":{
//                         "width":10,
//                         "height":2
//                     },
//                     "position":{
//                         "row":0,
//                         "col":20
//                     }
//                 }
//             }
//         },
//         {
//             "id":"00000000-0000-0000-000000000092",
//             "type":"gauge",
//             "config":{
//                 "statistic":"calls-answered-percent",
//                 "statisticLookup":"calls-answered",
//                 "additionalParams":['gaugeStart','gaugeEnd'],
//                 "groupName":"queue2",
//                 "resourceIdName":"queue-id",
//                 "resourceId":null,
//                 "ui":{
//                     "title":{
//                         "show":true,
//                         "text":"Answered < 20s"
//                     },
//                     "unit":"Answered < 20s",
//                     "size":{
//                         "width":3,
//                         "height":4
//                     },
//                     "position":{
//                         "row":3,
//                         "col":20
//                     }
//                 }
//             },
//             "chart":{
//                 "data":{
//                     "columns":[
//                         [
//                             "Name of graph",
//                             12
//                         ]
//                     ]
//                 }
//             }
//         },
//         {
//             "id":"00000000-0000-0000-000000000013",
//             "type":"statistic",
//             "config":{
//                 "statistic":"handle-time-duration",
//                 "statisticLookup":"avg",
//                 "additionalParams":['gaugeStart','gaugeEnd'],
//                 "groupName":"queue2",
//                 "resourceIdName":"queue-id",
//                 "resourceId":null,
//                 "ui":{
//                     "title":{
//                         "show":true,
//                         "text":"Avg Wait Time"
//                     },
//                     "unit":"",
//                     "size":{
//                         "width":3,
//                         "height":2
//                     },
//                     "position":{
//                         "row":3,
//                         "col":23
//                     }
//                 }
//             },
//             "chart":{
//                 "indicator":{
//
//                 }
//             }
//         },
//         {
//             "id":"00000000-0000-0000-000000000014",
//             "type":"statistic",
//             "config":{
//                 "statistic":"handle-time-duration",
//                 "statisticLookup":"max",
//                 "additionalParams":['gaugeStart','gaugeEnd'],
//                 "groupName":"queue2",
//                 "resourceIdName":"queue-id",
//                 "resourceId":null,
//                 "ui":{
//                     "title":{
//                         "show":true,
//                         "text":"Max Wait Time"
//                     },
//                     "unit":"",
//                     "size":{
//                         "width":3,
//                         "height":2
//                     },
//                     "position":{
//                         "row":3,
//                         "col":26
//                     }
//                 }
//             },
//             "chart":{
//                 "indicator":{
//
//                 }
//             }
//         },
//         {
//             "id":"00000000-0000-0000-000000000015",
//             "type":"statistic",
//             "config":{
//                 "statistic":"interaction-abandon-instance",
//                 "statisticLookup":"recordsCount",
//                 "additionalParams":['gaugeStart','gaugeEnd'],
//                 "groupName":"queue2",
//                 "resourceIdName":"queue-id",
//                 "resourceId":null,
//                 "ui":{
//                     "title":{
//                         "show":true,
//                         "text":"Abandons"
//                     },
//                     "unit":"customers",
//                     "size":{
//                         "width":3,
//                         "height":2
//                     },
//                     "position":{
//                         "row":5,
//                         "col":23
//                     }
//                 }
//             },
//             "chart":{
//                 "indicator":{
//
//                 }
//             }
//         },
//         {
//             "id":"00000000-0000-0000-000000000016",
//             "type":"statistic",
//             "config":{
//                 "statistic":"queue-length",
//                 "statisticLookup":"recordsCount",
//                 "additionalParams":['gaugeStart','gaugeEnd'],
//                 "groupName":"queue2",
//                 "resourceIdName":"queue-id",
//                 "resourceId":null,
//                 "ui":{
//                     "title":{
//                         "show":true,
//                         "text":"Queue Length"
//                     },
//                     "size":{
//                         "width":3,
//                         "height":2
//                     },
//                     "position":{
//                         "row":5,
//                         "col":26
//                     }
//                 }
//             },
//             "chart":{
//                 "indicator":{
//
//                 }
//             }
//         }
//     ]
// },
// {
//     "id":"interactions",
//     "dashId":"interactions",
//     "name":"Interactions Dashboard",
//     "refreshRate":15000,
//     "gridster":{
//         "columns":60,
//         "minRows":10,
//         "maxRows":40,
//         "margins":[
//             20,
//             20
//         ],
//         "outerMargin":false,
//         "draggable":{
//             "enabled":false
//         },
//         "resizable":{
//             "enabled":false
//         }
//     },
//     "widgets":[
//         {
//             "id":"00000000-0000-0000-000000000001",
//             "type":"title",
//             "config":{
//                 "ui":{
//                     "size":{
//                         "width":20,
//                         "height":1
//                     },
//                     "position":{
//                         "row":0,
//                         "col":0
//                     }
//                 }
//             },
//             "chart":{
//                 "data":"All Interactions"
//             }
//         },
//         {
//             "id":"00000000-0000-0000-000000000002",
//             "type":"statistic",
//             "config":{
//                 "statistic":"interaction-duration",
//                 "statisticLookup":"recordsCount",
//                 "additionalParams":['gaugeStart','gaugeEnd'],
//                 "ui":{
//                     "title":{
//                         "show":true,
//                         "text":"Total Active"
//                     },
//                     "unit":"interactions",
//                     "size":{
//                         "width":4,
//                         "height":4
//                     },
//                     "position":{
//                         "row":2,
//                         "col":0
//                     }
//                 }
//             },
//             "chart":{
//                 "indicator":{
//
//                 }
//             }
//         },
//         {
//             "id":"00000000-0000-0000-000000000003",
//             "type":"statistic",
//             "config":{
//                 "statistic":"conversation-duration",
//                 "statisticLookup":"recordsCount",
//                 "additionalParams":['gaugeStart','gaugeEnd'],
//                 "ui":{
//                     "title":{
//                         "show":true,
//                         "text":"In Conversation"
//                     },
//                     "unit":"interactions",
//                     "size":{
//                         "width":4,
//                         "height":4
//                     },
//                     "position":{
//                         "row":2,
//                         "col":4
//                     }
//                 }
//             },
//             "chart":{
//                 "indicator":{
//
//                 }
//             }
//         },
//         {
//             "id":"00000000-0000-0000-000000000004",
//             "type":"statistic",
//             "config":{
//                 "statistic":"interaction-duration",
//                 "statisticLookup":"recordsCount",
//                 "additionalParams":['gaugeStart','gaugeEnd'],
//                 "ui":{
//                     "title":{
//                         "show":true,
//                         "text":"Total Today"
//                     },
//                     "unit":"interactions",
//                     "size":{
//                         "width":4,
//                         "height":2
//                     },
//                     "position":{
//                         "row":2,
//                         "col":8
//                     }
//                 }
//             },
//             "chart":{
//                 "indicator":{
//
//                 }
//             }
//         },
//         {
//             "id":"00000000-0000-0000-000000000030",
//             "type":"statistic",
//             "config":{
//                 "statistic":"queue-duration",
//                 "statisticLookup":"recordsCount",
//                 "additionalParams":['gaugeStart','gaugeEnd'],
//                 "ui":{
//                     "title":{
//                         "show":true,
//                         "text":"In Queue"
//                     },
//                     "unit":"interactions",
//                     "size":{
//                         "width":4,
//                         "height":2
//                     },
//                     "position":{
//                         "row":6,
//                         "col":8
//                     }
//                 }
//             },
//             "chart":{
//                 "indicator":{
//
//                 }
//             }
//         },
//         {
//             "id":"00000000-0000-0000-000000000006",
//             "type":"statistic",
//             "config":{
//                 "statistic":"interaction-duration",
//                 "statisticLookup":"avg",
//                 "additionalParams":['gaugeStart','gaugeEnd'],
//                 "ui":{
//                     "title":{
//                         "show":true,
//                         "text":"Avg. Interaction Duration"
//                     },
//                     "unit":"",
//                     "size":{
//                         "width":4,
//                         "height":2
//                     },
//                     "position":{
//                         "row":2,
//                         "col":12
//                     }
//                 }
//             },
//             "chart":{
//                 "indicator":{
//
//                 }
//             }
//         },
//         {
//             "id":"00000000-0000-0000-000000000007",
//             "type":"statistic",
//             "config":{
//                 "statistic":"interaction-abandon-instance",
//                 "statisticLookup":"recordsCount",
//                 "additionalParams":['gaugeStart','gaugeEnd'],
//                 "ui":{
//                     "title":{
//                         "show":true,
//                         "text":"Abandons"
//                     },
//                     "unit":"interactions",
//                     "size":{
//                         "width":4,
//                         "height":2
//                     },
//                     "position":{
//                         "row":6,
//                         "col":12
//                     }
//                 }
//             },
//             "chart":{
//                 "indicator":{
//
//                 }
//             }
//         },
//         {
//             "id":"00000000-0000-0000-000000000008",
//             "type":"statistic",
//             "config":{
//                 "statistic":"interaction-transfer-instance",
//                 "statisticLookup":"recordsCount",
//                 "additionalParams":['gaugeStart','gaugeEnd'],
//                 "ui":{
//                     "title":{
//                         "show":true,
//                         "text":"Transfers"
//                     },
//                     "unit":"interactions",
//                     "size":{
//                         "width":4,
//                         "height":2
//                     },
//                     "position":{
//                         "row":2,
//                         "col":16
//                     }
//                 }
//             },
//             "chart":{
//                 "indicator":{
//
//                 }
//             }
//         },
//         {
//             "id":"00000000-0000-0000-000000000009",
//             "type":"statistic",
//             "config":{
//                 "statistic":"interaction-abandon-instance",
//                 "statisticLookup":"recordsCount",
//                 "additionalParams":['gaugeStart','gaugeEnd'],
//                 "ui":{
//                     "title":{
//                         "show":true,
//                         "text":"IVR Abandons"
//                     },
//                     "unit":"interactions",
//                     "size":{
//                         "width":4,
//                         "height":2
//                     },
//                     "position":{
//                         "row":6,
//                         "col":16
//                     }
//                 }
//             },
//             "chart":{
//                 "indicator":{
//
//                 }
//             }
//         }
//     ]
// }

]);
