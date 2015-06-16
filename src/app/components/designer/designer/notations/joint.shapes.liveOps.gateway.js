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
            fill: '#ffffff',
            stroke: '#27AAE1'
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
              {value: 'inclusive', content: 'Inclusive'},
              {value: 'exclusive', content: 'Exclusive'}
            ],
            label: 'Type',
            group: 'general',
            index: 1
          },
          thing: {
            type: 'text',
            label: 'thing',
            group: 'general',
            when: {
              eq: {
                gatewayType: 'exclusive'
              }
            }
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
        case 'inclusive':
          cell.set('icon', 'plus');
          break;
        case 'exclusive':
          cell.set('icon', 'cross');
          break;
        default:
          throw 'BPMN: Unknown Gateway Type: ' + type;
      }
    }
  }).extend(joint.shapes.liveOps.IconInterface);
})();
