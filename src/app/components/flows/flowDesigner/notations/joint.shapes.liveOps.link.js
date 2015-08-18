(function() {
  'use strict';
  joint.shapes.liveOps = joint.shapes.liveOps || {};
  joint.shapes.liveOps.link = joint.dia.Link.extend({

    defaults: {

      type: 'liveOps.link',

      attrs: {

        '.marker-source': {
          d: 'M 0 0'
        },
        '.marker-target': {
          d: 'M 10 0 L 0 5 L 10 10 z',
          fill: '#000000'
        },
        '.connection': {
          'stroke-dasharray': ' ',
          'stroke-width': 1
        },
        '.connection-wrap': {
          style: '',
          onMouseOver: '',
          onMouseOut: ''
        },
        '.tool-options': {
          visibility: 'hidden'
        }
      },

      labels: [],

      linkType: 'normal',

      inputs: [{
        name: 'label',
        path: 'label',
        type: 'string',
        label: 'Label',
        group: 'general',
        index: 0,
        disabled: false,
        required: false,
        placeholder: 'Enter a label...',
        hidden: false}]
    },

    initialize: function() {
      joint.dia.Link.prototype.initialize.apply(this, arguments);

      this.listenTo(this, 'change:source', this.onSourceChange);

      this.listenTo(this, 'change:linkType', this.onLinkTypeChange);
      this.onLinkTypeChange(this, this.get('linkType'));
    },

    onSourceChange: function(cell, source) {
      if (!source || !source.id) {return;}

      joint.util.nextFrame(function() {
        if (!cell.collection) {return;}
        var _source = cell.collection.get(source);

        if (_source.get('type') === 'liveOps.gateway' && _source.get('gatewayType') === 'exclusive') {
          cell.set('linkType', 'conditional');
        } else {
          cell.set('linkType', 'normal');
        }

        return cell.collection.get(source).get('type') === 'liveOps.event';
      });
    },

    onLinkTypeChange: function(cell, type) {

      var attrs;

      switch (type) {

      case 'default':

        attrs = {
          '.marker-source': {
            d: 'M 0 5 L 20 5 M 20 0 L 10 10',
            fill: 'none'
          },
          '.tool-options': {
            visibility: 'visible'
          }
        };
        break;

      case 'conditional':

        attrs = {
          '.marker-source': {
            d: 'M 20 8 L 10 0 L 0 8 L 10 16 z',
            fill: '#FFF'
          },
          '.tool-options': {
            visibility: 'visible'
          }
        };

        break;

      case 'normal':

        attrs = {};

        break;

      case 'message':

        attrs = {
          '.marker-target': {
            fill: '#FFF'
          },
          '.connection': {
            'stroke-dasharray': '4,4'
          }
        };

        break;

      case 'association':

        attrs = {
          '.marker-target': {
            d: 'M 0 0'
          },
          '.connection': {
            'stroke-dasharray': '4,4'
          }
        };

        break;

      case 'conversation':

        // The only way how to achieved 'spaghetti insulation effect' on links is to
        // have the .connection-wrap covering the inner part of the .connection.
        // The outer part of the .connection then looks like two parallel lines.
        attrs = {
          '.marker-target': {
            d: 'M 0 0'
          },
          '.connection': {
            'stroke-width': '7px'
          },
          '.connection-wrap': {
            // As the css takes priority over the svg attributes, that's only way
            // how to overwrite default jointjs styling.
            style: 'stroke: #fff; stroke-width: 5px; opacity: 1;',
            onMouseOver: 'var s=this.style;s.stroke="#000";s.strokeWidth=15;s.opacity=.4',
            onMouseOut: 'var s=this.style;s.stroke="#fff";s.strokeWidth=5;s.opacity=1'
          }
        };

        break;

      default:

        throw 'BPMN: Unknown Flow Type: ' + type;
      }

      cell.attr(_.merge({}, this.defaults.attrs, attrs));
    },

    onInputChange: function(cell, value, path) {
      cell.label(0, {
        position: .5,
        attrs: {
          rect: {fill: 'white'},
          text: {text: value}
        }
      });
    }
  })
})();
