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
                "columns":30,
                "minRows":10,
                "maxRows":30,
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
                              "width":7,
                              "height":1
                          }
                      }
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
                                "text":"Average Wait Time"
                            },
                            "size":{
                                "width":3,
                                "height":4
                            },
                            "position": {
                                row: 1,
                                col: 0
                            }
                        }
                    },
                    "chart":{
                        "indicator":{}
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
                            "size":{
                                "width":4,
                                "height":2
                            },
                            "position": {
                              row: 2,
                              col: 3
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
                          "size":{
                              "width":4,
                              "height":2
                          },
                          "position": {
                            row: 4,
                            col: 3
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
                            "width":7,
                            "height":1
                        },
                        "position": {
                            "row": 0,
                            "col": 8
                        }
                    }
                }
              },
              {
                  "id":"00000000-0000-0000-000000000067",
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
                              "text":"Average Wait Time"
                          },
                          "size":{
                              "width":3,
                              "height":4
                          },
                          "position": {
                              row: 2,
                              col: 8
                          }
                      }
                  },
                  "chart":{
                      "indicator":{}
                  }
              },
              {
                  "id":"00000000-0000-0000-000000000068",
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
                          "size":{
                              "width":4,
                              "height":2
                          },
                          "position": {
                            row: 2,
                            col: 11
                        }
                      }
                  },
                  "chart":{
                      "indicator":{}
                  }
                  
              },
              {
                "id":"00000000-0000-0000-000000000069",
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
                        "size":{
                            "width":4,
                            "height":2
                        },
                        "position": {
                          row: 4,
                          col: 11
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
                          "width":14,
                          "height":1
                      },
                      "position": {
                        row: 0,
                        col: 17
                    }
                  }
              },
              "chart":{
                  "data": 'All Interactions'
              }
              
          },
          {
            "id":"00000000-0000-0000-000000000071",
            "type":"statistic",
            "config":{
                "statistic":"interaction-duration",
                "statisticLookup":"recordsCount",
                "ui":{
                    "title":{
                        "show":true,
                        "text":"Active Interactions"
                    },
                    "size":{
                        "width":5,
                        "height":5
                    },
                    "position": {
                      row: 1,
                      col: 16
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
                  "size":{
                      "width":5,
                      "height":5
                  },
                  "position": {
                    row: 1,
                    col: 21
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
                    "text":"Avg. Int. Time"
                },
                "size":{
                    "width":4,
                    "height":5
                },
                "position": {
                    row: 1,
                    col: 26
                }
            }
        },
        "chart":{
            "indicator":{}
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
                "size":{
                    "width":4,
                    "height":3
                },
                "position": {
                    row: 6,
                    col: 16
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
                "size":{
                    "width":4,
                    "height":3
                },
                "position": {
                    row: 6,
                    col: 20
                }
            }
        },
        "chart":{
            "indicator":{}
        }
      },
      {
        "id":"00000000-0000-0000-000000000075",
        "type":"statistic",
        "config":{
            "statistic":"interaction-abandon-instance",
            "statisticLookup":"recordsCount",
            "ui":{
                "title":{
                    "show":true,
                    "text":"IVR Abandons"
                },
                "size":{
                    "width":3,
                    "height":3
                },
                "position": {
                    row: 6,
                    col: 24
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
            "statistic":"interaction-transfer-instance",
            "statisticLookup":"recordsCount",
            "ui":{
                "title":{
                    "show":true,
                    "text":"Interactions Transferred"
                },
                "size":{
                    "width":3,
                    "height":3
                },
                "position": {
                    row: 6,
                    col: 27
                }
            }
        },
        "chart":{
            "indicator":{}
        }
      }
            ]
        });