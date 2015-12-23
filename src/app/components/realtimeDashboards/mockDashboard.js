/*jshint quotmark: false */

angular.module('liveopsConfigPanel')
.value('mockDashboard', {
            "id":"default",
            "dashId":"default1",
            "name":"Default Dashboard",
            "gridster":{
                "mobileModeEnabled":false,
                "columns":24,
                "minRows":10,
                "maxRows":30,
                "margins":[
                    40,
                    40
                ],
                "outerMargin":false,
                "draggable":{
                    "enabled":true
                },
                "resizable":{
                    "enabled":true
                }
            },
            "config":{
                "ui":{
                    "size":{
                        "autoResize":true
                    }
                }
            },
            "widgets":[
                {
                    "id":"00000000-0000-0000-000000000003",
                    "type":"statistic",
                    "config":{
                        "statistic":"abandonTimeAvg",
                        "refreshRate":5000,
                        "ui":{
                            "title":{
                                "show":true,
                                "text":"Average Abandon Time"
                            },
                            "size":{
                                "width":4,
                                "height":3
                            }
                        }
                    },
                    "chart":{
                        "indicator":{}
                    }
                },
                {
                    "id":"00000000-0000-0000-000000000003",
                    "type":"statistic",
                    "config":{
                        "statistic":"wrapUpTimeAvg",
                        "refreshRate":5000,
                        "ui":{
                            "title":{
                                "show":true,
                                "text":"Average Wrap Up Time"
                            },
                            "size":{
                                "width":4,
                                "height":3
                            }
                        }
                    },
                    "chart":{
                        "indicator":{}
                    }
                },
                {
                    "id":"00000000-0000-0000-000000000003",
                    "type":"statistic",
                    "config":{
                        "statistic":"holdTimeAvg",
                        "refreshRate":5000,
                        "ui":{
                            "title":{
                                "show":true,
                                "text":"Average Hold Time"
                            },
                            "size":{
                                "width":4,
                                "height":3
                            }
                        }
                    },
                    "chart":{
                        "indicator":{}
                    }
                },
                {
                    "id":"00000000-0000-0000-000000000003",
                    "type":"statistic",
                    "config":{
                        "statistic":"queueDurationAvg",
                        "refreshRate":5000,
                        "ui":{
                            "title":{
                                "show":true,
                                "text":"Average Queue Wait"
                            },
                            "size":{
                                "width":4,
                                "height":3
                            }
                        }
                    },
                    "chart":{
                        "indicator":{}
                    }
                },
                {
                    "id":"00000000-0000-0000-000000000003",
                    "type":"statistic",
                    "config":{
                        "statistic":"queueAbandonsInstance",
                        "refreshRate":5000,
                        "ui":{
                            "title":{
                                "show":true,
                                "text":"# of Queues abandoned"
                            },
                            "size":{
                                "width":4,
                                "height":3
                            }
                        }
                    },
                    "chart":{
                        "indicator":{}
                    }
                },
                {
                    "id":"00000000-0000-0000-000000000003",
                    "type":"statistic",
                    "config":{
                        "statistic":"timeToAnswerAvg",
                        "refreshRate":5000,
                        "ui":{
                            "title":{
                                "show":true,
                                "text":"Average Time To Answer"
                            },
                            "size":{
                                "width":4,
                                "height":3
                            }
                        }
                    },
                    "chart":{
                        "indicator":{}
                    }
                },
                {
                    "id":"00000000-0000-0000-000000000003",
                    "type":"statistic",
                    "config":{
                        "statistic":"agentTalkTimeAvg",
                        "refreshRate":5000,
                        "ui":{
                            "title":{
                                "show":true,
                                "text":"Average Talk Time"
                            },
                            "size":{
                                "width":4,
                                "height":3
                            }
                        }
                    },
                    "chart":{
                        "indicator":{}
                    }
                },
                {
                    "id":"00000000-0000-0000-000000000003",
                    "type":"statistic",
                    "config":{
                        "statistic":"interactionTimeAvg",
                        "refreshRate":5000,
                        "ui":{
                            "title":{
                                "show":true,
                                "text":"Average Interaction Time"
                            },
                            "size":{
                                "width":4,
                                "height":3
                            }
                        }
                    },
                    "chart":{
                        "indicator":{}
                    }
                }
            ]
        })
