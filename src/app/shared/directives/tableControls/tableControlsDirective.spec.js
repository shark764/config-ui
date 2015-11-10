'use strict';

/*global jasmine, spyOn: false */

describe('tableControls directive', function () {
  var $scope,
    $stateParams,
    element,
    isolateScope,
    doCompile;

  beforeEach(module('liveopsConfigPanel'));

  beforeEach(module('gulpAngular'));

  beforeEach(inject(['$compile', '$rootScope', '$stateParams',
    function ($compile, $rootScope, _$stateParams_) {
      $scope = $rootScope.$new();
      $stateParams = _$stateParams_;

      $scope.config = {
        fields: [{
          name: 'id'
        }],
        sref: 'contents.management.users',
        searchOn: ['id']
      };
      $scope.selected = {};
      $scope.resourceName = 'resource';
      $scope.extendScope = {};
      $scope.id = 'my-table';
      $scope.items = [];
      $scope.items.$promise = {
        then: function (callback) {
          callback();
        }
      };
      $scope.items.$resolved = true;

      doCompile = function () {
        element = $compile('<table-controls items="items" config="config" selected="selected" resource-name="{{resourceName}}" extend-scope="extendScope" id="id"></table-controls>')($scope);
        $scope.$digest();
        isolateScope = element.isolateScope();
      };
    }
  ]));

  it('should create a table', inject(function () {
    doCompile();
    expect(element.find('table').length).toEqual(2); //Two tables are present due to scroll-table directive
  }));

  it('should add extendscope to its own scope', inject(function () {
    $scope.extendScope = {
      'newProperty': 'neat'
    };
    doCompile();
    expect(isolateScope.newProperty).toBeDefined();
    expect(isolateScope.newProperty).toEqual('neat');
  }));

  it('should select item based on url param', inject(function () {
    $scope.items.push({
      id: 'item1'
    });
    $scope.items.push({
      id: 'item2'
    });
    $stateParams.id = 'item2';
    doCompile();
    expect($scope.selected).toEqual($scope.items[1]);
  }));

  it('should not try to select item based on url param if no items', inject(function () {
    var itemsSpy = spyOn($scope.items.$promise, 'then');
    delete $scope.items;
    doCompile();
    expect(itemsSpy).not.toHaveBeenCalled();
  }));

  it('should not select an item if id in url params does not match any item', inject(function () {
    $scope.items.push({
      id: 'item1'
    });
    $scope.items.push({
      id: 'item2'
    });
    $stateParams.id = 'somethingelse';
    doCompile();
    expect($scope.selected).toEqual(null);
  }));

  it('should select nothing on init if there is no id param', inject(function () {
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
  }));

  it('should not display columns that are unchecked in config', inject(function () {
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
  }));

  it('should include a filter dropdown if field config has options defined', inject(function () {
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
  }));

  it('should catch the created:resource event and select the newly created item', inject(['$rootScope', function ($rootScope) {
    doCompile();
    var newItem = {id: 'myNewItem'};
    $rootScope.$broadcast('created:resource:resource', newItem);

    isolateScope.$digest();
    expect(isolateScope.selected).toEqual(newItem);
  }]));

  describe('selectItem function', function () {
    beforeEach(function () {
      doCompile();
    });

    it('should be defined', inject(function () {
      expect(isolateScope.selectItem).toBeDefined();
      expect(isolateScope.selectItem).toEqual(jasmine.any(Function));
    }));

    it('should check DirtyForms.confirmIfDirty', inject(['DirtyForms', function (DirtyForms) {
      spyOn(DirtyForms, 'confirmIfDirty');
      isolateScope.selectItem();
      expect(DirtyForms.confirmIfDirty).toHaveBeenCalled();
    }]));


    it('should set selected', inject(function () {
      isolateScope.selectItem({
        name: 'my new item'
      });
      $scope.$digest();
      expect($scope.selected.name).toEqual('my new item');
    }));

    it('should call location to update the query param', inject(['$location', function ($location) {
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
    }]));

    it('should emit the resource:selected event', inject(['$rootScope', function ($rootScope) {
      spyOn($rootScope, '$broadcast');
      isolateScope.selectItem({
        name: 'my item'
      });
      expect($rootScope.$broadcast).toHaveBeenCalledWith('table:resource:selected', {
        name: 'my item'
      });
    }]));
  });

  describe('onCreateClick function', function () {
    beforeEach(function () {
      doCompile();
    });

    it('should be defined', inject(function () {
      expect(isolateScope.onCreateClick).toBeDefined();
      expect(isolateScope.onCreateClick).toEqual(jasmine.any(Function));
    }));

    it('should check DirtyForms.confirmIfDirty', inject(['DirtyForms', function (DirtyForms) {
      spyOn(DirtyForms, 'confirmIfDirty');
      isolateScope.onCreateClick();
      expect(DirtyForms.confirmIfDirty).toHaveBeenCalled();
    }]));

    it('should emit the table create click event', inject(['$rootScope', function ($rootScope) {
      spyOn($rootScope, '$broadcast');
      isolateScope.onCreateClick();
      expect($rootScope.$broadcast).toHaveBeenCalledWith('table:on:click:create');
    }]));
  });

  describe('onActionsClick function', function () {
    beforeEach(function () {
      doCompile();
    });

    it('should be defined', inject(function () {
      expect(isolateScope.onActionsClick).toBeDefined();
      expect(isolateScope.onActionsClick).toEqual(jasmine.any(Function));
    }));

    it('should check DirtyForms.confirmIfDirty', inject(['DirtyForms', function (DirtyForms) {
      spyOn(DirtyForms, 'confirmIfDirty');
      isolateScope.onActionsClick();
      expect(DirtyForms.confirmIfDirty).toHaveBeenCalled();
    }]));

    it('should emit the table actions click event', inject(['$rootScope', function ($rootScope) {
      spyOn($rootScope, '$broadcast');
      isolateScope.onActionsClick();
      expect($rootScope.$broadcast).toHaveBeenCalledWith('table:on:click:actions');
    }]));
  });

  describe('toggleAll function', function () {
    beforeEach(function () {
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

    it('should set all filtered items to checked when param is true', inject(function () {
      isolateScope.toggleAll(true);
      expect($scope.items[0].checked).toBeTruthy();
      expect($scope.items[1].checked).toBeTruthy();
      expect($scope.items[2].checked).toBeTruthy();
    }));

    it('should set all filtered items to unchecked when param is false', inject(function () {
      isolateScope.toggleAll(false);
      expect($scope.items[0].checked).toBeFalsy();
      expect($scope.items[1].checked).toBeFalsy();
      expect($scope.items[2].checked).toBeFalsy();
    }));

    it('should only apply to filtered items', inject(function () {
      isolateScope.filtered.removeItem($scope.items[2]);
      isolateScope.toggleAll(true);
      expect($scope.items[0].checked).toBeTruthy();
      expect($scope.items[1].checked).toBeTruthy();
      expect($scope.items[2].checked).toBeFalsy();
    }));
  });

  describe('filtered', function () {
    beforeEach(function () {
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

    it('should update when searchQuery changes', inject(function () {
      isolateScope.searchQuery = 'item2';
      isolateScope.$digest();
      expect(isolateScope.filtered.length).toBe(1);
      expect(isolateScope.filtered[0].id).toEqual('item2');
    }));

    it('watch should set selected item to null if there isn\'t one', inject(function () {
      spyOn(isolateScope, 'selectItem');
      delete isolateScope.selected;
      isolateScope.searchQuery = 'item1';
      isolateScope.$digest();
      expect(isolateScope.selectItem).toHaveBeenCalledWith(null);
    }));

    it('watch should reset selected item if old one gets filtered', inject(function () {
      spyOn(isolateScope, 'selectItem');
      isolateScope.selected = $scope.items[2];
      isolateScope.searchQuery = 'item1';
      isolateScope.$digest();
      expect(isolateScope.selectItem).toHaveBeenCalledWith(null);
    }));

    it('watch should uncheck items that have been filtered out', inject(function () {
      isolateScope.searchQuery = 'item3';
      isolateScope.$digest();
      expect($scope.items[1].checked).toBeFalsy();
    }));
  });

  describe('parse function', function () {
    beforeEach(function () {
      doCompile();
    });

    it('should exist', inject(function () {
      expect(isolateScope.parse).toBeDefined();
      expect(isolateScope.parse).toEqual(jasmine.any(Function));
    }));

    it('should call and return field.name if field.name is a function', inject(function () {
      var item = {
        entity: 'the Hypnotoad'
      };
      var field = {
        name: function (item) {
          return 'All Glory to ' + item.entity;
        }
      };

      var result = isolateScope.parse(item, field);
      expect(result).toEqual('All Glory to the Hypnotoad');
    }));

    it('should return the field value if field.name is a string', inject(function () {
      var item = {
        bob: 'yes'
      };
      var field = {
        name: 'bob'
      };

      var result = isolateScope.parse(item, field);
      expect(result).toEqual('yes');
    }));

    it('should do nothing if field name is a type other than string or function', inject(function () {
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
    }));

    it('should call resolve function if it is defined', inject(function () {
      var item = {
        bob: 'yes'
      };

      var field = {
        resolve: jasmine.createSpy('resolve').and.returnValue('spyResult')
      };
      var result = isolateScope.parse(item, field);
      expect(field.resolve).toHaveBeenCalledWith(item);
      expect(result).toEqual('spyResult');
    }));
  });

  describe('sortTable function', function () {
    beforeEach(function () {
      doCompile();
    });

    it('should exist', inject(function () {
      expect(isolateScope.sortTable).toBeDefined();
      expect(isolateScope.sortTable).toEqual(jasmine.any(Function));
    }));

    it('should toggle reverseSortOrder if the orderBy field is already the given field', inject(function () {
      isolateScope.reverseSortOrder = true;
      isolateScope.orderBy = 'theField';

      isolateScope.sortTable({
        name: 'theField'
      });

      expect(isolateScope.reverseSortOrder).toBeFalsy();
    }));

    it('should toggle reverseSortOrder if the orderBy field is already the given field\'s sortOn value', inject(function () {
      isolateScope.reverseSortOrder = true;
      isolateScope.orderBy = 'theField';

      isolateScope.sortTable({
        sortOn: 'theField'
      });

      expect(isolateScope.reverseSortOrder).toBeFalsy();
    }));

    it('should set orderBy and reset reverseSortOrder if it is a newly chosen field', inject(function () {
      isolateScope.reverseSortOrder = true;
      isolateScope.orderBy = 'anotherField';

      isolateScope.sortTable({
        name: 'theField'
      });

      expect(isolateScope.reverseSortOrder).toBeFalsy();
      expect(isolateScope.orderBy).toEqual('theField');
    }));

    it('should set orderBy to the field\'s sortOn value and reset reverseSortOrder if it is a newly chosen field', inject(function () {
      isolateScope.reverseSortOrder = true;
      isolateScope.orderBy = 'anotherField';

      isolateScope.sortTable({
        sortOn: 'theField'
      });

      expect(isolateScope.reverseSortOrder).toBeFalsy();
      expect(isolateScope.orderBy).toEqual('theField');
    }));
  });

  describe('clearAllFilters function', function () {
    beforeEach(function () {
      doCompile();

      $scope.config.fields = [{
        header: {id: 'one'}
      }, {
        header: {id: 'two'}
      }];
    });

    it('should exist', inject(function () {
      expect(isolateScope.clearAllFilters).toBeDefined();
      expect(isolateScope.clearAllFilters).toEqual(jasmine.any(Function));
    }));

    it('should clear the search field', inject(function () {
      isolateScope.clearAllFilters();
      expect(isolateScope.searchQuery).toBeNull();
    }));

    it('should deselect all filters, if provided', inject(function () {
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

      expect(isolateScope.config.fields[0].header.options[0].checked).toBeFalsy();
      expect(isolateScope.config.fields[0].header.options[1].checked).toBeFalsy();
      expect(isolateScope.config.fields[0].header.options[2].checked).toBeFalsy();
    }));

  });
});
