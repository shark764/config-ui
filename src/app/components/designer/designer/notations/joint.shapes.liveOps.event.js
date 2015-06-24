(function() {
  'use strict';

  joint.shapes.liveOps = joint.shapes.liveOps || {};
  joint.shapes.liveOps.event = joint.dia.Element.extend({
    markup: ['<g class="rotatable">',
             '<g class="scalable">',
             '<circle class="body outer"/>',
             '<circle class="body inner"/>',
             '<image/></g><text class="label"/></g>'].join(''),
    defaults: joint.util.deepSupplement({
      type: 'liveOps.event',
      size: {width: 60, height: 60},
      attrs: {
        '.body': {
          fill: '#ffffff',
          stroke: '#000000'
        },
        '.outer': {
          'stroke-width': 1.5,
          r:30,
          transform: 'translate(30,30)'
        },
        '.inner': {
          'stroke-width': 1.5,
          r: 26,
          transform: 'translate(30,30)',
          'stroke': '#F2C208',
          'fill-opacity': 0.0
        },
        image: {
          width:  40, height: 40, 'xlink:href': '', transform: 'translate(10,10)'
        },
        'image polygon': {
          fill: '#ff00ff'
        },
        '.label': {
          text: '',
          fill: '#000000',
          'font-family': 'Arial', 'font-size': 14,
          ref: '.outer', 'ref-x': 0.5, 'ref-dy': 20,
          'x-alignment': 'middle', 'y-alignment': 'middle'
        }
      },
      eventType: 'start',
      interrupting: true,
      throwing: false,
      terminate: false,
      icon: 'none',
      inputs: {
        eventType: {
          type: 'select',
          options: [
            {
              value: 'start',
              content: 'Start'
            },
            {
              value: 'intermediate',
              content: 'Intermediate'
            },
            {
              value: 'end',
              content: 'End'
            }
          ],
          group: 'general',
          label: 'Type',
          index: 1
        },
        eventName: {
          type: 'select',
          options: [
            {
              value: 'none',
              content: 'None'
            },
            {
              value: 'terminate',
              content: 'Terminate'
            },
            {
              value: 'error',
              content: 'Error'
            },
            {
              value: 'signal',
              content: 'Signal'
            }
          ],
          group: 'general',
          label: 'Event Name',
          index: 2
        },
        interrupting: {
          type: 'toggle',
          group: 'general',
          label: 'Interrupting',
          index: 3,
          when: {
            ne: {
              'eventType': 'end'
            }
          }
        },
        throwing: {
          type: 'toggle',
          group: 'general',
          label: 'Throwing',
          when: {
            eq: {
              'eventType': 'intermediate'
            }
          }
        },
        target: {
          type: 'text',
          group: 'general',
          label: 'Target',
          when: {
            and: [
              {
                eq: {
                  'eventName': 'signal'
                }
              },
              {
                eq: {
                  'throwing': false
                }
              }

            ]
          }
        },
        event: {
          type: 'object',
          group: 'general',
          label: 'Event',
          properties: {
            name: {
              label: 'Signal Name',
              type: 'text'
            },
            params: {
              label: 'Params',
              type: 'list',
              item: {
                type: 'object',
                properties: {
                  key: {
                    label: 'Key',
                    type: 'text'
                  },
                  value: {
                    label: 'Value',
                    type: 'text'
                  }
                }
              }
            }
          },
          when: {
            and: [
              {
                eq: {
                  'eventName': 'signal'
                }
              },
              {
                eq: {
                  'throwing': true
                }
              }

            ]
          }
        },
        bindings: {
          type: 'list',
          label: 'Bindings',
          group: 'bindings',
          item: {
            type: 'object',
            properties: {
              key: {
                label: 'Key',
                type: 'text'
              },
              value: {
                label: 'Value',
                type: 'text'
              }
            }
          },
          when: {
            and: [
              {
                eq: {
                  'eventName': 'signal'
                }
              },
              {
                eq: {
                  'throwing': false
                }
              }

            ]
          }
        }
      }
    }, joint.dia.Element.prototype.defaults),
    initialize: function() {
      joint.dia.Element.prototype.initialize.apply(this, arguments);
      this.listenTo(this, 'change:eventType', this.onEventTypeChange);
      this.onEventTypeChange(this, this.get('eventType'));
      this.listenTo(this, 'change:eventName', this.updateIcon);
      this.listenTo(this, 'change:throwing', this.updateIcon);
      
      this.updateIcon(this);
      
      this.listenTo(this, 'change:interrupting', this.onInterruptingChange);
      this.onInterruptingChange(this, this.get('interrupting'));
      this.listenTo(this, 'change:parent', this.onParentChange);
      this.onParentChange(this, this.get('parent'));
    },

    updateIcon: function(cell) {
      var throwing = cell.get('throwing');
      var name = cell.get('eventName');
      if (throwing) {
        cell.set('icon', name + 'Throwing');
      } else {
        cell.set('icon', name);
      }

    },

    onParentChange: function(cell, parent) {
      if (parent) {
        this.resize(30, 30);
        this.set('z', 20);

        //remove connecting links
        if (cell.collection) {
          var links = cell.collection.getConnectedLinks(cell, {inbound: true});
          _.each(links, function(link) {
            link.remove();
          });
        }

      } else {
        this.resize(70, 70);
      }
    },

    onInterruptingChange: function(cell, type) {
      switch (type){
        case true:
          cell.attr({
            '.inner': {
              'stroke-dasharray': 'none'
            },
            '.outer': {
              'stroke-dasharray': 'none'
            }
          });
          break;
        case false:
          cell.attr({
            '.inner': {
              'stroke-dasharray': '4,2'
            },
            '.outer': {
              'stroke-dasharray': '4,2'
            }
          });
          break;
      }
    },
    onEventTypeChange: function(cell, type) {
      switch (type) {
        case 'start':
          cell.attr({
            '.inner': {
              visibility: 'hidden'
            },
            '.outer': {
              'stroke-width': 1.5,
              'stroke': '#1EC16B',
              'fill': {
                type: 'linearGradient',
                stops: [
                  {offset: '0%', color: '#FFFFFF'},
                  {offset: '100%', color: '#EFFEF7'}
                ],
                attrs: {
                  x1: '0%',
                  y1: '0%',
                  x2: '0%',
                  y2: '90%'
                }
              }
            }
          });
          cell.set('throwing', false);
          cell.set('terminate', false);
          break;
        case 'end':
          cell.attr({
            '.inner': {
              visibility: 'hidden'
            },
            '.outer': {
              'stroke-width': 3,
              'stroke': '#C2402A',
              'fill': {
                type: 'linearGradient',
                stops: [
                  {offset: '0%', color: '#FFFFFF'},
                  {offset: '100%', color: '#F4D3CC'}
                ],
                attrs: {
                  x1: '0%',
                  y1: '0%',
                  x2: '0%',
                  y2: '90%'
                }
              }
            }
          });
          cell.set('throwing', true);
          cell.set('terminate', true);
          break;
        case 'intermediate':
          cell.attr({
            '.inner': {
              visibility: 'visible'
            },
            '.outer': {
              'stroke-width': 1.5,
              'stroke': '#F2C208',
              'fill': {
                type: 'linearGradient',
                stops: [
                  {offset: '0%', color: '#FFFFFF'},
                  {offset: '100%', color: '#f9edbb'}
                ],
                attrs: {
                  x1: '0%',
                  y1: '0%',
                  x2: '0%',
                  y2: '90%'
                }
              }
            }
          });
          cell.set('terminate', false);
          break;
        default:
          throw 'BPMN: Unknown Event Type: ' + type;
      }
    }
  }).extend(joint.shapes.liveOps.IconInterface);
})();
