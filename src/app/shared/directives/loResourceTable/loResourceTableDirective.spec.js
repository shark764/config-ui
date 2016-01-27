'use strict';

/*global jasmine, spyOn: false */

describe('loResourceTable directive', function() {
  var $scope,
    $stateParams,
    element,
    isolateScope,
    doCompile,
    $location,
    loEvents;

  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));

  beforeEach(inject(['$compile', '$rootScope', '$stateParams', 'loEvents', '$location',
    function($compile, $rootScope, _$stateParams, _loEvents, _$location) {
      $scope = $rootScope.$new();
      $stateParams = _$stateParams;
      loEvents = _loEvents;
      $location = _$location;

      $scope.config = {
        fields: [{
          name: 'id'
        }],
        sref: 'contents.management.users',
        searchOn: ['id']
      };
      $scope.selected = {};
      $scope.items = [];
      $scope.items.$promise = {
        then: function(callback) {
          callback();
        }
      };
      $scope.items.$resolved = true;

      doCompile = function() {
        element = $compile('<lo-resource-table items="items" config="config" selected="selected"></lo-resource-table>')($scope);
        $scope.$digest();
        isolateScope = element.isolateScope();
      };
    }
  ]));

  it('should create a table', function() {
    doCompile();
    expect(element.find('table').length).toEqual(2); //Two tables are present due to scroll-table directive
  });

  it('should select item based on url param', function() {
    $scope.items.push({
      id: 'item1'
    });
    $scope.items.push({
      id: 'item2'
    });

    $location.search({
      id: 'item2'
    });

    doCompile();
    expect($scope.selected).toEqual($scope.items[1]);
  });

  it('should not try to select item based on url param if no items', function() {
    var itemsSpy = spyOn($scope.items.$promise, 'then');
    delete $scope.items;
    doCompile();
    expect(itemsSpy).not.toHaveBeenCalled();
  });

  it('should not select an item if id in url params does not match any item', function() {
    $scope.items.push({
      id: 'item1'
    });
    $scope.items.push({
      id: 'item2'
    });
    $location.search({
      id: 'somethingelse'
    });
    doCompile();
    expect($scope.selected).toBeFalsy();
  });

  it('should select nothing on init if there is no id param', function() {
    delete $stateParams.id;
    $scope.selected = null;
    $scope.items.push({
      id: 'item1'
    });
    $scope.items.push({
      id: 'item2'
    });
    doCompile();
    expect($scope.selected).toEqual(null);
  });

  it('should not display columns that are unchecked in config', function() {
    $scope.config.fields.push({
      name: 'color',
      checked: false
    });
    $scope.config.fields.push({
      name: 'online',
      checked: true
    });
    doCompile();
    expect(element.find('th').length).toBe(3 * 2); //Two shown, one hidden, one checkbox column. Doubled due to scroll-table directive...
  });

  it('should include a filter dropdown if field config has options defined', function() {
    $scope.config.fields.push({
      name: 'color',
      header: {
        options: [{
          'display': 'Disabled',
          'value': 'disabled'
        }, {
          'display': 'Enabled',
          'value': 'enabled'
        }, {
          'display': 'Pending',
          'value': 'pending'
        }]
      }
    });
    doCompile();
    expect(element.find('table').find('filter-dropdown').length).toBe(2); //Doubled due to scroll-table directive
  });

  it('should catch the created:resource event and update the location params, if created item\'s id matches the selected item', inject(function($rootScope, $location) {
    doCompile();
    var newItem = {
      id: 'myNewItem'
    };
    
    isolateScope.selected = {
      id: 'myNewItem'
    };

    spyOn($location, 'search');
    $rootScope.$broadcast('created:resource', newItem);

    isolateScope.$digest();
    expect($location.search).toHaveBeenCalledWith({
      id: 'myNewItem'
    });
  }));

  describe('onSelectItem function', function() {
    beforeEach(function() {
      doCompile();
    });

    it('should be defined', function() {
      expect(isolateScope.onSelectItem).toBeDefined();
      expect(isolateScope.onSelectItem).toEqual(jasmine.any(Function));
    });

    it('should check DirtyForms.confirmIfDirty', inject(function(DirtyForms) {
      spyOn(DirtyForms, 'confirmIfDirty');
      isolateScope.onSelectItem();
      expect(DirtyForms.confirmIfDirty).toHaveBeenCalled();
    }));
  });

  describe('selectItem function', function() {
    beforeEach(function() {
      doCompile();
    });

    it('should be defined', function() {
      expect(isolateScope.selectItem).toBeDefined();
      expect(isolateScope.selectItem).toEqual(jasmine.any(Function));
    });

    it('should set selected', function() {
      isolateScope.selectItem({
        name: 'my new item'
      });
      $scope.$digest();
      expect($scope.selected.name).toEqual('my new item');
    });

    it('should call location to update the query param', inject(function($location) {
      spyOn($location, 'search');
      isolateScope.selectItem({
        id: 'id1'
      });
      expect($location.search).toHaveBeenCalledWith({
        id: 'id1'
      });

      $location.search.calls.reset();
      isolateScope.selectItem();
      expect($location.search).not.toHaveBeenCalled();

      $location.search.calls.reset();
      isolateScope.selectItem({
        something: 'blah'
      });
      expect($location.search).toHaveBeenCalledWith({
        id: undefined
      });
    }));

    it('should emit the resource:selected event', inject(function($rootScope) {
      $rootScope.$broadcast = jasmine.createSpy('$broadcast');
      isolateScope.selectItem({
        name: 'my item'
      });

      expect($rootScope.$broadcast).toHaveBeenCalled();
      expect($rootScope.$broadcast.calls.argsFor(0)[0]).toEqual(loEvents.tableControls.itemSelected);
      expect($rootScope.$broadcast.calls.argsFor(0)[1]).toEqual({
        name: 'my item'
      });

      expect($rootScope.$broadcast.calls.argsFor(0)[2]).toEqual({});
    }));
  });

  describe('toggleAll function', function() {
    beforeEach(function() {
      $scope.items.push({
        id: 'item1',
        checked: false
      });
      $scope.items.push({
        id: 'item2',
        checked: true
      });
      $scope.items.push({
        id: 'item3'
      });
      doCompile();
    });

    it('should set all filtered items to checked when param is true', function() {
      isolateScope.toggleAll(true);
      expect($scope.items[0].checked).toBeTruthy();
      expect($scope.items[1].checked).toBeTruthy();
      expect($scope.items[2].checked).toBeTruthy();
    });

    it('should set all filtered items to unchecked when param is false', function() {
      isolateScope.toggleAll(false);
      expect($scope.items[0].checked).toBeFalsy();
      expect($scope.items[1].checked).toBeFalsy();
      expect($scope.items[2].checked).toBeFalsy();
    });

    it('should only apply to filtered items', function() {
      isolateScope.filtered.removeItem($scope.items[2]);
      isolateScope.toggleAll(true);
      expect($scope.items[0].checked).toBeTruthy();
      expect($scope.items[1].checked).toBeTruthy();
      expect($scope.items[2].checked).toBeFalsy();
    });
  });

  describe('filtered', function() {
    beforeEach(function() {
      $scope.items.push({
        id: 'item1',
        checked: false
      });
      $scope.items.push({
        id: 'item2',
        checked: true
      });
      $scope.items.push({
        id: 'item3'
      });
      doCompile();
    });

    it('should update when searchQuery changes', function() {
      isolateScope.searchQuery = 'item2';
      isolateScope.$digest();
      expect(isolateScope.filtered.length).toBe(1);
      expect(isolateScope.filtered[0].id).toEqual('item2');
    });

    it('watch should uncheck items that have been filtered out', function() {
      isolateScope.searchQuery = 'item3';
      isolateScope.$digest();
      expect($scope.items[1].checked).toBeFalsy();
    });
  });

  describe('parse function', function() {
    beforeEach(function() {
      doCompile();
    });

    it('should exist', function() {
      expect(isolateScope.parse).toBeDefined();
      expect(isolateScope.parse).toEqual(jasmine.any(Function));
    });

    it('should call and return field.name if field.name is a function', function() {
      var item = {
        entity: 'the Hypnotoad'
      };
      var field = {
        name: function(item) {
          return 'All Glory to ' + item.entity;
        }
      };

      var result = isolateScope.parse(item, field);
      expect(result).toEqual('All Glory to the Hypnotoad');
    });

    it('should return the field value if field.name is a string', function() {
      var item = {
        bob: 'yes'
      };
      var field = {
        name: 'bob'
      };

      var result = isolateScope.parse(item, field);
      expect(result).toEqual('yes');
    });

    it('should do nothing if field name is a type other than string or function', function() {
      var result;
      var field;
      var item = {
        bob: 'yes'
      };

      field = {
        name: false
      };
      result = isolateScope.parse(item, field);
      expect(result).toBeUndefined();

      field = {
        name: []
      };
      result = isolateScope.parse(item, field);
      expect(result).toBeUndefined();

      field = {
        name: {}
      };
      result = isolateScope.parse(item, field);
      expect(result).toBeUndefined();

      field = {
        name: 11
      };
      result = isolateScope.parse(item, field);
      expect(result).toBeUndefined();
    });

    it('should call resolve function if it is defined', function() {
      var item = {
        bob: 'yes'
      };

      var field = {
        resolve: jasmine.createSpy('resolve').and.returnValue('spyResult')
      };
      var result = isolateScope.parse(item, field);
      expect(field.resolve).toHaveBeenCalledWith(item);
      expect(result).toEqual('spyResult');
    });
  });

  describe('sortTable function', function() {
    beforeEach(function() {
      doCompile();
    });

    it('should exist', function() {
      expect(isolateScope.sortTable).toBeDefined();
      expect(isolateScope.sortTable).toEqual(jasmine.any(Function));
    });

    it('should toggle reverseSortOrder if the orderBy field is already the given field', function() {
      isolateScope.reverseSortOrder = true;
      isolateScope.orderBy = 'theField';

      isolateScope.sortTable({
        name: 'theField'
      });

      expect(isolateScope.reverseSortOrder).toBeFalsy();
    });

    it('should toggle reverseSortOrder if the orderBy field is already the given field\'s sortOn value', function() {
      isolateScope.reverseSortOrder = true;
      isolateScope.orderBy = 'theField';

      isolateScope.sortTable({
        sortOn: 'theField'
      });

      expect(isolateScope.reverseSortOrder).toBeFalsy();
    });

    it('should set orderBy and reset reverseSortOrder if it is a newly chosen field', function() {
      isolateScope.reverseSortOrder = true;
      isolateScope.orderBy = 'anotherField';

      isolateScope.sortTable({
        name: 'theField'
      });

      expect(isolateScope.reverseSortOrder).toBeFalsy();
      expect(isolateScope.orderBy).toEqual('theField');
    });

    it('should set orderBy to the field\'s sortOn value and reset reverseSortOrder if it is a newly chosen field', function() {
      isolateScope.reverseSortOrder = true;
      isolateScope.orderBy = 'anotherField';

      isolateScope.sortTable({
        sortOn: 'theField'
      });

      expect(isolateScope.reverseSortOrder).toBeFalsy();
      expect(isolateScope.orderBy).toEqual('theField');
    });
  });

  describe('clearAllFilters function', function() {
    beforeEach(function() {
      doCompile();

      $scope.config.fields = [{
        header: {
          id: 'one'
        }
      }, {
        header: {
          id: 'two'
        }
      }];
    });

    it('should exist', function() {
      expect(isolateScope.clearAllFilters).toBeDefined();
      expect(isolateScope.clearAllFilters).toEqual(jasmine.any(Function));
    });

    it('should clear the search field', function() {
      isolateScope.clearAllFilters();
      expect(isolateScope.searchQuery).toBeNull();
    });

    it('should reselect all filters, if provided', function() {
      isolateScope.config.fields[0].header.options = [{
        id: 'option1',
        checked: true
      }, {
        id: 'option2'
      }, {
        id: 'option3',
        checked: false
      }];

      isolateScope.clearAllFilters();

      expect(isolateScope.config.fields[0].header.options[0].checked).toBeTruthy();
      expect(isolateScope.config.fields[0].header.options[1].checked).toBeTruthy();
      expect(isolateScope.config.fields[0].header.options[2].checked).toBeTruthy();
    });
  });
});
