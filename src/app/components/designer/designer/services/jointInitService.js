(function() {
  'use strict';

  function JointInitService () {
    return {
      graph: function() {
        return new joint.dia.Graph();
      },
      commandManager: function(graph) {
        return new joint.dia.CommandManager({
          graph: graph
        });
      },
      selector: function() {
        return new Backbone.Collection();
      },
      clipboard: function() {
        return new joint.ui.Clipboard();
      },
      paper: function(graph, width, height, gridSize, perpendicularLinks, embeddingMode, frontParentOnly, defaultLink) {
        return new joint.dia.Paper({
          width: width,
          height: height,
          model: graph,
          gridSize: gridSize,
          perpendicularLinks: perpendicularLinks,
          embeddingMode: embeddingMode,
          frontParentOnly: frontParentOnly,
          defaultLink: defaultLink,
          validateEmbedding: function(childView, parentView) {
            var Pool = joint.shapes.bpmn.Pool;
            return (parentView.model instanceof Pool) && !(childView.model instanceof Pool);
          },
          validateConnection: function(cellViewS, magnetS, cellViewT, magnetT, end) {
            if (cellViewS === cellViewT) { return false; }
            var view = end === 'target' ? cellViewT : cellViewS;
            if (view instanceof joint.dia.LinkView) { return false; }
            return true;
          },
        });
      },
      scroller: function(paper, padding, autoResizePaper) {
        return new joint.ui.PaperScroller({
          autoResizePaper: autoResizePaper,
          padding: padding,
          paper: paper
        });
      },
      selectorView: function(graph, paper, selector, filterArray) {
        return new joint.ui.SelectionView({
          paper: paper,
          graph: graph,
          model: selector,
          filter: filterArray
        });
      },
      palette: function(graph, paper) {
        return new joint.ui.Stencil({
          graph: graph,
          paper: paper,
          search: {
            '*': ['content'],
          },
          groups: {
            activity: {
              label: 'Activities',
              index: 1
            },
            events: {
              label: 'Events',
              index: 2
            },
            gateways: {
              label: 'Gateways',
              index: 3
            },
          }
        });
      },
      snapper: function(paper) {
        return new joint.ui.Snaplines({paper: paper});
      }
    };
  }

  angular.module('liveopsConfigPanel').service('JointInitService', JointInitService);
})();
