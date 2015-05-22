'use strict';

describe('tabset directive', function() {
  var $scope,
    $compile;

  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));

  beforeEach(inject(['$compile', '$rootScope', function(_$compile_, _$rootScope_) {
    $scope = _$rootScope_.$new();
    $compile = _$compile_;
  }]));

  it('should have empty tabs', inject(function() {
    $compile('<tabset></tabset>')($scope);
    $scope.$digest();
    expect($scope.tabset.tabs).toEqual([]);
  }));

  it('should have one tab with context', inject(function() {
    $compile('<tabset><tab heading="heading1"></tab></tabset>')($scope);
    $scope.$digest();

    expect($scope.tabset.tabs.length).toEqual(1);

    var firstTab = $scope.tabset.tabs[0];

    expect(firstTab.active).toEqual(true);
    expect(firstTab.heading).toEqual('heading1');
  }));

  it('should have two tab with context', inject(function() {
    $compile('<tabset><tab heading="heading1"></tab><tab heading="heading2"></tab></tabset>')($scope);
    $scope.$digest();

    expect($scope.tabset.tabs.length).toEqual(2);

    var firstTab = $scope.tabset.tabs[0];

    expect(firstTab.active).toEqual(true);
    expect(firstTab.heading).toEqual('heading1');

    var secondTab = $scope.tabset.tabs[1];

    expect(secondTab.active).toEqual(false);
    expect(secondTab.heading).toEqual('heading2');
  }));

  it('should generate ul/li/a', inject(function() {
    var element = $compile('<tabset><tab heading="heading1"></tab></tabset>')($scope);
    $scope.$digest();

    var ul = element.find('ul');
    expect(ul.length).toEqual(1);

    var li = ul.find('li');
    expect(li.length).toEqual(1);

    expect(li.hasClass('active')).toEqual(true);

    var a = li.find('a');
    expect(a.length).toEqual(1);
    expect(a.text()).toEqual('heading1');
  }));

  it('should have an active tab and inactive tab', inject(function() {
    var element = $compile('<tabset><tab heading="heading1"></tab><tab heading="heading2"></tab></tabset>')($scope);
    $scope.$digest();

    var ul = element.find('ul');
    expect(ul.length).toEqual(1);

    var firstHeader = ul.find('li');
    expect(firstHeader.length).toEqual(2);

    expect(firstHeader).toBeDefined();
    expect(firstHeader.hasClass('active')).toEqual(true);

    var secondHeader = firstHeader.next();
    expect(secondHeader).toBeDefined();
    expect(secondHeader.hasClass('active')).toEqual(false);
  }));

  it('should have content transcluded in tab elements and first be shown', inject(function() {
    var element = $compile('<tabset><tab heading="heading1">content1</tab><tab heading="heading2">content2</tab></tabset>')($scope);
    $scope.$digest();
    
    
    var transcludeElement = element.find('ng-transclude');
    expect(transcludeElement.length).toEqual(1);
    
    
    var tabElement1 = transcludeElement.find('tab[heading="heading1"]');
    expect(tabElement1.length).toEqual(1);
    
    var contentElement1 = tabElement1.find('div[ng-transclude]');
    expect(contentElement1.length).toEqual(1);
    expect(contentElement1.attr('ng-show')).toEqual('active');
    expect(contentElement1.hasClass('tab')).toEqual(true);
    expect(contentElement1.hasClass('ng-hide')).toEqual(false);
    expect(contentElement1.text()).toEqual('content1');
    
    var tabElement2 = transcludeElement.find('tab[heading="heading2"]');
    expect(tabElement2.length).toEqual(1);
    
    var contentElement2 = tabElement2.find('div[ng-transclude]');
    expect(contentElement2.length).toBeDefined();
    expect(contentElement2.attr('ng-show')).toEqual('active');
    expect(contentElement2.hasClass('tab')).toEqual(true);
    expect(contentElement2.hasClass('ng-hide')).toEqual(true);
    expect(contentElement2.text()).toEqual('content2');
  }));
});