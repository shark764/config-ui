angular.module('liveopsConfigPanel').constant('mockDashboard', {
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
        });