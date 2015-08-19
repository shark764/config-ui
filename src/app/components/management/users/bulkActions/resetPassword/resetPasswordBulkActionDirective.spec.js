'use strict';

describe('resetPasswordBulkAction directive', function () {
  var $scope,
    $compile,
    element,
    isolateScope,
    BulkAction;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.mock.content.management.users'));
  beforeEach(module('liveopsConfigPanel.mock.content.management.tenantUsers'));

  beforeEach(inject(['$compile', '$rootScope', 'BulkAction',
    function (_$compile_, _$rootScope_, _BulkAction) {
      $scope = _$rootScope_.$new();
      $compile = _$compile_;
      BulkAction = _BulkAction;
    }
  ]));

  beforeEach(function () {
    $scope.bulkAction = new BulkAction();

    element = $compile('<ba-reset-password bulk-action="bulkAction"></ba-reset-password>')($scope);
    $scope.$digest();
    isolateScope = element.isolateScope();
  });

  it('should override bulkAction.execute', function () {
    expect(isolateScope.bulkAction.apply).toBeDefined();
  });

  it('should should set user.password on bulkAction.execute', inject(['mockUsers', 'mockTenantUsers', '$httpBackend', 'apiHostname',
    function (mockUsers, mockTenantUsers, $httpBackend, apiHostname) {
      var returnUser = angular.copy(mockUsers[0]);
      returnUser.password = 'blah';

      $httpBackend.when('PUT', apiHostname + '/v1/users/userId1').respond(200, {
        result: returnUser
      });
      
      mockTenantUsers[0].$user = mockUsers[0];
      
      isolateScope.password = 'blah';
      isolateScope.bulkAction.apply(mockTenantUsers[0]);

      expect(mockUsers[0].password).not.toBeDefined();

      $httpBackend.flush();

      expect(mockUsers[0].password).toEqual(isolateScope.password);
    }
  ]));

  it('should should only have the attribute in the PUT payload',
    inject(['mockUsers', '$httpBackend', 'apiHostname',
      function (mockUsers, $httpBackend, apiHostname) {
        $httpBackend.expect('PUT', apiHostname + '/v1/users/userId1', {
          password: 'blah'
        }).respond(200);

        isolateScope.password = 'blah';
        isolateScope.bulkAction.apply(mockUsers[0]);

        $httpBackend.flush();
      }
    ]));
});