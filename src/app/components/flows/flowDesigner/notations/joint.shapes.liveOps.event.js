(function() {
  'use strict';

  joint.shapes.liveOps = joint.shapes.liveOps || {};
  joint.shapes.liveOps.event = joint.dia.Element.extend({
    markup: ['<g class="rotatable">',
             '<g class="scalable">',
             '<circle class="body outer"/>',
             '<circle class="body inner"/>',
             '<image/>',
             '<rect class="border" />',
             '</g><text class="label"/></g>'].join(''),
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
        '.border': {
          fill: 'none',
          stroke: 'none',
          width: 60,
          height: 60
        },
        image: {
          width: 40,
          height: 40,
          'xlink:href': '',
          transform: 'translate(10,10)'
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
      interrupting: true,
      terminate: false,
      icon: 'none'
    }, joint.dia.Element.prototype.defaults),
    initialize: function() {
      joint.dia.Element.prototype.initialize.apply(this, arguments);
      this.listenTo(this, 'change:entity', this.updateGroup);
      this.listenTo(this, 'change:terminate', this.updateGroup);
      this.updateGroup(this);

      this.listenTo(this, 'change:name', this.updateIcon);
      this.listenTo(this, 'change:entity', this.updateIcon);

      this.updateIcon(this);

      this.listenTo(this, 'change:interrupting', this.onInterruptingChange);
      this.onInterruptingChange(this, this.get('interrupting'));

      this.listenTo(this, 'change:group', this.onGroupChange);
      this.onGroupChange(this, this.get('group'));

      this.listenTo(this, 'change:parent', this.onParentChange);
      this.onParentChange(this, this.get('parent'));
    },

    updateGroup: function(cell) {
      var terminate = cell.get('terminate'),
          entity = cell.get('entity');
      if (entity === 'start') {
        cell.set('group', 'start');
      } else if (entity === 'catch' || (entity === 'throw' && !terminate)) {
        cell.set('group', 'intermediate');
      } else if (entity === 'throw' && terminate) {
        cell.set('group', 'end');
      }
    },

    updateIcon: function(cell) {
      var entity = cell.get('entity');
      var name = cell.get('name');
      if (entity === 'throw') {
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

    onGroupChange: function(cell, type) {
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
          break;
        default:
          throw 'BPMN: Unknown Event Type: ' + type;
      }
    },
    onInputChange: function() {
      // console.warn('This property is not hooked up to a UI listener.');
    }
  }).extend(joint.shapes.liveOps.IconInterface);
})();
