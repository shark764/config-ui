(function() {
  'use strict';

  joint.shapes.liveOps = joint.shapes.liveOps || {};
  joint.shapes.liveOps.template = joint.shapes.basic.TextBlock.extend({
    markup: ['<g class="rotatable">',
             '<g class="scalable">',
             '<rect class="body outer"/>',
             '<rect class="body inner"/>',
             '<rect class="border" /></g>',
             '<switch>',
             // if foreignObject supported
             '<foreignObject requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" class="fobj">',
             '<body xmlns="http://www.w3.org/1999/xhtml"><div/></body>',
             '</foreignObject>',
             // else foreignObject is not supported (fallback for IE)
             '<text class="content"/>',
             '</switch></g>'].join(''),
    defaults: joint.util.deepSupplement({
      size:{
        height: 54,
        width: 85
      },
      type: 'liveOps.template',
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
          stroke: '#DF8600'
        },
        '.inner': {
          visibility: 'hidden',
          transform: 'scale(0.9,0.9) translate(5,5)'
        },
        '.outer': {
          'stroke-width': 1.5,
          'stroke-dasharray': 'none'
        },
        '.border': {
          fill: 'none',
          stroke: 'none'
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
      name: '',
      icon: 'none',
      params: {},
      inputs: [],
    }, joint.shapes.basic.TextBlock.prototype.defaults),
    initialize: function() {
      joint.shapes.basic.TextBlock.prototype.initialize.apply(this, arguments);
    },
    onInputChange: function() {
      // console.warn('This property is not hooked up to a UI listener.');
    }
  }).extend(joint.shapes.liveOps.IconInterface).extend(joint.shapes.liveOps.SubProcessInterface);
})();
