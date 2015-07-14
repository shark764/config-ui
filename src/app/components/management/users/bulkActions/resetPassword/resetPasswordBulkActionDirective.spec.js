'use strict';

describe('resetPasswordBulkAction directive', function() {
  var $scope,
    $compile,
    element,
    isolateScope,
    BulkAction;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.mock.content.management.users'));

  beforeEach(inject(['$compile', '$rootScope', 'BulkAction',
    function(_$compile_, _$rootScope_, _BulkAction) {
      $scope = _$rootScope_.$new();
      $compile = _$compile_;
      BulkAction = _BulkAction;
    }
  ]));

  beforeEach(function() {
    $scope.bulkAction = new BulkAction();

    element = $compile('<ba-reset-password bulk-action="bulkAction"></ba-reset-password>')($scope);
    $scope.$digest();
    isolateScope = element.isolateScope();
  });

  it('should override bulkAction.execute', function() {
    expect(isolateScope.bulkAction.apply).toBeDefined();
  });

  it('should should set user.password on bulkAction.execute', inject(['mockUsers', '$httpBackend', 'apiHostname',
    function(mockUsers, $httpBackend, apiHostname) {
      var returnUser = angular.copy(mockUsers[0]);
      returnUser.password = 'blah';

      $httpBackend.when('PUT', apiHostname + '/v1/users/userId1').respond(200, {
        result: returnUser
      });

      isolateScope.password = 'blah';
      isolateScope.bulkAction.apply(mockUsers[0]);

      expect(mockUsers[0].password).not.toBeDefined();

      $httpBackend.flush();

      expect(mockUsers[0].password).toEqual(isolateScope.password);
    }
  ]));
});
