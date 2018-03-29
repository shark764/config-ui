// 'use strict';

// describe('genericItemsController', function() {
//   var $scope,
//     $httpBackend,
//     apiHostname,
//     controller,
//     List,
//     ListType,
//     mockLists,
//     mockListTypes,
//     loEvents;

//   beforeEach(module('gulpAngular'));
//   beforeEach(module('liveopsConfigPanel'));
//   beforeEach(module('liveopsConfigPanel.tenant.list.mock'));
//   beforeEach(module('liveopsConfigPanel.tenant.listType.mock'));

//   beforeEach(inject(['$rootScope', '$httpBackend', 'apiHostname', 'List', 'ListType', 'mockLists', 'mockListTypes', 'loEvents',
//     function($rootScope, _$httpBackend, _apiHostname, _List, _ListType, _mockLists, _mockListTypes, _loEvents) {
//       $scope = $rootScope.$new();

//       $httpBackend = _$httpBackend;
//       apiHostname = _apiHostname;

//       List = _List;
//       ListType = _ListType;

//       mockLists = _mockLists;
//       mockListTypes = _mockListTypes;

//       loEvents = _loEvents;
//     }
//   ]));

//   describe('ON init', function() {
//     it('should not define $scope.list, $scope.listType and $scope.tableConfig WHEN stateParams.listId is not supplied',
//       inject(['$controller',
//         function($controller) {
//           controller = $controller('genericItemsController', {
//             '$scope': $scope
//           });

//           expect($scope.list).not.toBeDefined();
//           expect($scope.listType).not.toBeDefined();
//           expect($scope.tableConfig).not.toBeDefined();
//         }
//       ]));

//     it('should define $scope.list, $scope.listType and $scope.tableConfig WHEN stateParams.listId is supplied',
//       inject(['$controller', '$stateParams', function($controller, $stateParams) {
//           $stateParams.listId = 'listId1';

//           controller = $controller('genericItemsController', {
//             '$scope': $scope
//           });

//           $httpBackend.flush();

//           expect($scope.list).toBeDefined();
//           expect($scope.listType).toBeDefined();
//           expect($scope.tableConfig).toBeDefined();
//         }
//       ]));
//   });

//   describe('WHEN $stateParams.listId is undefined', function() {
//     beforeEach(inject(['$controller', '$stateParams', function($controller, $stateParams) {
//       delete $stateParams.listId;

//       controller = $controller('genericItemsController', {
//         '$scope': $scope
//       });

//       $stateParams.listId = 'listId1';
//     }]));

//     describe('ON loadList', function() {
//       it('should be defined on controller', function() {
//         expect(controller.loadList).toBeDefined();
//       });

//       it('should return undefined', inject(['$stateParams',
//         function($stateParams) {
//           delete $stateParams.listId;

//           var result = controller.loadList();

//           expect(result).not.toBeDefined();
//           expect($scope.list).not.toBeDefined();
//           expect($scope.listType).not.toBeDefined();
//           expect($scope.tableConfig).not.toBeDefined();
//         }
//       ]));

//       it('should make api calls to lists and listTypes', function() {
//           $httpBackend.expect('GET', apiHostname + '/v1/tenants/tenant-id/lists/listId1');
//           $httpBackend.expect('GET', apiHostname + '/v1/tenants/tenant-id/list-types/listTypeId1');

//           var result = controller.loadList();

//           $httpBackend.flush();

//           expect(result).toBeDefined();
//         }
//       );

//       it('should load $scope.list', function() {
//         controller.loadList();

//         $httpBackend.flush();

//         expect($scope.list).toBeDefined();
//         expect($scope.list.id).toEqual(mockLists[0].id);
//       });

//       it('should load $scope.listTypes', function() {
//         controller.loadList();

//         $httpBackend.flush();

//         expect($scope.listType).toBeDefined();
//         expect($scope.listType.id).toEqual(mockListTypes[0].id);
//       });

//     });
//   });

//   describe('WHEN $stateParams.listId = listId1', function() {
//     beforeEach(inject(['$stateParams', '$controller',
//       function($stateParams, $controller) {
//         $stateParams.listId = 'listId1';

//         controller = $controller('genericItemsController', {
//           '$scope': $scope
//         });

//         $httpBackend.flush();
//       }
//     ]));

//     describe('ON create', function() {
//       it('should be defined in controller', function() {
//         expect(controller.create).toBeDefined();
//       });

//       it('should create new list item on $scope.selectedItem', function() {
//         controller.create();
//         expect($scope.selectedItem).toBeDefined();
//         expect($scope.selectedItem).toEqual({});
//       });
//     });

//     describe('ON submit', function() {
//       beforeEach(function() {
//         $scope.controllers = {
//           detailReset: {
//             resetForm: jasmine.createSpy('resetForm')
//           }
//         };

//         controller.loadList = jasmine.createSpy('loadList');
//       });

//       it('should be defined on $scope', function() {
//         expect($scope.submit).toBeDefined();
//       });

//       it('should post to /v1/tenants/tenant-id/lists', function() {
//         $httpBackend.expect('PUT', apiHostname + '/v1/tenants/tenant-id/lists/listId1').respond(200);

//         $scope.submit();

//         $httpBackend.flush();
//       });

//       it('should call resetForm if POST returns 2xx', function() {
//         $httpBackend.expect('PUT', apiHostname + '/v1/tenants/tenant-id/lists/listId1').respond(200);

//         $scope.submit();

//         $httpBackend.flush();

//         expect($scope.controllers.detailReset.resetForm).toHaveBeenCalled();
//       });

//       it('should call loadList if POST doesn\' returns 2xx', function() {
//         $httpBackend.expect('PUT', apiHostname + '/v1/tenants/tenant-id/lists/listId1').respond(400);

//         $scope.submit();

//         $httpBackend.flush();

//         expect(controller.loadList).toHaveBeenCalled();
//       });

//       it('should add $scope.selectItem to $scope.list.items if not already in', function() {
//         $httpBackend.expect('PUT', apiHostname + '/v1/tenants/tenant-id/lists/listId1').respond(400);
//         expect($scope.list.items.length).toEqual(1);

//         $scope.selectedItem = {
//           field1: 'string',
//           field2: 10,
//           field3: true
//         };

//         $scope.submit();

//         $httpBackend.flush();

//         expect($scope.list.items.length).toEqual(2);
//       });

//       it('should not add $scope.selectItem to $scope.list.items if not already in', function() {
//         $httpBackend.expect('PUT', apiHostname + '/v1/tenants/tenant-id/lists/listId1').respond(400);
//         expect($scope.list.items.length).toEqual(1);

//         $scope.selectedItem = $scope.list.items[0];

//         $scope.submit();

//         $httpBackend.flush();

//         expect($scope.list.items.length).toEqual(1);
//       });
//     });

//     describe('ON event table:on:click:create', function() {
//       it('should call create', function() {
//         controller.create = jasmine.createSpy('create');

//         $scope.$broadcast(loEvents.tableControls.itemCreate);

//         expect(controller.create).toHaveBeenCalled();
//       });
//     });
//   });
// });
