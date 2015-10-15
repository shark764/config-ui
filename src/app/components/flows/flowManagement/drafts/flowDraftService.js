'use strict';

angular.module('liveopsConfigPanel')
  .factory('FlowDraft', ['LiveopsResourceFactory', 'emitInterceptor', '$http', 'apiHostname',
    function (LiveopsResourceFactory, emitInterceptor, $http, apiHostname) {

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
        var url = apiHostname + '/v1/tenants/' + this.tenantId + '/flows/' + this.flowId + '/drafts/' + this.id + '/validate';

        return $http({
          method: 'POST',
          url: url
        }).then(function successCallback() {
          return true;
        }, function errorCallback(response) {
          return response;
        });
      };

      return FlowDraft;
    }
  ]);
