// 'use strict';

// describe('genericListsController', function() {
//   var $scope,
//     $httpBackend,
//     apiHostname,
//     controller,
//     List,
//     ListType,
//     mockLists,
//     mockListTypes,
//     loEvents;

//   beforeEach(module('gulpAngular', 'liveopsConfigPanel', 'liveopsConfigPanel.tenant.list.mock', 
//       'liveopsConfigPanel.tenant.listType.mock', 'liveopsConfigPanel.mockutils'));

//   beforeEach(inject(['$rootScope', '$controller', '$httpBackend', 'apiHostname', 'List', 'ListType', 'mockLists', 'mockListTypes', 'loEvents',
//     function($rootScope, $controller, _$httpBackend, _apiHostname, _List, _ListType, _mockLists, _mockListTypes, _loEvents) {
//       $scope = $rootScope.$new();
//       $httpBackend = _$httpBackend;
//       apiHostname = _apiHostname;
//       List = _List;
//       ListType = _ListType;
//       mockLists = _mockLists;
//       mockListTypes = _mockListTypes;
//       loEvents = _loEvents;

//       controller = $controller('genericListsController', {
//         '$scope': $scope
//       });
//     }
//   ]));

//   describe('ON create', function () {
//     it('should exist on controller', function () {
//       expect(controller.create).toBeDefined();
//     });

//     it('should set selectedList', function () {
//       controller.create();

//       expect(controller.selectedList).toBeDefined();
//     });
//   });

//   describe('ON loadLists', function () {
//     it('should exist on controller', function () {
//       expect(controller.loadLists).toBeDefined();
//     });

//     it('should call /v1/tenants/tenant-id/lists', inject([function () {
//       $httpBackend.expect('GET', apiHostname + '/v1/tenants/tenant-id/lists');
      
//       controller.loadLists();

//       $httpBackend.flush();
//     }]));
    
//     it('should call loadPermissions and loadListTypes on success', inject([function() {
//       controller.loadListTypes = jasmine.createSpy('loadListTypes');
      
//       controller.loadLists();
      
//       $httpBackend.flush();
      
//       expect(controller.loadListTypes).toHaveBeenCalled();
//     }]));
//   });

//   describe('ON submit', function () {
//     beforeEach(function () {
//       controller.selectedList = new List();
//       controller.selectedList.save = jasmine.createSpy('save');
//     });

//     it('should exist on controller', function () {
//       expect(controller.submit).toBeDefined();
//     });

//     it('should call save', function () {
//       controller.submit();

//       expect(controller.selectedList.save).toHaveBeenCalled();
//     });
//   });

//   describe('ON addListItem', function() {
//     beforeEach(inject(function(mockForm) {
//       controller.selectedList = {};
//       controller.selectedList.items = [];
//       controller.selectedList.$original = {};
//       controller.selectedList.$original.items = [];
      
//       controller.forms = {
//         detailsForm: mockForm()
//       };
//     }));

//     it('should exist on controller', function () {
//       expect(controller.addListItem).toBeDefined();
//     });

//     it('should add listItem on call', function () {
//       var listItem = controller.addListItem();

//       expect(controller.selectedList.items.length).toEqual(1);
//       expect(controller.selectedList.items[0]).toBe(listItem);
//     });

//     it('should add listItem to $original on call', function () {
//       var listItem = controller.addListItem();

//       expect(controller.selectedList.items.length).toEqual(1);
//       expect(controller.selectedList.items[0]).toBe(listItem);
//     });
//   });

//   describe('ON removeListItem', function() {
//     var listItem = {};

//     beforeEach(inject(function(mockForm) {
//       controller.selectedList = {};
//       controller.selectedList.items = [listItem];
//       controller.selectedList.$original = {};
//       controller.selectedList.$original.items = [listItem];

//       controller.forms = {
//         detailsForm: mockForm()
//       };
//     }));

//     it('should exist on controller', function () {
//       expect(controller.removeListItem).toBeDefined();
//     });

//     it('should remove listItem on call', function () {
//       controller.removeListItem(listItem);

//       expect(controller.selectedList.items.length).toEqual(0);
//     });

//     it('should remove listItem on $original on call', function () {
//       controller.removeListItem(listItem);

//       expect(controller.selectedList.items.length).toEqual(0);
//     });
//   });

//   describe('ON event table:on:click:create', function() {
//     it('should call create', function() {
//       controller.create = jasmine.createSpy('create');

//       $scope.$broadcast(loEvents.tableControls.itemCreate);

//       expect(controller.create).toHaveBeenCalled();
//     });
//   });

//   describe('ON loadListTypes', function() {
//     it('should populate $listType for list with listTypeId1', function() {
//       $httpBackend.expect('GET', apiHostname + '/v1/tenants/tenant-id/list-types');
      
//       var lists = List.cachedQuery({
//         tenantId: 'tenant-id'
//       });
      
//       controller.loadListTypes(lists);
      
//       $httpBackend.flush();

//       expect(controller.lists[0].$listType.id).toEqual(mockListTypes[0].id);
//     });

//     it('should populate multiple $listType for lists', function() {
//       $httpBackend.expect('GET', apiHostname + '/v1/tenants/tenant-id/list-types');
      
//       var lists = List.cachedQuery({
//         tenantId: 'tenant-id'
//       });
      
//       controller.loadListTypes(lists);
      
//       $httpBackend.flush();

//       expect(controller.lists[0].$listType.id).toEqual(mockListTypes[0].id);
//       expect(controller.lists[1].$listType.id).toEqual(mockListTypes[1].id);
//     });
//   });
// });
