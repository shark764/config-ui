(function() {
  'use strict';

  joint.shapes.liveOps = joint.shapes.liveOps || {};
  joint.shapes.liveOps.gateway = joint.dia.Element.extend({
    markup: ['<g class="rotatable">',
             '<g class="scalable">',
             '<polygon class="body"/>',
             '<image/></g></g><text class="label"/>'].join(''),
    defaults: joint.util.deepSupplement({
      type: 'liveOps.gateway',
      size: {width: 80, height: 80},
      attrs: {
          '.body': {
            points: '40,0 80,40 40,80 0,40',
            fill: {
              type: 'linearGradient',
              stops: [
                {offset: '0%', color: '#FFFFFF'},
                {offset: '100%', color: '#E8E3E7'}
              ],
              attrs: {
                x1: '0%',
                y1: '0%',
                x2: '0%',
                y2: '90%'
              }
            },
            stroke: '#E693E5',
            'stroke-width': 1.5
          },
          '.label': {
            text: '',
            ref: '.body',
            'ref-x': 0.5,
            'ref-dy': 20,
            'y-alignment': 'middle',
            'x-alignment': 'middle',
            'font-size': 14,
            'font-family': 'Arial, helvetica, sans-serif',
            fill: '#000000'
          },
          image: {
            width:  40, height: 40, 'xlink:href': '', transform: 'translate(20,20)'
          }
        },
      icon: 'plus',
      gatewayType: 'inclusive',
      inputs: {
          gatewayType: {
            type: 'select',
            options: [
              {value: 'parallel', content: 'Parallel'},
              {value: 'exclusive', content: 'Exclusive'},
              {value: 'event', content: 'Event'}
            ],
            label: 'Type',
            group: 'general',
            index: 1
          }
        }
    }, joint.dia.Element.prototype.defaults),
    initialize: function() {
      joint.dia.Element.prototype.initialize.apply(this, arguments);
      this.listenTo(this, 'change:gatewayType', this.onGatewayTypeChange);
      this.onGatewayTypeChange(this, this.get('gatewayType'));
    },
    onGatewayTypeChange: function(cell, type) {
      switch (type){
        case 'parallel':
          cell.set('icon', 'plus');
          break;
        case 'exclusive':
          cell.set('icon', 'cross');
          break;
        case 'event':
          cell.set('icon', 'event');
          cell.attr({
            image: {
              width:  50, height: 50, 
              transform: 'translate(15,15)'
            }
          })
          break;
        default:
          throw 'BPMN: Unknown Gateway Type: ' + type;
      }
    },

    updateLinks: function(cell, type) {
      if (!cell.collection) {return;}
      var links;
      joint.util.nextFrame(function() {
        if (type === 'exclusive') {
          links = cell.collection.getConnectedLinks(cell, {outbound: true});
          _.each(links, function(link) {
            if (link.prop('target/id') === cell.get('default')) {
              link.set('linkType', 'default');
            } else {
              link.set('linkType', 'conditional');
            }
          });
        } else if (type === 'inclusive') {
          links = cell.collection.getConnectedLinks(cell, {outbound: true});
          _.each(links, function(link) {
            link.set('linkType', 'normal');
          });
        } else if (type === 'event') {
          links = cell.collection.getConnectedLinks(cell, {outbound: true});
          _.each(links, function(link) {
            link.set('linkType', 'normal');
          });
        }
      });
    }
  }).extend(joint.shapes.liveOps.IconInterface);
})();