.value('monitorDashboard', {
            "id":"default2",
            "dashId":"default2",
            "name":"Monitor Dashboard",
            "refreshRate":30000,
            "gridster":{
                "columns":60,
                "minRows":10,
                "maxRows":40,
                "margins":[
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
            "widgets":[
                {
                  "id":"00000000-0000-0000-000000000065",
                  "type":"sourceSwitcher",
                  "config":{
                      "groupName":"queue1",
                      "sourceType": "queue",
                      "items": [],
                      "ui":{
                        "title":{
                            "show":true,
                            "text":"Queue:"
                        },
                          "size":{
                              "width":11,
                              "height":3
                          }
                      }
                  }
                },
                {
                    "id":"00000000-0000-0000-000000000002",
                    "type":"statistic",
                    "config":{
                        "statistic":"queue-duration",
                        "statisticLookup":"recordsCount",
                        "groupName": "queue1",
                        "resourceIdName": "queue-id",
                        "resourceId": null,
                        "ui":{
                            "title":{
                                "show":true,
                                "text":"Queue Length"
                            },
                            "unit": "Customers",
                            "size":{
                                "width":6,
                                "height":8
                            },
                            "position": {
                              row: 2,
                              col: 0
                          }
                        }
                    },
                    "chart":{
                        "indicator":{}
                    }
                    
                },
                {
                    "id":"00000000-0000-0000-000000000001",
                    "type":"statistic",
                    "config":{
                        "statistic":"queue-duration",
                        "statisticLookup":"avg",
                        "groupName": "queue1",
                        "resourceIdName": "queue-id",
                        "resourceId": null,
                        "ui":{
                            "title":{
                                "show":true,
                                "text":"Avg. Wait Time"
                            },
                            "unit": "mm:ss",
                            "size":{
                                "width":5,
                                "height":4
                            },
                            "position": {
                                row: 4,
                                col: 6
                            }
                        }
                    },
                    "chart":{
                        "indicator":{}
                    }
                },
                {
                  "id":"00000000-0000-0000-000000000003",
                  "type":"statistic",
                  "config":{
                      "statistic":"interaction-abandon-instance",
                      "statisticLookup":"recordsCount",
                      "groupName": "queue1",
                      "resourceIdName": "queue-id",
                      "resourceId": null,
                      "ui":{
                          "title":{
                              "show":true,
                              "text":"Total Abandons"
                          },
                          "unit": "Customers",
                          "size":{
                              "width":5,
                              "height":4
                          },
                          "position": {
                            row: 8,
                            col: 6
                        }
                      }
                  },
                  "chart":{
                      "indicator":{}
                  }
                  
              }, {
                "id":"00000000-0000-0000-000000000066",
                "type":"sourceSwitcher",
                "config":{
                    "groupName":"queue2",
                    "sourceType": "queue",
                    "items": [],
                    "ui":{
                        "title":{
                          "show":true,
                          "text":"Queue:"
                      },
                        "size":{
                            "width":11,
                            "height":3
                        },
                        "position": {
                            "row": 0,
                            "col": 12
                        }
                    }
                }
              },
              {
                  "id":"00000000-0000-0000-000000000068",
                  "type":"statistic",
                  "config":{
                      "statistic":"queue-duration",
                      "statisticLookup":"recordsCount",
                      "groupName": "queue2",
                      "resourceIdName": "queue-id",
                      "resourceId": null,
                      "ui":{
                          "title":{
                              "show":true,
                              "text":"Queue Length"
                          },
                          "unit": "Customers",
                          "size":{
                              "width":6,
                              "height":8
                          },
                          "position": {
                            row: 4,
                            col: 12
                        }
                      }
                  },
                  "chart":{
                      "indicator":{}
                  }
                  
              },
              {
                  "id":"00000000-0000-0000-000000000067",
                  "type":"statistic",
                  "config":{
                      "statistic":"queue-duration",
                      "statisticLookup":"avg",
                      "groupName": "queue2",
                      "resourceIdName": "queue-id",
                      "resourceId": null,
                      "ui":{
                          "title":{
                              "show":true,
                              "text":"Avg. Wait Time"
                          },
                          "unit": "mm:ss",
                          "size":{
                              "width":5,
                              "height":4
                          },
                          "position": {
                              row: 4,
                              col: 18
                          }
                      }
                  },
                  "chart":{
                      "indicator":{}
                  }
              }, {
                "id":"00000000-0000-0000-000000000069",
                "type":"statistic",
                "config":{
                    "statistic":"interaction-abandon-instance",
                    "statisticLookup":"recordsCount",
                    "groupName": "queue2",
                    "resourceIdName": "queue-id",
                    "resourceId": null,
                    "ui":{
                        "title":{
                            "show":true,
                            "text":"Total Abandons"
                        },
                        "unit": "Customers",
                        "size":{
                            "width":5,
                            "height":4
                        },
                        "position": {
                          row: 8,
                          col: 18
                      }
                    }
                },
                "chart":{
                    "indicator":{}
                }
            },
            {
              "id":"00000000-0000-0000-000000000081",
              "type":"title",
              "config":{
                  "ui":{
                      "size":{
                          "width":15,
                          "height":3
                      },
                      "position": {
                        row: 0,
                        col: 25
                    }
                  }
              },
              "chart":{
                  "data": 'All Agents'
              }
            },
            {
              "id":"00000000-0000-0000-000000000082",
              "type":"statistic",
              "config":{
                  "statistic":"resource-ready-instance",
                  "statisticLookup":"recordsCount",
                  "ui":{
                      "title":{
                          "show":true,
                          "text":"Agents Ready"
                      },
                      "unit": "Agents",
                      "size":{
                          "width":5,
                          "height":5
                      },
                      "position": {
                          row: 4,
                          col: 25
                      }
                  }
              },
              "chart":{
                  "indicator":{}
              }
            },
            {
              "id":"00000000-0000-0000-000000000083",
              "type":"statistic",
              "config":{
                  "statistic":"resource-not-ready-instance",
                  "statisticLookup":"recordsCount",
                  "ui":{
                      "title":{
                          "show":true,
                          "text":"Agents Not Ready"
                      },
                      "unit": "Agents",
                      "size":{
                          "width":5,
                          "height":5
                      },
                      "position": {
                          row: 4,
                          col: 30
                      }
                  }
              },
              "chart":{
                  "indicator":{}
              }
            },
            {
              "id":"00000000-0000-0000-000000000084",
              "type":"statistic",
              "config":{
                  "statistic":"resource-busy-duration",
                  "statisticLookup":"recordsCount",
                  "ui":{
                      "title":{
                          "show":true,
                          "text":"Agents Busy"
                      },
                      "unit": "Agents",
                      "size":{
                          "width":5,
                          "height":5
                      },
                      "position": {
                          row: 4,
                          col: 35
                      }
                  }
              },
              "chart":{
                  "indicator":{}
              }
            },
            {
              "id":"00000000-0000-0000-000000000085",
              "type":"statistic",
              "config":{
                  "statistic":"resource-conversation-duration",
                  "statisticLookup":"avg",
                  "ui":{
                      "title":{
                          "show":true,
                          "text":"Avg. Conversation Time"
                      },
                      "unit": "mm:ss",
                      "size":{
                          "width":5,
                          "height":5
                      },
                      "position": {
                          row: 9,
                          col: 25
                      }
                  }
              },
              "chart":{
                  "indicator":{}
              }
            },
            {
              "id":"00000000-0000-0000-000000000086",
              "type":"statistic",
              "config":{
                  "statistic":"wrap-up-duration",
                  "statisticLookup":"avg",
                  "ui":{
                      "title":{
                          "show":true,
                          "text":"Avg. Wrap-up Time"
                      },
                      "unit": "mm:ss",
                      "size":{
                          "width":5,
                          "height":5
                      },
                      "position": {
                          row: 9,
                          col: 30
                      }
                  }
              },
              "chart":{
                  "indicator":{}
              }
            },
            {
              "id":"00000000-0000-0000-000000000087",
              "type":"statistic",
              "config":{
                  "statistic":"resource-hold-duration",
                  "statisticLookup":"recordsCount",
                  "ui":{
                      "title":{
                          "show":true,
                          "text":"Hold Count"
                      },
                      "unit": "Holds",
                      "size":{
                          "width":5,
                          "height":5
                      },
                      "position": {
                          row: 9,
                          col: 35
                      }
                  }
              },
              "chart":{
                  "indicator":{}
              }
            },
            {
              "id":"00000000-0000-0000-000000000070",
              "type":"title",
              "config":{
                  "ui":{
                      "size":{
                          "width":18,
                          "height":3
                      },
                      "position": {
                        row: 0,
                        col: 42
                    }
                  }
              },
              "chart":{
                  "data": 'All Interactions'
              }
              
        },
        {
          "id":"00000000-0000-0000-000000000073",
          "type":"statistic",
          "config":{
              "statistic":"queue-duration",
              "statisticLookup":"recordsCount",
              "ui":{
                  "title":{
                      "show":true,
                      "text":"Total in Queue"
                  },
                  "unit": "Customers",
                  "size":{
                      "width":6,
                      "height":6
                  },
                  "position": {
                      row: 4,
                      col: 42
                  }
              }
          },
          "chart":{
              "indicator":{}
          }
        },
        {
          "id":"00000000-0000-0000-000000000072",
          "type":"statistic",
          "config":{
              "statistic":"interaction-start-instance",
              "statisticLookup":"recordsCount",
              "ui":{
                  "title":{
                      "show":true,
                      "text":"Interactions in Conversation"
                  },
                  "unit": "Interactions",
                  "size":{
                      "width":6,
                      "height":6
                  },
                  "position": {
                    row: 4,
                    col: 48
                }
              }
          },
          "chart":{
              "indicator":{}
          }
      },
      {
        "id":"00000000-0000-0000-000000000074",
        "type":"statistic",
        "config":{
            "statistic":"abandon-queue-instance",
            "statisticLookup":"recordsCount",
            "ui":{
                "title":{
                    "show":true,
                    "text":"Queue Abandons"
                },
                "unit": "Customers",
                "size":{
                    "width":6,
                    "height":6
                },
                "position": {
                    row: 4,
                    col: 55
                }
            }
        },
        "chart":{
            "indicator":{}
        }
      },
      {
        "id":"00000000-0000-0000-000000000076",
        "type":"statistic",
        "config":{
            "statistic":"interaction-duration",
            "statisticLookup":"avg",
            "ui":{
                "title":{
                    "show":true,
                    "text":"Avg. Interaction Time"
                },
                "unit": "mm:ss",
                "size":{
                    "width":9,
                    "height":5
                },
                "position": {
                    row: 12,
                    col: 42
                }
            }
        },
        "chart":{
            "indicator":{}
        }
      },
      {
        "id":"00000000-0000-0000-000000000079",
        "type":"statistic",
        "config":{
            "statistic":"abandon-time-duration",
            "statisticLookup":"avg",
            "ui":{
                "title":{
                    "show":true,
                    "text":"Avg. Abandon Time"
                },
                "unit": "mm:ss",
                "size":{
                    "width":9,
                    "height":5
                },
                "position": {
                    row: 12,
                    col: 51
                }
            }
        },
        "chart":{
            "indicator":{}
        }
      }
    ]
});