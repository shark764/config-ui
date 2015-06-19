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
      terminating: false,
      icon: 'none',
      inputs: {
        eventType: {
          type: 'select',
          options: ['start', 'end', 'catch'],
          group: 'general',
          label: 'Type',
          index: 1
        },
        icon: {
          type: 'select',
          options: ['terminate', 'error', 'signal', 'escalation'],
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
        terminating: {
          type: 'toggle',
          group: 'general',
          label: 'Terminating',
          when: {
            eq: {
              'eventType': 'catching'
            }
          }
        }
      }
    }, joint.dia.Element.prototype.defaults),
    initialize: function() {
      joint.dia.Element.prototype.initialize.apply(this, arguments);
      this.listenTo(this, 'change:eventType', this.onEventTypeChange);
      this.onEventTypeChange(this, this.get('eventType'));
      this.listenTo(this, 'change:interrupting', this.onInterruptingChange);
      this.onInterruptingChange(this, this.get('interrupting'));
      this.listenTo(this, 'change:parent', this.onParentChange);
      this.onParentChange(this, this.get('parent'));
    },

    onParentChange: function(cell, parent) {
      if (parent) {
        this.resize(30, 30);
        this.set('z', 2);
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
          break;
        case 'catch':
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
          break;
        default:
          throw 'BPMN: Unknown Event Type: ' + type;
      }
    }
  }).extend(joint.shapes.liveOps.IconInterface);
})();