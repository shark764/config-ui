// 'use strict';
//
// describe('MediaMappings directive', function() {
//   var $scope,
//     element,
//     isolateScope;
//
//   beforeEach(module('gulpAngular', 'liveopsConfigPanel', 'liveopsConfigPanel.mock',
//       'liveopsConfigPanel.tenant.media.mock', 'liveopsConfigPanel.tenant.mediaCollection.mock', 'liveopsConfigPanel.mockutils'));
//
//   beforeEach(inject(['$rootScope', '$compile', 'mockMediaCollections', 'mockForm',
//     function($rootScope, $compile, mockMediaCollections, mockForm) {
//       $scope = $rootScope.$new();
//
//       $scope.collection = mockMediaCollections[0];
//       $scope.form = mockForm(['mediaMap']);
//
//       element = $compile('<media-mappings collection="collection" form="form"></media-mappings>')($scope);
//       $scope.$digest();
//       isolateScope = element.isolateScope();
//     }
//   ]));
//
//   describe('addMapping function', function() {
//     it('should exist', function() {
//       expect(isolateScope.addMapping).toBeDefined();
//       expect(isolateScope.addMapping).toEqual(jasmine.any(Function));
//     });
//
//     it('should add an empty object to the mediaMap array, if defined.', function() {
//       $scope.collection.mediaMap = [{
//         id: 'first'
//       }];
//
//       if (isolateScope.bypassMultipicker !== true) {
//         isolateScope.addMapping();
//
//         expect($scope.collection.mediaMap.length).toBe(2);
//         expect($scope.collection.mediaMap[1]).toBeDefined();
//         expect($scope.collection.mediaMap[1]).toEqual({});
//       }
//     });
//
//     it('should create a mediaMap array with an empty object, if no mediaMap exists', function() {
//
//       isolateScope.addMapping();
//       expect($scope.collection.mediaMap).toBeDefined();
//       expect($scope.collection.mediaMap).toEqual(jasmine.any(Array));
//       expect($scope.collection.mediaMap.length).toBe(1);
//       expect($scope.collection.mediaMap[0]).toEqual({});
//     });
//   });
//
//   describe('removeMapping function', function() {
//     it('should exist', function() {
//       expect(isolateScope.removeMapping).toBeDefined();
//       expect(isolateScope.removeMapping).toEqual(jasmine.any(Function));
//     });
//
//     it('should remove the custom form elements and set dirty', inject(function() {
//       $scope.collection.mediaMap = [{
//         id: 'uuid-value'
//       }, {
//         id: 'some other value'
//       }];
//
//       isolateScope.removeMapping(1);
//
//       expect($scope.collection.mediaMap.length).toBe(1);
//       expect($scope.form.mediaMap.$setDirty).toHaveBeenCalled();
//     }));
//
//     it('should remove the mediaMap property if no mappings are left', function() {
//       $scope.collection.mediaMap = [{
//         id: 'uuid-value'
//       }];
//
//       isolateScope.removeMapping(0);
//
//       expect($scope.collection.mediaMap).toBeUndefined();
//     });
//
//     it('should remove the defaultMediaKey property if no mappings are left', function() {
//       $scope.collection.mediaMap = [{
//         id: 'uuid-value'
//       }];
//
//       isolateScope.removeMapping(0);
//
//       expect($scope.collection.defaultMediaKey).toBeUndefined();
//     });
//
//     it('should leave the defaultMediaKey property alone if removing a different mediaMap', function() {
//       $scope.collection.mediaMap = [{
//         id: 'uuid-value'
//       }, {
//         id: 'my-default-mapping'
//       }];
//
//       $scope.collection.defaultMediaKey = $scope.collection.mediaMap[1];
//       isolateScope.removeMapping(0);
//
//       expect($scope.collection.defaultMediaKey).toEqual({id: 'my-default-mapping'});
//     });
//   });
//
//   describe('resetDefaultMediaKey function', function() {
//     beforeEach(inject(function(mockModel) {
//       $scope.form.defaultMediaKey = mockModel();
//     }));
//
//     it('should exist', function() {
//       expect(isolateScope.resetDefaultMediaKey).toBeDefined();
//       expect(isolateScope.resetDefaultMediaKey).toEqual(jasmine.any(Function));
//     });
//
//     it('should set defaultMediaKey to null', function() {
//       $scope.collection.defaultMediaKey = 'exists!';
//       isolateScope.resetDefaultMediaKey();
//       expect($scope.collection.defaultMediaKey).toBeNull();
//     });
//
//     it('should touch and dirty the defaultMediaKey field', function() {
//       isolateScope.resetDefaultMediaKey();
//       expect($scope.form.defaultMediaKey.$setDirty).toHaveBeenCalled();
//       expect($scope.form.defaultMediaKey.$setTouched).toHaveBeenCalled();
//     });
//   });
//
//   describe('onSelect function', function() {
//     beforeEach(inject(function(mockModel) {
//       $scope.form.mediaMap = mockModel();
//     }));
//
//     it('should exist', function() {
//       expect(isolateScope.onSelect).toBeDefined();
//       expect(isolateScope.onSelect).toEqual(jasmine.any(Function));
//     });
//
//     it('should return a function', function() {
//       expect(isolateScope.onSelect({})).toEqual(jasmine.any(Function));
//     });
//
//     it('should dirty the form mediaMap field when the result is called', function() {
//       isolateScope.onSelect({})({id: '1234'});
//       expect($scope.form.mediaMap.$setDirty).toHaveBeenCalled();
//       expect($scope.form.mediaMap.$setTouched).toHaveBeenCalled();
//     });
//
//     it('should set the mediaMap id to that of the selected media', function() {
//       var mediaMap = {};
//       isolateScope.onSelect(mediaMap)({id: '1234'});
//       expect(mediaMap.id).toEqual('1234');
//     });
//   });
//
//   describe('initMapping function', function() {
//     it('should exist', function() {
//       expect(isolateScope.initMapping).toBeDefined();
//       expect(isolateScope.initMapping).toEqual(jasmine.any(Function));
//     });
//
//     it('should fetch the list of medias', inject(function($httpBackend, apiHostname, queryCache, Session) {
//       queryCache.removeAll();
//       Session.tenant.tenantId = 'mytenant';
//       $httpBackend.expectGET(apiHostname + '/v1/tenants/mytenant/media').respond(200);
//       isolateScope.initMapping({id: '1234'});
//       $httpBackend.flush();
//     }));
//
//     it('should do nothing if given mediaMap has no id', inject(function($httpBackend) {
//       isolateScope.initMapping({});
//       $httpBackend.verifyNoOutstandingRequest();
//     }));
//   });
// });
