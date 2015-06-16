'use strict';

describe('details directive', function() {
  var $scope,
    $compile,
    User,
    $httpBackend,
    apiHostname;

  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));

  beforeEach(inject(['$compile', '$rootScope', '$injector', 'User', 'apiHostname', function(_$compile_, _$rootScope_, $injector, _User_, _apiHostname_) {
    $scope = _$rootScope_.$new();
    $compile = _$compile_;
    User = _User_;
    $httpBackend = $injector.get('$httpBackend');
    apiHostname = _apiHostname_;
  }]));

  it('should have a function to reset a resource', inject(function() {
    $scope.user = new User({ firstName: 'John', lastName: 'Benson' });

    var ele = $compile('<resource-details resource="user"></resource-details>')($scope);
    $scope.$digest();
    var isolateScope = ele.isolateScope();

    $scope.user.firstName = 'JohnTest';

    isolateScope.cancel();

    expect($scope.user.firstName).toBe('John');
  }));

  it('should not render the body or header if no body or header templates were provided', inject(function () {
    $scope.user = new User({ firstName: 'John', lastName: 'Benson' });

    var ele = $compile('<resource-details resource="user"></resource-details>')($scope);
    $scope.$digest();
    ele.isolateScope();

    var body = ele.find('.detail-body-pane');
    var header = ele.find('.detail-header-pane');

    expect(body.length).toBe(0);
    expect(header.length).toBe(0);
  }));

  it('should render the body and header if a body or header templates are provided', inject(function () {
    $scope.user = new User({ firstName: 'John', lastName: 'Benson' });

    var ele = $compile('<resource-details resource="user" header-template-url="app/components/management/users/userDetailHeader.html" body-template-url="app/components/management/users/userDetailBody.html"></resource-details>')($scope);
    $scope.$digest();
    ele.isolateScope();

    var body = ele.find('.detail-body-pane');
    var header = ele.find('.detail-header-pane');

    expect(body.length).toBe(1);
    expect(header.length).toBe(1);
  }));


  it('should have a function to reset a resource that properly handles saves', inject(function() {
    $scope.user = new User({ firstName: 'John', lastName: 'Benson' });

    var resultUser = angular.copy($scope.user);
    resultUser.firstName = 'Fred';
    resultUser.id = 'abc';

    $httpBackend.when('POST', apiHostname + '/v1/users').respond({'result' : resultUser});
    $httpBackend.expectPOST(apiHostname + '/v1/users');

    var ele = $compile('<resource-details resource="user"></resource-details>')($scope);
    $scope.$digest();
    var isolateScope = ele.isolateScope();

    isolateScope.save();
    $httpBackend.flush();

    isolateScope.cancel();

    expect($scope.user.firstName).toBe('Fred');

  }));

  it('should have a function to save a resource', inject(function() {
    $scope.user = new User({ firstName: 'John', lastName: 'Benson' });

    var resultUser = angular.copy($scope.user);
    resultUser.id = 'abc';

    $httpBackend.when('POST', apiHostname + '/v1/users').respond({'result' : resultUser});
    $httpBackend.expectPOST(apiHostname + '/v1/users');

    var ele = $compile('<resource-details resource="user"></resource-details>')($scope);
    $scope.$digest();
    var isolateScope = ele.isolateScope();

    isolateScope.save();
    $httpBackend.flush();

    expect($scope.user.id).toBe(resultUser.id);

  }));
});