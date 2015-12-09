'use strict';

describe('genericListsController', function () {
  var $scope,
    $httpBackend,
    apiHostname,
    controller,
    List,
    ListType,
    mockLists,
    mockListTypes,
    loEvents
    ;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.tenant.list.mock'));
  beforeEach(module('liveopsConfigPanel.tenant.listType.mock'));

  beforeEach(inject(['$rootScope', '$controller', '$httpBackend', 'apiHostname', 'List', 'ListType', 'mockLists', 'mockListTypes', 'loEvents',
    function ($rootScope, $controller, _$httpBackend, _apiHostname, _List, _ListType, _mockLists, _mockListTypes, _loEvents) {
      $scope = $rootScope.$new();

      $httpBackend = _$httpBackend;
      apiHostname = _apiHostname;

      List = _List;
      ListType = _ListType;

      mockLists = _mockLists;
      mockListTypes = _mockListTypes;
      
      loEvents = _loEvents;
      
      controller = $controller('genericListsController', {
        '$scope': $scope
      });
    }
  ]));

  describe('ON create', function () {
    it('should exist on $scope', function () {
      expect($scope.create).toBeDefined();
    });

    it('should set selectedList', function () {
      $scope.create();

      expect($scope.selectedList).toBeDefined();
    });
  });

  describe('ON fetchLists', function () {
    beforeEach(function () {
      List.cachedQuery = jasmine.createSpy('cachedQuery');
    });

    it('should exist on $scope', function () {
      expect($scope.fetchLists).toBeDefined();
    });

    it('should call cachedQuery', function () {
      $scope.fetchLists();

      expect(List.cachedQuery).toHaveBeenCalled();
    });
  });

  describe('ON submit', function () {
    beforeEach(function () {
      $scope.selectedList = new List();
      $scope.selectedList.save = jasmine.createSpy('save');
    });

    it('should exist on $scope', function () {
      expect($scope.submit).toBeDefined();
    });

    it('should call save', function () {
      $scope.submit();

      expect($scope.selectedList.save).toHaveBeenCalled();
    });
  });

  describe('ON addListItem', function () {
    beforeEach(function() {
      $scope.selectedList = {};
      $scope.selectedList.items = [];
      $scope.selectedList.$original = {};
      $scope.selectedList.$original.items = [];
    });

    it('should exist on $scope', function () {
      expect($scope.addListItem).toBeDefined();
    });

    it('should add listItem on call', function () {
      var listItem = $scope.addListItem();

      expect($scope.selectedList.items.length).toEqual(1);
      expect($scope.selectedList.items[0]).toBe(listItem);
    });

    it('should add listItem to $original on call', function () {
      var listItem = $scope.addListItem();

      expect($scope.selectedList.$original.items.length).toEqual(1);
      expect($scope.selectedList.$original.items[0]).toBe(listItem);
    });
  });

  describe('ON removeListItem', function () {
    var listItem = {};

    beforeEach(function() {
      $scope.selectedList = {};
      $scope.selectedList.items = [listItem];
      $scope.selectedList.$original = {};
      $scope.selectedList.$original.items = [listItem];

      $scope.forms = {
        detailsForm: {
          $setDirty: jasmine.createSpy('setDirty')
        }
      };
    });

    it('should exist on $scope', function () {
      expect($scope.removeListItem).toBeDefined();
    });

    it('should remove listItem on call', function () {
      $scope.removeListItem(listItem);

      expect($scope.selectedList.items.length).toEqual(0);
    });

    it('should remove listItem on $original on call', function () {
      $scope.removeListItem(listItem);

      expect($scope.selectedList.$original.items.length).toEqual(0);
    });
  });

  describe('ON event table:on:click:create', function () {
    it('should call create', function() {
      $scope.create = jasmine.createSpy('create');

      $scope.$broadcast(loEvents.tableControls.itemCreate);

      expect($scope.create).toHaveBeenCalled();
    });
  });

  describe('ON lists change', function() {
    it('should not call ListType.cachedQuery when lists is undefined', inject(['$q', function($q) {
      ListType.cachedQuery = jasmine.createSpy('cachedQuery').and.returnValue({
        $promise: $q.when([mockListTypes[0], mockListTypes[1]])
      });

      $scope.$digest();

      expect(ListType.cachedQuery).not.toHaveBeenCalled();
    }]));

    it('should not call ListType.cachedQuery when lists is empty', inject(['$q', function($q) {
      ListType.cachedQuery = jasmine.createSpy('cachedQuery').and.returnValue({
        $promise: $q.when([mockListTypes[0], mockListTypes[1]])
      });

      $scope.lists = [];
      $scope.$digest();

      expect(ListType.cachedQuery).not.toHaveBeenCalled();
    }]));

    it('should call ListType.cachedQuery', inject(['$q', function($q) {
      ListType.cachedQuery = jasmine.createSpy('cachedQuery').and.returnValue({
        $promise: $q.when([mockListTypes[0], mockListTypes[1]])
      });

      $scope.lists = [mockLists[0]];
      $scope.$digest();

      expect(ListType.cachedQuery).toHaveBeenCalled();
    }]));

    it('should populate $listType for list with listTypeId1', function() {
      $httpBackend.expect('GET', apiHostname + '/v1/tenants/tenant-id/list-types');

      $scope.lists = [mockLists[0]];
      $httpBackend.flush();

      expect($scope.lists[0].$listType.id).toEqual(mockListTypes[0].id);
    });

    it('should populate multiple $listType for lists', function() {
      $httpBackend.expect('GET', apiHostname + '/v1/tenants/tenant-id/list-types');

      $scope.lists = [mockLists[0], mockLists[1], mockLists[2]];
      $httpBackend.flush();

      expect($scope.lists[0].$listType.id).toEqual(mockListTypes[0].id);
      expect($scope.lists[1].$listType.id).toEqual(mockListTypes[1].id);
      expect($scope.lists[2].$listType.id).toEqual(mockListTypes[0].id);
    });
  });
});
