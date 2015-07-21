'use strict';

describe('concatStrings directive', function(){
  var $scope,
    $compile,
    $templateCache,
    $httpBackend;

  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel.mock.content'));

  beforeEach(inject(['$compile', '$rootScope', '$templateCache', '$httpBackend', function(_$compile_, _$rootScope_, _$templateCache_, _$httpBackend_) {
    $scope = _$rootScope_.$new();
    $compile = _$compile_;
    $templateCache = _$templateCache_;
    $httpBackend = _$httpBackend_;
  }]));

  it('should retrieve a template from cache and make it the content of its element', inject(function() {
    $templateCache.put('thing.html', 'Hello');

    var element = $compile('<div compiled-include="thing.html"></div>')($scope);
    $scope.$digest();
    expect(element.text()).toEqual('Hello');
  }));

  it('should make a GET to retrieve the template, place it in cache, and make it the content of its element', inject(function() {
    $httpBackend.expectGET('other.html').respond(200, 'Goodbye');
    var element = $compile('<div compiled-include="other.html"></div>')($scope);
    $scope.$digest();
    $httpBackend.flush();

    expect(element.text()).toEqual('Goodbye');
    expect($templateCache.get('other.html')).toEqual('Goodbye');
  }));
});
