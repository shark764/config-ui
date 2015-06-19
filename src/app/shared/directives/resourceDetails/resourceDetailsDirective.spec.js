'use strict';

describe('resource details directive', function() {
  var $scope,
    $compile,
    User,
    $httpBackend,
    apiHostname,
    $templateCache,
    Session;

  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));

  beforeEach(inject(['$compile', '$rootScope', '$injector', 'User', 'apiHostname', '$templateCache', 'Session',
    function(_$compile_, _$rootScope_, $injector, _User_, _apiHostname_, _$templateCache_, _Session_) {
    $scope = _$rootScope_.$new();
    $compile = _$compile_;
    $templateCache = _$templateCache_;

    User = _User_;
    $httpBackend = $injector.get('$httpBackend');
    apiHostname = _apiHostname_;
    Session = _Session_;

    Session.tenant = {
      tenantId: 1
    };
  }]));

  it('should have a function to reset a resource', inject(function() {
    $scope.user = new User({ firstName: 'John', lastName: 'Benson' });

    var ele = $compile('<resource-details original-resource="user"></resource-details>')($scope);
    $scope.$digest();
    var isolateScope = ele.isolateScope();

    isolateScope.resource.firstName = 'JohnTest';

    isolateScope.cancel();

    expect(isolateScope.resource.firstName).toBe('John');
  }));

  it('should not render the body or header if no body or header templates were provided', inject(function () {
    $scope.user = new User({ firstName: 'John', lastName: 'Benson' });

    var ele = $compile('<resource-details original-resource="user"></resource-details>')($scope);
    $scope.$digest();

    var body = ele.find('#detail-body-pane');
    var header = ele.find('#detail-header-pane');

    expect(body.length).toBe(0);
    expect(header.length).toBe(0);
  }));

  it('should render the body and header if a body or header templates are provided', inject(function () {

    $httpBackend.when('GET', apiHostname + '/v1/tenants/' + Session.tenant.tenantId + '/skills').respond({'result' : []});
    $httpBackend.expectGET(apiHostname + '/v1/tenants/' + Session.tenant.tenantId + '/skills');

    $scope.user = new User({ id: 1, firstName: 'John', lastName: 'Benson' });

    $templateCache.put('body.html', '<detail-body-pane></detail-body-pane>');
    $templateCache.put('header.html', '<detail-header-pane></detail-header-pane>');
    var ele = $compile('<resource-details original-resource="user" header-template-url="header.html" body-template-url="body.html"></resource-details>')($scope);
    $scope.$digest();

    var body = ele.find('detail-body-pane');
    var header = ele.find('detail-header-pane');

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

    var ele = $compile('<resource-details original-resource="user"></resource-details>')($scope);
    $scope.$digest();
    var isolateScope = ele.isolateScope();

    isolateScope.save();
    $httpBackend.flush();

    isolateScope.cancel();

    expect(isolateScope.resource.firstName).toBe('Fred');

  }));

  it('should have a function to save a resource', inject(function() {
    $scope.user = new User({ firstName: 'John', lastName: 'Benson' });

    var resultUser = angular.copy($scope.user);
    resultUser.id = 'abc';

    $httpBackend.when('POST', apiHostname + '/v1/users').respond({'result' : resultUser});
    $httpBackend.expectPOST(apiHostname + '/v1/users');

    var ele = $compile('<resource-details original-resource="user"></resource-details>')($scope);
    $scope.$digest();
    var isolateScope = ele.isolateScope();

    isolateScope.save();
    $httpBackend.flush();

    expect(isolateScope.resource.id).toBe(resultUser.id);

  }));
});
