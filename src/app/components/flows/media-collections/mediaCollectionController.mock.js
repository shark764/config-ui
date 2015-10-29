'use strict';

angular.module('liveopsConfigPanel.mock.content.media.collections', ['liveopsConfigPanel.mock'])
  .service('mockMediaCollections', function (MediaCollection) {
    return [new MediaCollection({
      id: 'mc1'
    }), new MediaCollection({
      id: 'mc2'
    })];
  })
  .service('mockMedias', function (Media) {
    return [new Media({
      id: 'm1'
    }), new Media({
      id: 'm2'
    })];
  })
  .run(function ($httpBackend, apiHostname, Session, mockMedias, mockMediaCollections) {
    Session.tenant = {
      tenantId: '1'
    };
    $httpBackend.when('GET', apiHostname + '/v1/tenants/1/media').respond(200, mockMedias);
    $httpBackend.when('GET', apiHostname + '/v1/tenants/1/media-collections').respond(200, mockMediaCollections);
    $httpBackend.when('GET', apiHostname + '/v1/tenants/2/media').respond(200, mockMedias);
    $httpBackend.when('GET', apiHostname + '/v1/tenants/2/media-collections').respond(200, mockMediaCollections);
    $httpBackend.when('GET', apiHostname + '/v1/tenants/3/media').respond(200, []);
    $httpBackend.when('GET', apiHostname + '/v1/tenants/3/media-collections').respond(200, []);
  });