'use strict';
// jshint unused:false
describe('MediaCollectionController', function() {
    var $scope,
        $controller,
        $httpBackend,
        mediaCollections,
        MediaCollection,
        apiHostname,
        routeParams;

    beforeEach(module('liveopsConfigPanel'));
    beforeEach(inject(['$rootScope', '$controller', '$injector', 'MediaCollection', 'apiHostname',
      function($rootScope, _$controller_, $injector, _MediaCollection_, apiHostname) {
      $scope = $rootScope.$new();
      $controller = _$controller_;
      MediaCollection = _MediaCollection_;

      mediaCollections = [
        new MediaCollection({
          id: 'm1'
        }),
        new MediaCollection({
          id: 'm2'
        })
      ];

      routeParams = {id : 'q1'};

      $httpBackend = $injector.get('$httpBackend');

      $controller('MediaCollectionController', {'$scope': $scope, 'Session' : {tenant : {id : 1}}, '$routeParams' : routeParams});
      $httpBackend.flush();
    }]));
});