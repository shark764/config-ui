'use strict';

describe('filterDropdown directive', function(){
  var $scope,
    element,
    doCompile,
    isolateScope
    ;

  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));

  beforeEach(inject(['$compile', '$rootScope',
    function ($compile, _$rootScope_) {
      $scope = _$rootScope_.$new();

      doCompile = function(){
        element = $compile('<input lo-submit-spinner lo-submit-spinner-status="loading">')($scope);
        $scope.$digest();
        isolateScope = element.isolateScope();
      };
    }
  ]));

  it('should hide the element and show the spinner when loading is true', inject(function() {
    $scope.loading = false;

    doCompile();

    expect(element.hasClass('ng-hide')).toBeFalsy();
    expect(isolateScope.spinnerElement.hasClass('ng-hide')).toBeTruthy();
  }));

  it('should hide the element and show the spinner when loading is true', inject(function() {
    $scope.loading = true;

    doCompile();

    expect(element.hasClass('ng-hide')).toBeTruthy();
    expect(isolateScope.spinnerElement.hasClass('ng-hide')).toBeFalsy();
  }));

});
