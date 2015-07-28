(function() {
  'use strict';

  joint.shapes.liveOps = joint.shapes.liveOps || {};
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
          fill: {
            type: 'linearGradient',
            stops: [
              {offset: '0%', color: '#FFFFFF'},
              {offset: '100%', color: '#F6FBFF'}
            ],
            attrs: {
              x1: '0%',
              y1: '0%',
              x2: '0%',
              y2: '90%'
            }
          },
          stroke: '#0090CC'
        },
        '.inner': {
          visibility: 'hidden',
          transform: 'scale(0.9,0.9) translate(5,5)'
        },
        '.outer': {
          'stroke-width': 1.5,
          'stroke-dasharray': 'none'
        },
        path: {
          d: 'M 0 0 L 20 0 20 20 0 20 z M 10 4 L 10 16 M 4 10 L 16 10',
          ref: '.outer',
          'ref-x': 0.5,
          'ref-dy': -20,
          'x-alignment': 'middle',
          stroke: '#000000',
          fill: 'transparent'
        },
        image: {
          ref: '.outer',
          'ref-x': 5,
          width: 20,
          height: 20
        }
      },
      activityType: 'task',
      icon: 'none',
      name: '',
      params: {},
      inputs: [{
        name: 'type',
        path: 'activityType',
        type: 'select',
        label: 'Task Type',
        group: 'general',
        index: 0,
        disabled: false,
        required: true,
        placeholder: null,
        defaultsTo: null,
        hidden: false,
        dataSensitivity: 'low',
        options: [{
          value: 'task',
          content: 'Task'
        }, {
          value: 'event-sub-process',
          content: 'Event-sub-process'
        }, {
          value: 'call-activity',
          content: 'Call-activity'
        }]
      }]
    }, joint.shapes.basic.TextBlock.prototype.defaults),
    initialize: function() {
      joint.shapes.basic.TextBlock.prototype.initialize.apply(this, arguments);
      this.listenTo(this, 'change:embeds', this.onEmbedsChange);
      this.onEmbedsChange(this, this.get('embeds'));
    },
    onEmbedsChange: function(cell, embeds) {
      if (embeds) {
        // Position the embedded cells (since this is relative
        // To the parents position)
        cell.set('z', 2);
        var box = cell.getBBox();
        joint.util.nextFrame(function() {
          _.forEach(cell.getEmbeddedCells(), function(child, index) {
            if (!child) {return;}

            if (index === 0) {
              child.set('position',
              {
                x: (box.x + box.width) - 15,
                y: (box.y + box.height) - 15
              });
            }else if (index === 1) {
              child.set('position',
              {
                x: (box.x + box.width) - 15,
                y: (box.y) - 15
              });
            } else if (index === 2) {
              child.set('position',
              {
                x: (box.x) - 15,
                y: (box.y + box.height) - 15
              });
            } else if (index === 3) {
              child.set('position',
              {
                x: (box.x) - 15,
                y: (box.y) - 15
              });
            }
          });
        });
      }
    },
    onInputChange: function(model, value, path) {
      if (path === 'activityType') {
        switch (value) {
          case 'task':
            model.attr({
              '.inner': {
                visibility: 'hidden'
              },
              '.outer': {
                'stroke-width': 1.5,
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
            model.attr({
              '.inner': {
                visibility: 'hidden'
              },
              '.outer': {
                'stroke-width': 1.5,
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
            model.attr({
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
            console.warn('BPMN: Unknown Activity Type: ' + value);
        }
      } else {
        console.warn('This property is not hooked up to a UI listener.');
      }
    }
  }).extend(joint.shapes.liveOps.IconInterface).extend(joint.shapes.liveOps.SubProcessInterface);
})();