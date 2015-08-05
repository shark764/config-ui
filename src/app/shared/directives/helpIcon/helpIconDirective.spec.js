'use strict';

describe('helpIcon directive', function(){
  var $scope,
    isolateScope,
    $compile,
    element
    ;

  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));

  beforeEach(inject(['$compile', '$rootScope', function(_$compile_, $rootScope) {
    $scope = $rootScope.$new();
    $compile = _$compile_;

    element = $compile('<help-icon text="my tooltip text"></help-icon>')($scope);
    $scope.$digest();

    isolateScope = element.isolateScope();
  }]));

  it('should render an icon', inject(function() {
    expect(element.find('i').length).toEqual(2);
    expect(element.find('i').hasClass('fa')).toBeTruthy();
  }));
  
  describe('showTooltip function', function(){
    it('should append a tooltip to the body', inject(['$document', function($document) {
      var mockBody = jasmine.createSpyObj('mockBody', ['append']);
      spyOn($document, 'find').and.returnValue(mockBody);
      isolateScope.showTooltip();
      
      expect($document.find).toHaveBeenCalledWith('body');
      
      var firstAppendArg = mockBody.append.calls.mostRecent().args[0];
      expect(firstAppendArg[0].outerHTML).toContain('</tooltip>');
    }]));
  });
  
  describe('destroyTooltip function', function(){
    it('should remove the tooltip from the body', inject(['$document', function($document) {
      isolateScope.showTooltip();
      
      expect($document.find('tooltip').length).toBe(1);
      
      isolateScope.destroyTooltip();
      
      expect($document.find('tooltip').length).toBe(0);
    }]));
  });
});
