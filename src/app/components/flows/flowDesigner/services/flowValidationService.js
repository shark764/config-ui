(function() {
  'use strict';

  function FlowValidationService($q, FlowLibrary, FlowResource){

    function libraryValidate(graph){
      var deferred = $q.defer();
      deferred.resolve(FlowLibrary.validate(graph.toJSON()));
      return deferred.promise;
    }

    function serverValidate(flow){
      if(_.has(flow, 'validate') && (_.isFunction(flow, 'validate'))){
        return flow.validate().then(function(response){
          if(response === true){
            return [];
          }
          else {
            return [response.data.error.attribute.flow];
          }
        });
      }
      else{
        return [];
      }
    }

    function clearErrors(graph) {
      _.each(graph.getElements(), function(element) {
        var view = element.findView(graph.interfaces.paper);
        new V(view.el).removeClass('error');
      });
    }

    function highlightCells(errors, graph){
      _.each(errors, function(e) {
        var cell = graph.getCell(e.step);
        var view = cell.findView(graph.interfaces.paper);
        new V(view.el).addClass('error');
      });
    }

    function checkEntities(alienese){
      console.log(alienese);
      _.each(alienese, function(notation){
        if(notation.entity === 'activity' && _.has(notation, 'params')){
          _.each(notation.params, function(param){
            if(param.source === 'system' && param.store === 'queues'){
              var queue = _.findWhere(FlowResource.getActiveQueues(), {id: param.id});
              if(!queue){
                param.id = undefined;
              }
            }
          });
        }
      });
    }

    //Public functionsd
    return {
      validate: function(flowDraft, graph){
        return $q.all({
          serverValidate: serverValidate(flowDraft),
          libraryValidate: libraryValidate(graph)
        }).then(function(data){
          var errors = _.union(data.serverValidate, data.libraryValidate);
          clearErrors(graph);
          highlightCells(errors, graph);

          return errors.length === 0;
        });
      },
      checkEntities: function(alienese){
        checkEntities(alienese);
      }
    };

  }

  angular.module('liveopsConfigPanel').service('FlowValidationService', FlowValidationService);
})();
