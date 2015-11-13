'use strict';

describe('listItem directive', function() {
  var $scope,
    $compile,
    element,
    isolateScope,
    mockLists,
    mockListTypes
    ;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.tenant.list.mock'));
  beforeEach(module('liveopsConfigPanel.tenant.listType.mock'));

  beforeEach(inject(['$compile', '$rootScope', 'mockLists', 'mockListTypes',
    function(_$compile_, _$rootScope_, _mockLists, _mockListTypes) {
      $scope = _$rootScope_.$new();
      $compile = _$compile_;
      
      mockLists = _mockLists;
      mockListTypes = _mockListTypes;
    }
  ]));

  beforeEach(function() {
    $scope.item = mockLists[0].items[0];
    $scope.listType = mockListTypes[0];

    element = $compile('<form><list-item item="item" list-type="listType" index="0"></list-item><form>')($scope);
    element = element.find('list-item');
    
    $scope.$digest();
    isolateScope = element.isolateScope();
  });
  
  it('should link functions to the isolateScope', function() {
    expect(isolateScope.inputChange).toBeDefined();
    expect(isolateScope.getName).toBeDefined();
  });
  
  describe('ON inputChange', function() {
    it('should call inputChange', function() {
      isolateScope.inputChange = jasmine.createSpy('inputChange');
      
      var input = element.find('input[type="text"]');
      
      input.val('');
      input.trigger('change');
      
      expect(isolateScope.inputChange).toHaveBeenCalled();
    });
    
    it('should delete the item key if empty', function() {
      var input = element.find('input[type="text"]');
      
      expect(isolateScope.item.field1).toBeDefined();
      
      input.val('');
      input.trigger('change');
      
      expect(isolateScope.item.field1).not.toBeDefined();
    });
    
    it('should not delete the item key if not empty', function() {
      var input = element.find('input[type="text"]');
      
      expect(isolateScope.item.field1).toBeDefined();
      
      input.val('value2');
      input.trigger('change');
      
      expect(isolateScope.item.field1).toBeDefined();
    });
  });
});
