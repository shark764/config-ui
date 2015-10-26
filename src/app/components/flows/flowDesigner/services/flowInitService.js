(function() {
  'use strict';

  /* global document : false */
  function FlowInitService (FlowPaletteService, FlowNotationService, $compile, $rootScope) {
    return {
      initializeGraph: function(graphOptions) {
        var self = this;

        // Interface Initializations
        var graph = new joint.dia.Graph();
        self.graph = graph;
        graph.interfaces = {};
        graph.utils = {};
        graph.interfaces.commandManager = self.initializeCommandManager(graph);
        graph.interfaces.selector = self.initializeSelector();
        graph.interfaces.clipboard = self.initializeClipboard();
        graph.interfaces.paper = self.initializePaper(graph, graphOptions.width, graphOptions.height, graphOptions.gridSize, graphOptions.perpendicularLinks, graphOptions.embeddingMode, graphOptions.frontParentOnly, graphOptions.defaultLink, graphOptions.readOnly);
        graph.interfaces.scroller = self.initializeScroller(graph.interfaces.paper, graphOptions.scrollerPadding, graphOptions.autoResizePaper, graphOptions.paperContainerId);
        graph.interfaces.selectorView = self.initializeSelectorView(graph, graph.interfaces.paper, graph.interfaces.selector, graphOptions.selectorFilterArray);
        graph.interfaces.palette = self.initializePalette(graph, graph.interfaces.paper, graphOptions.stencilContainerId);
        graph.interfaces.snapper = self.initializeSnapper(graph.interfaces.paper);
        graph.interfaces.flowPropertiesPanel = undefined;
        graph.interfaces.inspectorContainer = $(graphOptions.inspectorContainerId);
        graph.panelScope = $rootScope.$new();

        // Default Listener Initializations
        self.initializeKeyboardListeners();
        self.initializeSelectorViewListeners();
        self.initializePaperListeners();
        self.initializeGraphListeners();

        /**
         * [ Properties Panel Logic  & Functions]
         */
        graph.utils.showPropertiesPanel = function() {
          graph.interfaces.inspectorContainer.css({'right': '0px'});
        };
        graph.utils.hidePropertiesPanel = function() {
          graph.interfaces.inspectorContainer.css({'right': '-1000px'});
        };
        graph.utils.renderHaloMenu = function(notation) {
          if (notation.model instanceof joint.dia.Element && !graph.interfaces.selector.contains(notation.model)) {
            new joint.ui.FreeTransform({cellView: notation}).render();
            new joint.ui.Halo({
              cellView: notation,
              boxContent: function(cellView) {
                return cellView.model.get('type');
              }
            }).render();
            graph.interfaces.selectorView.cancelSelection();
            graph.interfaces.selector.reset([notation.model], {safe: true});
          }
        };
        graph.utils.unselectCell = function(){
          var nodes = document.querySelectorAll(graphOptions.paperContainerId + ' .selected');
          _.each(nodes, function(node){
            new V(node).removeClass('selected');
          });
        };
        graph.utils.updateSelectedCell = function(cellView){
          //remove previously highlighted class
          graph.utils.unselectCell();

          //highlight current cell if it is not a link
          if(cellView.model.get('type') !== 'liveOps.link'){
            new V(cellView.el.getElementsByClassName('border')[0]).addClass('selected');
          }
        };
        graph.utils.renderPropertiesPanel = function(notation) {
          //console.log('Notation clicked on:', notation);
          graph.utils.updateSelectedCell(notation);
          // Render the halo menu
          if (notation.model.attributes.group !== 'end') {
            graph.utils.renderHaloMenu(notation);
          }

          // Dont render the properties panel if they clicked on a gateway
          if (notation.model.attributes.type === 'liveOps.gateway') { return graph.utils.hidePropertiesPanel(); }


          // Don't render the properties panel if there are no inputs on the thing they clicked on
          if (FlowNotationService.buildInputPanel(notation.model).length === 0) { return graph.utils.hidePropertiesPanel(); }

          // Slide it out and render!
          graph.utils.showPropertiesPanel();

          // Don't set up the inputs again if the model is already opened in the props panel
          //if (graph.panelScope.notation !== undefined && notation.model.id === graph.panelScope.notation.model.id) { return; }

          graph.interfaces.inspectorContainer.empty();
          graph.panelScope.$destroy();
          graph.panelScope = $rootScope.$new();
          graph.panelScope.inputs = FlowNotationService.buildInputPanel(notation.model);
          graph.panelScope.notation = notation;
          var compiledPanel = $compile('<props-panel notation="notation" inputs="inputs"></props-panel>')(graph.panelScope);
          graph.interfaces.inspectorContainer.append(compiledPanel);

          graph.panelScope.$on('rebuild', function(){
            graph.utils.renderPropertiesPanel(notation);
          });
        };

        return graph;
      },
      initializeCommandManager: function(graph) {
        var commandManager = new joint.dia.CommandManager({
          graph: graph
        });
        return commandManager;
      },
      initializeSelector: function() {
        var selector = new Backbone.Collection();
        return selector;
      },
      initializeClipboard: function() {
        var clipboard = new joint.ui.Clipboard();
        return clipboard;
      },
      initializePaper: function(graph, width, height, gridSize, perpendicularLinks, embeddingMode, frontParentOnly, defaultLink, readOnly) {
        return new joint.dia.Paper({
          width: width,
          height: height,
          model: graph,
          gridSize: gridSize,
          perpendicularLinks: perpendicularLinks,
          embeddingMode: embeddingMode,
          frontParentOnly: frontParentOnly,
          defaultLink: defaultLink,
          interactive: (readOnly === false),
          validateEmbedding: function(childView) {
            var validEventNames = ['message', 'signal', 'timer', 'conditional', 'escalation'];
            return (childView.model.get('type') === 'liveOps.event' &&
              childView.model.get('entity') === 'catch' &&
              _.contains(validEventNames, childView.model.get('name')));
          },
          validateConnection: function(cellViewS, magnetS, cellViewT, magnetT, end) {
            if (cellViewS === cellViewT) { return false; }
            var view = end === 'target' ? cellViewT : cellViewS;
            if (view instanceof joint.dia.LinkView) { return false; }
            return true;
          },
        });
      },
      initializeScroller: function(paper, padding, autoResizePaper, paperContainerId) {
        var flowScroller = new joint.ui.PaperScroller({
          autoResizePaper: autoResizePaper,
          padding: padding,
          paper: paper
        });

        flowScroller.zoomIn = function() {
          var self = this;
          self.zoom(0.2, {max: 2, min: 0.2});
        };

        flowScroller.zoomOut = function() {
          var self = this;
          self.zoom(-0.2, {max: 2, min: 0.2});
        };

        flowScroller.$el.appendTo(paperContainerId);

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
      initializePalette: function(graph, paper, stencilContainerId) {
        var stencil = new joint.ui.Stencil({
          graph: graph,
          paper: paper,
          search: {
            'liveOps.activity': ['content'],
            'liveOps.event': ['entity', 'name'],
            'liveOps.gateway': ['gatewayType'],
            'liveOps.template': ['content']
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
            templates: {
              label: 'Templates',
              index: 4
            }
          }
        });

        $(stencilContainerId).append(stencil.render().$el);
        FlowPaletteService.loadPallet(stencil);

        _.each(stencil.graphs, function(graph) {
          joint.layout.GridLayout.layout(graph, {
            columns: 3,
            columnWidth: 95,
            rowHeight: 70,
            dy: 5,
            dx: 5
          });
        });
        _.each(stencil.papers, function(paper) {
          paper.fitToContent(0, 0, 10);
          //Hack to forece redraw :(
          paper.$el.hide().show(0);
        });

        return stencil;
      },
      initializeSnapper: function(paper) {
        var snapper = new joint.ui.Snaplines({paper: paper});
        snapper.startListening();
        return snapper;
      },
      initializePaperListeners: function() {
        var self = this;
        self.graph.interfaces.paper.on({
          'blank:pointerdown': function(evt, x, y) {
            self.graph.utils.hidePropertiesPanel();
            self.graph.utils.unselectCell();
            if (_.contains(KeyboardJS.activeKeys(), 'shift')) {
              self.graph.interfaces.selectorView.startSelecting(evt, x, y);
            } else {
              self.graph.interfaces.selectorView.cancelSelection();
              self.graph.interfaces.scroller.startPanning(evt, x, y);
            }
          },
          'cell:pointerdown': function(cellView, evt) {
            if ((evt.ctrlKey || evt.metaKey) && cellView.model instanceof joint.dia.Element && !(cellView.model instanceof joint.shapes.bpmn.Pool)) { // Select an element if CTRL/Meta key is pressed while the element is clicked.
              self.graph.interfaces.selector.add(cellView.model);
              self.graph.interfaces.selectorView.createSelectionBox(cellView);
            }
          },
          'cell:pointerup': function(cellView) {
            self.graph.utils.renderPropertiesPanel(cellView);
            self.graph.interfaces.selector.add(cellView.model);
          }
        });
      },
      initializeGraphListeners: function() {
        var self = this;
        self.graph.on({
          'add': function(cell, collection, opt) {
            if (!opt.stencil) {return;}
            var view = self.graph.interfaces.paper.findViewByModel(cell);
            FlowNotationService.populatePreviousOption(cell);
            FlowNotationService.populateSingleOption(cell);
            if (view) {self.graph.utils.renderPropertiesPanel(view);}
          }
        });
      },
      initializeSelectorViewListeners: function() {
        var self = this;
        self.graph.interfaces.selectorView.on({
          'selection-box:pointerdown': function(evt) {
            if (evt.ctrlKey || evt.metaKey) {
              var cell = self.graph.interfaces.selector.get($(evt.target).data('model'));
              self.graph.interfaces.selector.reset(self.graph.interfaces.selector.without(cell));
              self.graph.interfaces.selectorView.destroySelectionBox(self.graph.interfaces.paper.findViewByModel(cell));
            }
          }
        });
      },
      initializeKeyboardListeners: function() {
        var self = this;
        KeyboardJS.on('delete', function(evt) {
          if (!$.contains(evt.target, self.graph.interfaces.paper.el)) {return;}
          self.graph.utils.hidePropertiesPanel();
          self.graph.interfaces.commandManager.initBatchCommand();
          self.graph.interfaces.selector.invoke('remove');
          self.graph.interfaces.commandManager.storeBatchCommand();
          self.graph.interfaces.selectorView.cancelSelection();
        });

        var metaKeys = ['super', 'ctrl'];

        KeyboardJS.on('backspace', function(evt) {
          if ($('input:focus').length > 0) { return; }
          evt.preventDefault();
        });

        _.each(metaKeys, function(key) {
          KeyboardJS.on(key + ' + z', function() {
            if (!self.graph.interfaces.commandManager.hasUndo()) {return;}
            self.graph.interfaces.commandManager.undo();
          });

          KeyboardJS.on(key + ' + y', function() {
            if (!self.graph.interfaces.commandManager.hasRedo()) {return;}
            self.graph.interfaces.commandManager.redo();
          });

          KeyboardJS.on(key + ' + c', function() {
            if (document.activeElement.attributes[0] !== undefined) { return; }
            if (self.graph.interfaces.selector.models.length === 0) { return; }
            _.each(self.graph.interfaces.selector.models, function(model) {
              model.attributes.position.x -= 25;
              model.attributes.position.y -= 25;
            });
            self.graph.interfaces.clipboard.copyElements(self.graph.interfaces.selector, self.graph);
          });

          KeyboardJS.on(key + ' + v', function() {
            if (document.activeElement.attributes[0] !== undefined) { return; }
            self.graph.interfaces.clipboard.pasteCells(self.graph);
          });

          KeyboardJS.on(key + ' + =', function(evt) {
            evt.preventDefault();
            self.graph.interfaces.scroller.zoomIn();
          });

          KeyboardJS.on(key + ' + -', function(evt) {
            evt.preventDefault();
            self.graph.interfaces.scroller.zoomOut();
          });
        });
      }
    };
  }

  angular.module('liveopsConfigPanel').service('FlowInitService', FlowInitService);
})();
