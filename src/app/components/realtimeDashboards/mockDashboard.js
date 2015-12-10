angular.module('liveopsConfigPanel').constant('mockDashboard', {
  'id': 'default',
  'dashId': 'default1',
  'name': 'Default Dashboard',
  'gridster': {
    'mobileModeEnabled': false,
    'columns': 24,
    'minRows': 10,
    'maxRows': 30,
    'margins': [0,40],
    'outerMargin': false,
    'draggable': {
      'enabled': false
    },
    'resizable': {
      'enabled': false
    }
  },
  'config': {
    'ui': {
      'size': {
        'autoResize': true
      }
    }
  },
  'widgets': [{ // Three grid widgets, one for each grouping (queue, groups, interactions)
    'name': 'Queues',
    'type': 'grid',
    'id': '00000000-0000-0000-000000000000',
    'config': {
      'ui': {
        'size': {
          'width': 8,
          'height': 10,
          'autoResize': true
        }
      }
    },
    'gridster': {
      'mobileModeEnabled': false,
      'columns': 6,
      'margins': [10,25],
      'outerMargin': false,
      'draggable': {
        'enabled': false
      },
      'resizable': {
        'enabled': true,
        'axes': 'y'
      }
    },
    'widgets': [{ // Three queue widgets, queue a, queue b, table
      'name': 'Queue A',
      'order': 0,
      'type': 'grid',
      'id': '00000000-0000-0000-000000000001',
      'gridster': {
        'mobileModeEnabled': false,
        'columns': 6,
        'margins': [10,10],
        'outerMargin': false,
        'draggable': {
          'enabled': true,
        },
        'resizable': {
          'enabled': true
        }
      },
      'config': {
        'ui': {
          'size': {
            'width': 3,
            'minWidth': 3,
            'maxWidth': 3,
            'height': 6,
            'autoResize': true
          },
          'resizable': {
            'disabled': true
          }
        }
      },
      'widgets': [{ // Four Widgets and a title in Queue A
        'id': '00000000-0000-0000-000000000046',
        'type': 'title',
        'config': {
          'ui': {
            'size': {
              'width': 6,
              'height': 1
            },
            'resizable' : {
              'disabled': true
            }
          }
        },
        'chart': {
          'data': 'Level A Support'
        }
      }, {
        'id': '00000000-0000-0000-000000000002',
        'type': 'gauge',
        'config': {
            'statistic': {
              'type': 'Service Level',
              'aggregationFn': 'avg'
            },
            'timeseries': {
              'bucketSize': 15,
              'bucketSizeUnit': 'seconds'
            },
            'refreshRate': {
              'interval': 10,
              'intervalUnit': 'seconds'
            },
            'ui': {
                'size': {
                  'width': 6,
                  'height': 6,
                  'maxHeight': 6,
                  'minHeight': 1,
                  'maxWidth': 6,
                  'minWidth': 1
                }
            }
          },
          'chart': {
            'axis': {
              'x': {
                'show': true,
                'label': false
              },
              'y': {
                'show': true,
                'label': false
              }
            },
            'data': {
              'type': 'gauge',
              'columns': [
                [
                  'Service Level',
                  37
                ]
              ]
            }
          }
      }, {
          'id': '00000000-0000-0000-000000000003',
          'type': 'statistic',
          'config': {
            'statistic': {
              'type': 'SLA',
              'aggregationFn': 'max'
            },
            'refreshRate': {
              'interval': 5,
              'intervalUnit': 'seconds'
            },
            'ui': {
              'title': {
                'show': true,
                'text': 'Average Wait Time (min)'
              },
              'size': {
                'width': 3,
                'height': 4
              }
            }
          },
          'chart': {
            'data': 0.1,
            'indicator': {
            }
          }
      }, {
          'id': '00000000-0000-0000-000000000004',
          'type': 'statistic',
          'config': {
            'statistic': {
              'type': 'SLA',
              'aggregationFn': 'max'
            },
            'refreshRate': {
              'interval': 5,
              'intervalUnit': 'seconds'
            },
            'ui': {
              'title': {
                'show': true,
                'text': 'Max Talk Time (min)'
              },
              'size': {
                'width': 3,
                'height': 2
              }
            }
          },
          'chart': {
            'data': 0.1,
            'indicator': {
              'threshold': 5.5
            }
          }
      }, {
        'id': '00000000-0000-0000-000000000005',
        'type': 'statistic',
        'config': {
          'statistic': {
              'type': 'SLA',
              'aggregationFn': 'max'
          },
          'refreshRate': {
              'interval': 5,
              'intervalUnit': 'seconds'
          },
          'ui': {
            'title': {
              'show': true,
              'text': 'Max Talk Time (min)'
            },
            'size': {
              'width': 3,
              'height': 2
            }
          }
        },
        'chart': {
          'data': 0.1,
          'indicator': {
            'threshold': 5.5
          }
        }
      }] 
    }, {
      'name': 'Queue B',
      'order': 0,
      'type': 'grid',
      'id': '00000000-0000-0000-000000000006',
      'config': {
        'ui': {
          'size': {
            'width': 3,
            'minWidth': 3,
            'maxWidth': 3,
            'height': 6,
            'autoResize': true
           },
          'resizable': {
            'disabled': true
          }
        }
      },
      'gridster': {
        'mobileModeEnabled': false,
        'columns': 6,
        'margins': [10,10],
        'outerMargin': false,
        'draggable': {
          'enabled': false,
        }
      },
      'widgets': [{ // Four Widgets and a title in Queue B
        'id': '00000000-0000-0000-000000000045',
        'type': 'title',
        'config': {
          'ui': {
            'size': {
              'width': 6,
              'height': 1
            },
            'resizable' : {
              'disabled': true
            }
          }
        },
        'chart': {
          'data': 'Billing'
        }
      }, {
        'id': '00000000-0000-0000-000000000007',
        'type': 'gauge',
        'config': {
          'statistic': {
            'type': 'Service Level',
            'aggregationFn': 'avg'
          },
          'timeseries': {
            'bucketSize': 15,
            'bucketSizeUnit': 'seconds'
          },
          'refreshRate': {
            'interval': 10,
            'intervalUnit': 'seconds'
          },
          'ui': {
            'title': {
              'show': true,
              'text': 'Service Level'
            },
            'size': {
              'width': 6,
              'height': 6
            }
          }
        },
        'chart': {
          'axis': {
            'x': {
              'show': true,
              'label': false
            },
            'y': {
              'show': true,
              'label': false
            }
          },
          'data': {
            'type': 'gauge',
            'columns': [
              [
                'Service Level',
                37
              ]
            ]
          }
        }
      }, {
        'id': '00000000-0000-0000-000000000008',
        'type': 'statistic',
        'config': {
          'statistic': {
            'type': 'SLA',
            'aggregationFn': 'max'
          },
          'refreshRate': {
            'interval': 5,
            'intervalUnit': 'seconds'
          },
          'ui': {
            'title': {
              'show': true,
              'text': 'Average Wait Time (min)'
            },
            'size': {
              'width': 3,
              'height': 4
            }
          }
        },
        'chart': {
          'data': 0.1,
          'indicator': {
            'threshold': 5.5
          }
        }
      }, {
        'id': '00000000-0000-0000-000000000009',
        'type': 'statistic',
        'config': {
          'statistic': {
            'type': 'SLA',
            'aggregationFn': 'max'
          },
          'refreshRate': {
            'interval': 5,
            'intervalUnit': 'seconds'
          },
          'ui': {
            'title': {
              'show': true,
              'text': 'Max Talk Time (min)'
            },
            'size': {
              'width': 3,
              'height': 2,
              'maxHeight': 4,
              'minHeight': 2,
              'maxWidth': 6,
              'minWidth': 2
            }
          }
        },
        'chart': {
          'data': 0.1,
          'indicator': {
            'threshold': 5.5
          }
        }
      }, {
        'id': '00000000-0000-0000-000000000010',
        'type': 'statistic',
        'config': {
          'statistic': {
              'type': 'SLA',
              'aggregationFn': 'max'
          },
          'refreshRate': {
              'interval': 5,
              'intervalUnit': 'seconds'
          },
          'ui': {
            'title': {
              'show': true,
              'text': 'Max Talk Time (min)'
            },
            'size': {
              'width': 3,
              'height': 2,
              'maxHeight': 6,
              'minHeight': 2,
              'maxWidth': 6,
              'minWidth': 2
            }
          }
        },
        'chart': {
          'data': 0.1,
          'indicator': {
            'threshold': 5.5
          }
        }
      }]
    }, {
        'id': '00000000-0000-0000-000000000011',
        'type': 'table',
        'config': {
          'refreshRate': {
            'interval': 5,
            'intervalUnit': 'seconds'
          },
          'ui': {
            'title': {
              'show': true,
              'text': 'Queue Overview'
            },
            'size': {
              'width': 6,
              'height': 2,
              'maxHeight': 8,
              'minHeight': 2,
              'maxWidth': 6,
              'minWidth': 6
            }
          }
        },
        'chart': {
          'data': {
            'headers': [
              'Queue',
              'AWT',
              '# Agents'
            ], 
            'rows': [
              [
                'Support',
                '4.30',
                '65'
              ], [
                'Sales',
                '2.10',
                '55'
              ], [
                'Retention',
                '1.55',
                '21'
              ], [
                'Accounts Receivable',
                '2.50',
                '32'
              ], [
                'Premium Support',
                '1.30',
                '11'
              ], [
                'Level A Support',
                '3.40',
                '8'
              ]
            ]
          }
        }
      }]
  }, {
    'name': 'Groups',
    'order': 1,
    'type': 'grid',
    'id': '00000000-0000-0000-000000000012',
    'gridster': {
      'mobileModeEnabled': false,
      'columns': 6,
      'margins': [10, 25],
      'outerMargin': false,
      'draggable': {
        'enabled': false
      },
      'resizable': {
        'enabled': true,
        'axes': 'y'
      }
    },
    'config': {
      'ui': {
        'size': {
          'width': 8,
          'maxWidth': 8,
          'minWidth': 8,
          'height': 10,
          'autoResize': true
        }
      }
    },
    'widgets': [{ 
      'name': 'Group A',
      'order': 0,
      'type': 'grid',
      'id': '00000000-0000-0000-000000000013',
      'config': {
        'ui': {
          'size': {
            'width': 2,
            'height': 6,
            'autoResize': true
          },
          'resizable': {
            'disabled': true
          }
        }
      },
      'gridster': {
        'mobileModeEnabled': false,
        'columns': 6,
        'margins': [10, 10],
        'outerMargin': false,
        'draggable': {
          'enabled': false,
        }
      },
      'widgets': [{ // Three Widgets and a title in Group A
        'id': '00000000-0000-0000-000000000045',
        'type': 'title',
        'config': {
          'ui': {
            'size': {
              'width': 6,
              'height': 2
            },
            'resizable' : {
              'disabled': true
            }
          }
        },
        'chart': {
          'data': 'Level A'
        }
      }, { 
        'id': '00000000-0000-0000-000000000014',
        'type': 'statistic',
        'config': {
          'statistic': {
            'type': 'SLA',
            'aggregationFn': 'max'
          },
          'refreshRate': {
            'interval': 5,
            'intervalUnit': 'seconds'
          },
          'ui': {
            'title': {
              'show': true,
              'text': 'Average Wait Time (min)'
            },
            'size': {
              'width': 6,
              'height': 6
            }
          }
        },
        'chart': {
          'data': 0.1,
          'indicator': {
            'threshold': 5.5
          }
        }
      }, {
          'id': '00000000-0000-0000-000000000015',
          'type': 'statistic',
          'config': {
            'statistic': {
              'type': 'SLA',
              'aggregationFn': 'max'
            },
            'refreshRate': {
              'interval': 5,
              'intervalUnit': 'seconds'
            },
            'ui': {
              'title': {
                'show': true,
                'text': 'Average Wait Time (min)'
              },
              'size': {
                'width': 6,
                'height': 6
              }
            }
          },
          'chart': {
            'data': 0.1,
            'indicator': {
              'threshold': 5.5
            }
          }
       }, {
          'id': '00000000-0000-0000-000000000016',
          'type': 'statistic',
          'config': {
            'statistic': {
              'type': 'SLA',
              'aggregationFn': 'max'
            },
            'refreshRate': {
              'interval': 5,
              'intervalUnit': 'seconds'
            },
            'ui': {
              'title': {
                'show': true,
                'text': 'Max Talk Time (min)'
              },
              'size': {
                'width': 6,
                'height': 4,
              }
            }
          },
          'chart': {
            'data': 0.1,
            'indicator': {
              'threshold': 5.5
            }
          }
      }] 
    }, {
      'name': 'Group B',
      'order': 0,
      'type': 'grid',
      'id': '00000000-0000-0000-000000000017',
      'gridster': {
        'mobileModeEnabled': false,
        'columns': 6,
        'margins': [10,10],
        'outerMargin': false,
        'draggable': {
          'enabled': true
        },
        'resizable': {
          'enabled': true
        }
      },
      'config': {
        'ui': {
          'size': {
            'width': 2,
            'height': 6,
            'autoResize': true
          },
          'resizable': {
            'disabled': true
          }
        }
      },
      // Three widgets and title in Group B
      'widgets': [{
        'id': '00000000-0000-0000-000000000043',
        'type': 'title',
        'config': {
          'ui': {
            'size': {
              'width': 6,
              'height': 2
            },
            'resizable' : {
              'disabled': true
            }
          }
        },
        'chart': {
          'data': 'IT Support'
        }
      }, {
        'id': '00000000-0000-0000-000000000018',
        'type': 'statistic',
        'config': {
          'statistic': {
            'type': 'SLA',
            'aggregationFn': 'max'
          },
          'refreshRate': {
            'interval': 5,
            'intervalUnit': 'seconds'
          },
          'ui': {
            'size': {
              'width': 6,
              'height': 6
            }
          }
        },
        'chart': {
          'data': 0.1,
          'indicator': {
            'threshold': 5.5
          }
        }
      }, {
        'id': '00000000-0000-0000-000000000019',
        'type': 'statistic',
        'config': {
          'statistic': {
            'type': 'SLA',
            'aggregationFn': 'max'
          },
          'refreshRate': {
            'interval': 5,
            'intervalUnit': 'seconds'
          },
          'ui': {
            'title': {
              'show': true,
              'text': 'ATT'
            },
            'size': {
              'width': 6,
              'height': 6
            }
          }
        },
        'chart': {
          'data': 3.55,
          'indicator': {
            'threshold': 5.5
          }
        }
    }, {
        'id': '00000000-0000-0000-000000000020',
        'type': 'statistic',
        'config': {
          'statistic': {
            'type': 'SLA',
            'aggregationFn': 'max'
          },
          'refreshRate': {
            'interval': 5,
            'intervalUnit': 'seconds'
          },
          'ui': {
            'title': {
              'show': true,
              'text': 'Max Talk Time (min)'
            },
            'size': {
              'width': 6,
              'height': 4
            }
          }
        },
        'chart': {
          'data': 0.1,
          'indicator': {
            'threshold': 5.5
          }
        }
      }]
    }, {
        'id': '00000000-0000-0000-000000000021',
        'type': 'table',
        'config': {
          'refreshRate': {
            'interval': 6,
            'intervalUnit': 'seconds'
          },
          'ui': {
            'title': {
              'show': true,
              'text': 'Group Overview'
            },
            'size': {
              'width': 6,
              'height': 2,
              'minHeight': 2,
              'maxWidth': 6,
              'minWidth': 6
            }
          }
        },
        'chart': {
          'data': {
            'headers': [
              'Group',
              'ATT',
              'Ready'
            ], 
            'rows': [
              [
                'Sales',
                '4.30',
                '65'
              ], [
                'IT',
                '2.10',
                '55'
              ], [
                'French',
                '1.55',
                '21'
              ], [
                'Support Level A',
                '2.50',
                '32'
              ], [
                'Everyone',
                '1.30',
                '11'
              ]
            ]
          }
        }
    }, { 
        'name': 'Group C',
        'order': 0,
        'type': 'grid',
        'id': '00000000-0000-0000-000000000022',
        'gridster': {
          'mobileModeEnabled': false,
          'columns': 6,
          'margins': [10,10],
          'outerMargin': false,
          'draggable': {
            'enabled': false,
          }
        },
        'config': {
          'ui': {
            'size': {
              'width': 2,
              'height': 6,
              'autoResize': true
            },
            'resizable' : {
              'disabled': true
            }
          }
        },
        // Three Widgets and Title in Group C
        'widgets': [{
          'id': '00000000-0000-0000-000000000042',
          'type': 'title',
          'config': {
            'ui': {
              'size': {
                'width': 6,
                'height': 2
              },
              'resizable' : {
                'disabled': true
              }
            }
          },
          'chart': {
            'data': 'Retention'
          }
        }, {
          'id': '00000000-0000-0000-000000000023',
          'type': 'statistic',
          'config': {
            'statistic': {
              'type': 'SLA',
              'aggregationFn': 'max'
            },
            'refreshRate': {
              'interval': 5,
              'intervalUnit': 'seconds'
            },
            'ui': {
              'title': {
                'show': true,
                'text': 'Average Wait Time (min)'
              },
              'size': {
                'width': 6,
                'height': 6
              }
            }
          },
          'chart': {
            'data': 0.1,
            'indicator': {
              'threshold': 5.5
            }
          }
        }, {
            'id': '00000000-0000-0000-000000000024',
            'type': 'statistic',
            'config': {
              'statistic': {
                'type': 'SLA',
                'aggregationFn': 'max'
              },
              'refreshRate': {
                'interval': 5,
                'intervalUnit': 'seconds'
              },
              'ui': {
                'title': {
                  'show': true,
                  'text': 'Average Wait Time (min)'
                },
                'size': {
                  'width': 6,
                  'height': 6
                }
              }
            },
            'chart': {
              'data': 0.1,
              'indicator': {
                'threshold': 5.5
              }
            }
        }, {
            'id': '00000000-0000-0000-000000000025',
            'type': 'statistic',
            'config': {
              'statistic': {
                'type': 'SLA',
                'aggregationFn': 'max'
              },
              'refreshRate': {
                'interval': 5,
                'intervalUnit': 'seconds'
              },
              'ui': {
                'title': {
                  'show': true,
                  'text': 'Max Talk Time (min)'
                },
                'size': {
                  'width': 6,
                  'height': 4,
                }
              }
            },
            'chart': {
              'data': 0.1,
              'indicator': {
                'threshold': 5.5
              }
            }
        }] 
      }]
  }, {
    'name': 'Interactions',
    'order': 2,
    'type': 'grid',
    'id': '00000000-0000-0000-000000000026',
    'gridster': {
      'mobileModeEnabled': false,
      'columns': 6,
      'margins': [10,10],
      'outerMargin': false,
      'draggable': {
        'enabled': true
      },
      'resizable': {
        'enabled': true
      }
    },
    'config': {
      'ui': {
        'size': {
          'width': 8,
          'maxWidth': 8,
          'minWidth': 8,
          'height': 10,
          'autoResize': true
        },
        'position': {
          'row': 0,
          'col': 16 
        }
      }
    },
    'widgets': [{
      'id': '00000000-0000-0000-000000000043',
      'type': 'title',
      'config': {
        'ui': {
          'size': {
            'width': 6,
            'height': 1
          },
          'resizable' : {
            'disabled': true
          }
        }
      },
      'chart': {
        'data': 'Interactions'
      }
    }, {
      'id': '00000000-0000-0000-000000000027',
      'type': 'statistic',
      'config': {
        'statistic': {
          'type': 'SLA',
          'aggregationFn': 'max'
        },
        'refreshRate': {
          'interval': 5,
          'intervalUnit': 'seconds'
        },
        'ui': {
          'title': {
            'show': true,
            'text': 'Average Wait Time (min)'
          },
          'size': {
            'width': 2,
            'height': 2
          }
        }
      },
      'chart': {
        'data': 0.1,
        'indicator': {
          'threshold': 5.5
        }
      }
    }, {
      'id': '00000000-0000-0000-000000000028',
      'type': 'statistic',
      'config': {
        'statistic': {
          'type': 'SLA',
          'aggregationFn': 'max'
        },
        'refreshRate': {
          'interval': 5,
          'intervalUnit': 'seconds'
        },
        'ui': {
          'title': {
            'show': true,
            'text': 'Average Wait Time (min)'
          },
          'size': {
            'width': 2,
            'height': 2
          }
        }
      },
        'chart': {
          'data': 0.1,
          'indicator': {
            'threshold': 5.5
          }
        }
    }, {
      'id': '00000000-0000-0000-000000000029',
      'type': 'statistic',
      'config': {
        'statistic': {
          'type': 'SLA',
          'aggregationFn': 'max'
        },
        'refreshRate': {
          'interval': 5,
          'intervalUnit': 'seconds'
        },
        'ui': {
          'title': {
            'show': true,
            'text': 'Average Wait Time (min)'
          },
          'size': {
            'width': 2,
            'height': 2
          }
        }
      },
      'chart': {
        'data': 0.1,
        'indicator': {
          'threshold': 5.5
        }
      }
    }, {
      'id': '00000000-0000-0000-000000000030',
      'type': 'statistic',
      'config': {
        'statistic': {
          'type': 'SLA',
          'aggregationFn': 'max'
        },
        'refreshRate': {
          'interval': 5,
          'intervalUnit': 'seconds'
        },
        'ui': {
          'title': {
            'show': true,
            'text': 'Average Wait Time (min)'
          },
          'size': {
            'width': 4,
            'height': 2
          }
        }
      },
      'chart': {
        'data': 0.1,
        'indicator': {
          'threshold': 5.5
        }
      }
    }, {
      'id': '00000000-0000-0000-000000000031',
      'type': 'statistic',
      'config': {
        'statistic': {
          'type': 'SLA',
          'aggregationFn': 'max'
        },
        'refreshRate': {
          'interval': 5,
          'intervalUnit': 'seconds'
        },
        'ui': {
          'title': {
            'show': true,
            'text': 'Average Wait Time (min)'
          },
          'size': {
            'width': 2,
            'height': 1
          }
        }
      },
      'chart': {
        'data': 0.1,
        'indicator': {
          'threshold': 5.5
        }
      }
    }, {
      'id': '00000000-0000-0000-000000000032',
      'type': 'statistic',
      'config': {
        'statistic': {
          'type': 'SLA',
          'aggregationFn': 'max'
        },
        'refreshRate': {
          'interval': 5,
          'intervalUnit': 'seconds'
        },
        'ui': {
          'title': {
            'show': true,
            'text': 'Average Wait Time (min)'
          },
          'size': {
            'width': 2,
            'height': 1
          }
        }
      },
      'chart': {
        'data': 0.1,
        'indicator': {
          'threshold': 5.5
        }
      }
      }]
  }]
});