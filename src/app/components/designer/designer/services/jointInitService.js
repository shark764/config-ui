(function() {
  'use strict';

  function JointInitService (FlowPaletteService, FlowNotationService) {
    return {
      graph: function(width, height, gridSize, perpendicularLinks, embeddingMode, frontParentOnly, defaultLink, scrollerPadding, autoResizePaper, selectorFilterArray, stencilContainerId, paperContainerId, inspectorContainerId) {
        var self = this;
        var graph = new joint.dia.Graph();
        graph.interfaces = {};
        graph.utils = {};
        graph.interfaces.commandManager = self.initializeCommandManager(graph);
        graph.interfaces.selector = self.initializeSelector();
        graph.interfaces.clipboard = self.initializeClipboard();
        graph.interfaces.paper = self.initializePaper(graph, width, height, gridSize, perpendicularLinks, embeddingMode, frontParentOnly, defaultLink);
        graph.interfaces.scroller = self.initializeScroller(graph.interfaces.paper, scrollerPadding, autoResizePaper);
        graph.interfaces.selectorView = self.initializeSelectorView(graph, graph.interfaces.paper, graph.interfaces.selector, selectorFilterArray);
        graph.interfaces.palette = self.initializePalette(graph, graph.interfaces.paper);
        graph.interfaces.snapper = self.initializeSnapper(graph.interfaces.paper);
        graph.interfaces.keyboardListeners = self.initializeKeyboardListeners(graph);
        graph.interfaces.flowPropertiesPanel = undefined;
        graph.interfaces.inspectorContainer = $(inspectorContainerId);

        /**
         * [ Palette Logic ]
         */
        graph.interfaces.palette.render().$el.appendTo(stencilContainerId);
        FlowPaletteService.loadGateways(graph.interfaces.palette);
        FlowPaletteService.loadEvents(graph.interfaces.palette);
        FlowPaletteService.loadActivities(graph.interfaces.palette);
        _.each(graph.interfaces.palette.graphs, function(graph) {
          joint.layout.GridLayout.layout(graph, {
            columns: 3,
            columnWidth: 95,
            rowHeight: 75,
            dy: 5,
            dx: 5,
            resizeToFit: true
          });
        });
        _.each(graph.interfaces.palette.papers, function(paper) {
          paper.fitToContent(0, 0, 10);
        });

        /**
         * [ Flow Scroller Logic ]
         */
        graph.interfaces.scroller.$el.appendTo(paperContainerId);

        /**
         * [ Flow Snapper Logic ]
         */
        graph.interfaces.snapper.startListening();


        /**
         * [ Properties Panel Logic  & Functions]
         */
        graph.utils.showPropertiesPanel = function() {
          graph.interfaces.inspectorContainer.css({'right': '0px'});
        };
        graph.utils.hidePropertiesPanel = function() {
          graph.interfaces.inspectorContainer.css({'right': '-300px'});
        };
        graph.utils.renderPropertiesPanel = function(cellView) {
          if (!graph.interfaces.flowPropertiesPanel || graph.interfaces.flowPropertiesPanel.options.cellView !== cellView) {
            graph.utils.showPropertiesPanel();
            if (graph.interfaces.flowPropertiesPanel) {
              graph.interfaces.flowPropertiesPanel.remove(); // Clean up the old properties panel if there was one
            }
            var type = cellView.model.get('type');
            graph.interfaces.flowPropertiesPanel = new joint.ui.Inspector({
              cell: cellView.model,
              inputs: FlowNotationService.buildInputPanel(cellView.model),
              groups: {
                general: {label: type, index: 1},
                appearance: {index: 2}
              }
            });
            $('#inspector-container').prepend(graph.interfaces.flowPropertiesPanel.render().el);
          } else {
            graph.utils.hidePropertiesPanel();
          }

          if (cellView.model instanceof joint.dia.Element && !graph.interfaces.selector.contains(cellView.model)) {
            new joint.ui.FreeTransform({cellView: cellView}).render();
            new joint.ui.Halo({
              cellView: cellView,
              boxContent: function(cellView) {
                return cellView.model.get('type');
              }
            }).render();
            graph.interfaces.selectorView.cancelSelection();
            graph.interfaces.selector.reset([cellView.model], { safe: true });
          }
        };

        /**
         * [ Flow Selector View Listeners ]
         */
        graph.interfaces.selectorView.on({
          'selection-box:pointerdown': function(evt) {
            if (evt.ctrlKey || evt.metaKey) { // Unselect an element if the CTRL/Meta key is pressed while a selected element is clicked.
              var cell = graph.interfaces.selector.get($(evt.target).data('model'));
              graph.interfaces.selector.reset(graph.interfaces.selector.without(cell));
              graph.interfaces.selectorView.destroySelectionBox(graph.interfaces.paper.findViewByModel(cell));
            }
          }
        });

        /**
         * [ Flow Paper Listeners ]
         */
        graph.interfaces.paper.on({
          'blank:pointerdown': function(evt, x, y) {
            graph.utils.hidePropertiesPanel();
            if (_.contains(KeyboardJS.activeKeys(), 'shift')) {
              graph.interfaces.selectorView.startSelecting(evt, x, y);
            } else {
              graph.interfaces.selectorView.cancelSelection();
              graph.interfaces.scroller.startPanning(evt, x, y);
            }
          },
          'cell:pointerdown': function(cellView, evt) {
            if ((evt.ctrlKey || evt.metaKey) && cellView.model instanceof joint.dia.Element && !(cellView.model instanceof joint.shapes.bpmn.Pool)) { // Select an element if CTRL/Meta key is pressed while the element is clicked.
              graph.interfaces.selector.add(cellView.model);
              graph.interfaces.selectorView.createSelectionBox(cellView);
            }
          },
          'cell:pointerup': function(cellView, evt, x, y) {
            var cell = cellView.model;

            // Find the first element below that is not a link nor the dragged element itself.
            var elementBelow = graph.get('cells').find(function(cell) {
              if (cell instanceof joint.dia.Link) {return false;} // Not interested in links.
              if (cell.id === cellView.model.id) {return false;} // The same element as the dropped one.
              if (cell.getBBox().moveAndExpand({x: -20, y: -20, width: 40, height: 40}).containsPoint(g.point(cellView._dx, cellView._dy))) {
                return true;
              }
              return false;
            });

            if (elementBelow && elementBelow.attributes.type === 'liveOps.activity' && cell.attributes.type === 'liveOps.event') {
              elementBelow.embed(cell);
              _.each(graph.getConnectedLinks(cell, {inbound: true}), function(link) {
                link.remove();
              });
            }

            graph.utils.renderPropertiesPanel(cellView, evt, x, y);
          }
        });

        /**
         * [ Flow Graph Listeners ]
         */
        graph.on({
          'add': function(cell, collection, opt) {
            if (!opt.stencil) {return;}
            var view = graph.interfaces.paper.findViewByModel(cell);
            if (view) {graph.utils.renderPropertiesPanel(view);}
          }
        });

        return graph;
      },
      initializeCommandManager: function(graph) {
        return new joint.dia.CommandManager({
          graph: graph
        });
      },
      initializeSelector: function() {
        return new Backbone.Collection();
      },
      initializeClipboard: function() {
        return new joint.ui.Clipboard();
      },
      initializePaper: function(graph, width, height, gridSize, perpendicularLinks, embeddingMode, frontParentOnly, defaultLink) {
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
      initializeScroller: function(paper, padding, autoResizePaper) {
        var flowScroller = new joint.ui.PaperScroller({
          autoResizePaper: autoResizePaper,
          padding: padding,
          paper: paper
        });

        flowScroller.zoomIn = function() {
          this.zoom(0.2, {max: 2, min: 0.2});
        };

        flowScroller.zoomOut = function() {
          this.zoom(-0.2, {max: 2, min: 0.2});
        };

        return flowScroller;
      },
      initializeSelectorView: function(graph, paper, selector, filterArray) {
        return new joint.ui.SelectionView({
          paper: paper,
          graph: graph,
          model: selector,
          filter: filterArray
        });
      },
      initializePalette: function(graph, paper) {
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
      initializeSnapper: function(paper) {
        return new joint.ui.Snaplines({paper: paper});
      },
      initializeKeyboardListeners: function(graph) {
        KeyboardJS.on('delete', function(evt) {
          if (!$.contains(evt.target, graph.interfaces.paper.el)) {return;}
          graph.interfaces.commandManager.initBatchCommand();
          graph.interfaces.selector.invoke('remove');
          graph.interfaces.commandManager.storeBatchCommand();
          graph.interfaces.selectorView.cancelSelection();
        });

        KeyboardJS.on('ctrl + z', function() {
          if (!graph.interfaces.commandManager.hasUndo()) {return;}
          console.log('Ctrl + z\'d!');
          graph.interfaces.commandManager.undo();
        });

        KeyboardJS.on('ctrl + y', function() {
          if (!graph.interfaces.commandManager.hasRedo()) {return;}
          console.log('Ctrl + y\'d!');
          graph.interfaces.commandManager.redo();
        });

        KeyboardJS.on('ctrl + c', function() {
          console.log('Ctrl + c\'d!');
          graph.interfaces.clipboard.copyElements(graph.interfaces.selector, graph);
        });

        KeyboardJS.on('ctrl + v', function() {
          console.log('Ctrl + v\'d!');
          graph.interfaces.clipboard.pasteCells(graph);
        });

        KeyboardJS.on('ctrl + =', function(evt) {
          evt.preventDefault();
          console.log('Ctrl + +\'d!');
          graph.interfaces.scroller.zoomIn();
        });

        KeyboardJS.on('ctrl + -', function(evt) {
          evt.preventDefault();
          console.log('Ctrl + -\'d!');
          graph.interfaces.scroller.zoomOut();
        });
      }
    };
  }

  angular.module('liveopsConfigPanel').service('JointInitService', JointInitService);
})();
