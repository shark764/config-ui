'use strict';

angular.module('liveopsConfigPanel')
  .factory('FlowDraft', ['LiveopsResourceFactory', 'emitInterceptor', '$http', 'apiHostname', '$q',
    function (LiveopsResourceFactory, emitInterceptor, $http, apiHostname, $q) {

      var endpoint = '/v1/tenants/:tenantId/flows/:flowId/drafts/:id';

      var FlowDraft = LiveopsResourceFactory.create({
        endpoint: endpoint,
        resourceName: 'FlowDraft',
        updateFields: [{
          name: 'tenantId'
        }, {
          name: 'name'
        }, {
          name: 'description',
          optional: true
        }, {
          name: 'flowId'
        }, {
          name: 'flow'
        }, {
          name: 'history'
        }],
        saveInterceptor: emitInterceptor,
        updateInterceptor: emitInterceptor
      });

      FlowDraft.prototype.getDisplay = function () {
        return this.name;
      };

      FlowDraft.prototype.validate = function () {
        var draftUrl = apiHostname + '/v1/tenants/' + this.tenantId + '/flows/' + this.flowId + '/drafts/';
        var _draft = this;
        var deferred = $q.defer();

        _draft.save().then(function(d){
          $http({
            method: 'POST',
            url: draftUrl + d.id + '/validate'
          }).then(function successCallback() {
            deferred.resolve();
          }, function errorCallback(response) {
            deferred.reject(response);
          }).finally(function () {
            _draft.delete();
          });
        });

        return deferred.promise;
      };

      return FlowDraft;
    }
  ]);
