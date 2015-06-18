(function() {
'use strict';

function flowDesigner() {
  return {
    scope: {
      alienese: '=alienese',
      flowVersion: '=flowVersion'
    },
    restrict: 'E',
    templateUrl: 'app/components/designer/designer/designerDirective.html',
    replace: true,
    link: function() {},
    controller: function($scope, $element, $attrs, $window, $timeout, JointInitService, FlowConversionService, FlowNotationService, FlowPaletteService, FlowVersion, Session) {

      $timeout(function() {
        var inspectorContainer = $($element).find('#inspector-container');
        var flow = JointInitService.graph();
        var flowCommandManager = JointInitService.commandManager(flow);
        var flowPaper = JointInitService.paper(flow, 1280, 800, 20, true, true, false, new joint.shapes.bpmn.Flow());
        var flowScroller = JointInitService.scroller(flowPaper, 0, true);
        var flowSelector = JointInitService.selector();
        var flowSelectorView = JointInitService.selectorView(flow, flowPaper, flowSelector, []);
        var flowClipboard = JointInitService.clipboard();
        var flowPalette = JointInitService.palette(flow, flowPaper);
        var flowSnapper = JointInitService.snapper(flowPaper);
        var flowPropertiesPanel;

        $scope.publish = function() {
          if(flow.toJSON().cells.length === 0) { return; }
          var alienese = JSON.stringify(FlowConversionService.convertToAlienese(flow.toJSON()));
          $scope.version = new FlowVersion({
            flow: alienese,
            description: $scope.flowVersion.description,
            name: $scope.flowVersion.name
          });

          $scope.version.save({
            tenantId: Session.tenant.tenantId,
            flowId: $scope.flowVersion.flowId
          });
        };

        $scope.hidePropertiesPanel = function() {
          inspectorContainer.css({'right': '-300px'});
        };

        $scope.showPropertiesPanel = function() {
          inspectorContainer.css({'right': '0px'});
        };

        // Debugging
        $window.flow = flow;
        flow.go = function() {
          FlowConversionService.convertToAlienese(flow.toJSON());
        };

        /**
         * [ Flow Scroller Logic ]
         */
        flowScroller.$el.appendTo('#paper-container');

        /**
         * [ Flow Snapper Logic ]
         */
        flowSnapper.startListening();

        /**
         * [ Flow Graph Listeners ]
         */
        flow.on({
          'add': function(cell, collection, opt) {
            if (!opt.stencil) {return;}
            var view = flowPaper.findViewByModel(cell);
            if (view) {openTools(view);}
          }
        });

        /**
         * [ Flow Paper Listeners ]
         */
        flowPaper.on({
          'blank:pointerdown': function(evt, x, y) {
            $scope.hidePropertiesPanel();
            if (_.contains(KeyboardJS.activeKeys(), 'shift')) {
              flowSelectorView.startSelecting(evt, x, y);
            } else {
              flowSelectorView.cancelSelection();
              flowScroller.startPanning(evt, x, y);
            }
          },
          'cell:pointerdown': function(cellView, evt) {
            if ((evt.ctrlKey || evt.metaKey) && cellView.model instanceof joint.dia.Element && !(cellView.model instanceof joint.shapes.bpmn.Pool)) { // Select an element if CTRL/Meta key is pressed while the element is clicked.
              flowSelector.add(cellView.model);
              flowSelectorView.createSelectionBox(cellView);
            }
          },
          'cell:pointerup': function(cellView, evt, x, y) {
            var cell = cellView.model;

            // Find the first element below that is not a link nor the dragged element itself.
            var elementBelow = flow.get('cells').find(function(cell) {
              if (cell instanceof joint.dia.Link) {return false;} // Not interested in links.
              if (cell.id === cellView.model.id) {return false;} // The same element as the dropped one.
              if (cell.getBBox().moveAndExpand({x: -20, y: -20, width: 40, height: 40}).containsPoint(g.point(cellView._dx, cellView._dy))) {
                return true;
              }
              return false;
            });

            if (elementBelow && elementBelow.attributes.type === 'liveOps.activity' && cell.attributes.type === 'liveOps.event') {
              elementBelow.embed(cell);
              _.each(flow.getConnectedLinks(cell, {inbound: true}), function(link) {
                link.remove();
              });
            }

            openTools(cellView, evt, x, y);
          }
        });

        /**
         * [ Flow Selector View Listeners ]
         */
        flowSelectorView.on({
          'selection-box:pointerdown': function(evt) {
            if (evt.ctrlKey || evt.metaKey) { // Unselect an element if the CTRL/Meta key is pressed while a selected element is clicked.
              var cell = flowSelector.get($(evt.target).data('model'));
              flowSelector.reset(flowSelector.without(cell));
              flowSelectorView.destroySelectionBox(flowPaper.findViewByModel(cell));
            }
          }
        });

        /**
         * [ Palette Logic ]
         */
        flowPalette.render().$el.appendTo('#stencil-container');
        FlowPaletteService.loadGateways(flowPalette);
        FlowPaletteService.loadEvents(flowPalette);
        FlowPaletteService.loadActivities(flowPalette);
        _.each(flowPalette.graphs, function(graph) {
          joint.layout.GridLayout.layout(graph, {
            columns: 3,
            columnWidth: 95,
            rowHeight: 75,
            dy: 5,
            dx: 5,
            resizeToFit: true
          });
        });
        _.each(flowPalette.papers, function(paper) {
          paper.fitToContent(0, 0, 10);
        });

        /**
         * [ Properties Panel Logic ]
         */
        function openTools(cellView) {
          if (!flowPropertiesPanel || flowPropertiesPanel.options.cellView !== cellView) {
            $scope.showPropertiesPanel();
            if (flowPropertiesPanel) {
              flowPropertiesPanel.remove(); // Clean up the old properties panel if there was one
            }
            var type = cellView.model.get('type');
            flowPropertiesPanel = new joint.ui.Inspector({
              cell: cellView.model,
              inputs: FlowNotationService.buildInputPanel(cellView.model),
              groups: {
                general: {label: type, index: 1},
                appearance: {index: 2}
              }
            });
            $('#inspector-container').prepend(flowPropertiesPanel.render().el);
          } else {
            $scope.hidePropertiesPanel();
          }

          if (cellView.model instanceof joint.dia.Element && !flowSelector.contains(cellView.model)) {
            new joint.ui.FreeTransform({cellView: cellView}).render();
            new joint.ui.Halo({
              cellView: cellView,
              boxContent: function(cellView) {
                return cellView.model.get('type');
              }
            }).render();
            flowSelectorView.cancelSelection();
            flowSelector.reset([cellView.model], {safe: true});
          }
        }

        /**
         * [ All keyboard listeners ]
         */
        // Delete whatever is selected (individual notations, or groups)
        KeyboardJS.on('delete', function(evt) {
          if (!$.contains(evt.target, flowPaper.el)) {return;}
          flowCommandManager.initBatchCommand();
          flowSelector.invoke('remove');
          flowCommandManager.storeBatchCommand();
          flowSelectorView.cancelSelection();
        });

        // Undo
        KeyboardJS.on('ctrl + z', function(evt) {
          if (!flowCommandManager.hasUndo()) {return;}
          console.log('Ctrl+z\'d!', evt);
          flowCommandManager.undo();
        });

        // Redo
        KeyboardJS.on('ctrl + y', function(evt) {
          if (!flowCommandManager.hasRedo()) {return;}
          console.log('Ctrl+y\'d!', evt);
          flowCommandManager.redo();
        });

        // Copy
        KeyboardJS.on('ctrl + c', function(evt) {
          console.log('Ctrl+c\'d!', evt);
          flowClipboard.copyElements(flowSelector, flow);
        });

        // Paste
        KeyboardJS.on('ctrl + v', function(evt) {
          console.log('Ctrl+v\'d!', evt);
          flowClipboard.pasteCells(flow);
        });

        /**
         * [ Mouse wheel listeners ]
         */
        // Zooming in
        // MouseWheelJS.on('scrollUp', function(evt) {
        //   console.log('Scrolled up!', evt);
        //   flowScroller.zoom(0.2, {max: 2, min: 0.2});
        // });

        // Zooming out
        // MouseWheelJS.on('scrollDown', function(evt) {
        //   console.log('Scrolled down!', evt);
        //   flowScroller.zoom(-0.2, {max: 2, min: 0.2});
        // });

        flow.fromJSON(FlowConversionService.convertToJoint(JSON.parse($scope.flowVersion.flow)));
      }, 1000);
    }
  };
}

angular.module('liveopsConfigPanel').directive('flowDesigner', flowDesigner);
})();
