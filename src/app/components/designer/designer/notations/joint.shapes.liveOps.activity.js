(function() {
  'use strict';

  joint.shapes.liveOps.activity = joint.shapes.basic.TextBlock.extend({
    markup: ['<g class="rotatable">',
             '<g class="scalable"><rect class="body outer"/><rect class="body inner"/></g>',
             '<switch>',
             // if foreignObject supported
             '<foreignObject requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" class="fobj">',
             '<body xmlns="http://www.w3.org/1999/xhtml"><div/></body>',
             '</foreignObject>',
             // else foreignObject is not supported (fallback for IE)
             '<text class="content"/>',
             '</switch><path class="sub-process"/><image class="icon"/></g>'].join(''),
    defaults: joint.util.deepSupplement({
      size:{
        height: 54,
        width: 85
      },
      type: 'liveOps.activity',
      attrs: {
        rect: {
          rx: 8,
          ry: 8,
          width: 100,
          height: 100
        },
        '.body': {
          fill: '#ffffff',
          stroke: '#27AAE1'
        },
        '.inner': {
          transform: 'scale(0.9,0.9) translate(5,5)'
        },
        path: {
          d: 'M 0 0 L 20 0 20 20 0 20 z M 10 4 L 10 16 M 4 10 L 16 10',
          ref: '.inner',
          'ref-x': 0.5,
          'ref-dy': -20,
          'x-alignment': 'middle',
          stroke: '#000000',
          fill: 'transparent'
        },
        image: {
          ref: '.inner',
          'ref-x': 5,
          width: 20,
          height: 20
        }
      },
      activityType: 'task',
      icon: 'none',
      name: '',
      inputs: {
        activityType: {
          type: 'select',
          options: ['task', 'event-sub-process', 'call-activity'],
          label: 'Type',
          group: 'general',
          index: 3
        },
        subProcess: {
          type: 'toggle',
          label: 'Sub-process',
          group: 'general',
          index: 4
        }
      }
    }, joint.shapes.basic.TextBlock.prototype.defaults),
    initialize: function() {
      var self = this;
      joint.shapes.basic.TextBlock.prototype.initialize.apply(this, arguments);

      this.listenTo(this, 'change:subProcess', this.onSubProcessChange);
      this.onSubProcessChange(this, this.get('subProcess'));
      this.listenTo(this, 'change:activityType', this.onActivityTypeChange);
      this.onActivityTypeChange(this, this.get('activityType'));
      this.listenTo(this, 'change:embeds', this.onEmbedsChange);
      this.onEmbedsChange(this, this.get('embeds'))

    },

    onEmbedsChange: function(cell, embeds) {
      if (embeds) {
        // Position the embedded cells (since this is relative
        // To the parents position)
        var box = cell.getBBox();
        joint.util.nextFrame(function() {
          _.forEach(cell.getEmbeddedCells(), function(child) {
            if (!child) return;
            child.set('position',
            {
              x: (box.x + box.width) - 15,
              y: (box.y + box.height) - 15
            });
          })
        })

      }
    },

    onActivityTypeChange: function(cell, type) {
      switch (type) {
        case 'task':
          cell.attr({
            '.inner': {
              visibility: 'hidden'
            },
            '.outer': {
              'stroke-width': 1,
              'stroke-dasharray': 'none'
            },
            path: {
              ref: '.outer'
            },
            image: {
              ref: '.outer'
            }
          });
          break;

        case 'event-sub-process':
          cell.attr({
            '.inner': {
              visibility: 'hidden'
            },
            '.outer': {
              'stroke-width': 1,
              'stroke-dasharray': '1,2'
            },
            path: {
              ref: '.outer'
            },
            image: {
              ref: '.outer'
            }
          });
          break;

        case 'call-activity':
          cell.attr({
            '.inner': {
              visibility: 'hidden'
            },
            '.outer': {
              'stroke-width': 5,
              'stroke-dasharray': 'none'
            },
            path: {
              ref: '.outer'
            },
            image: {
              ref: '.outer'
            }
          });
          break;

        default:
          throw "BPMN: Unknown Activity Type: " + type;
      }
    },
    onSubProcessChange: function(cell, subProcess) {
      // Although that displaying sub-process icon is implemented in the interface
      // we want also to reposition text and image when sub-process is shown.
      if (subProcess) {
        cell.attr({
          '.fobj div': {
            style: {
              verticalAlign: 'baseline',
              paddingTop: 10
            }
          },
          image: {
            'ref-dy': -25,
            'ref-y': ''
          },
          text: { // IE fallback only
                'ref-y': 25
              }
        });
      } else {
        cell.attr({
          '.fobj div': {
            style: {
              verticalAlign: 'middle',
              paddingTop: 0
            }
          },
          image: {
            'ref-dy': '',
            'ref-y': 5
          },
          text: { // IE fallback only
            'ref-y': 0.5
          }
        });
      }
    }
  }).extend(joint.shapes.liveOps.IconInterface).extend(joint.shapes.liveOps.SubProcessInterface);
})();
