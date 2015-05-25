'use strict';

describe('resizeHandle directive', function(){
  var $scope,
    $compile,
    element;
  
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular')); 
  
  beforeEach(inject(['$compile', '$rootScope', '$document', function(_$compile_,_$rootScope_, $document) {
    $scope = _$rootScope_.$new();
    $compile = _$compile_;
    
    var target = $compile('<div id="container" style="width: 500px;"></div>')($scope);
    angular.element($document[0].body).append(target);
    element = $compile('<resize-handle element-id="container" min-width="200" max-width="800"></resize-handle>')($scope);
    $scope.$digest();
  }]));

  it('should add div with the resizable-handle class', inject(function() {
    var handle = element[0].querySelectorAll('.resizable-handle');
    expect(angular.element(handle).hasClass('resizable-handle')).toBe(true);
  }));
});
