'use strict';

describe('setStatusBulkAction directive', function() {
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

    element = $compile('<ba-set-status bulk-action="bulkAction"></ba-set-status>')($scope);
    $scope.$digest();
    isolateScope = element.isolateScope();
  });

  it('should override bulkAction.execute', function() {
    expect(isolateScope.bulkAction.apply).toBeDefined();
  });

  it('should should set user.status on bulkAction.execute', inject(['mockUsers', '$httpBackend', 'apiHostname',
    function(mockUsers, $httpBackend, apiHostname) {
      var returnUser = angular.copy(mockUsers[0]);
      returnUser.status = true;

      $httpBackend.when('PUT', apiHostname + '/v1/users/userId1').respond(200, {
        result: returnUser
      });

      isolateScope.status = true;
      isolateScope.bulkAction.apply(mockUsers[0]);

      expect(mockUsers[0].status).toEqual(false);

      $httpBackend.flush();

      expect(mockUsers[0].status).toEqual(true);
    }
  ]));
  
  it('should should only have the attribute in the PUT payload',
    inject(['mockUsers', '$httpBackend', 'apiHostname',
      function (mockUsers, $httpBackend, apiHostname) {
        $httpBackend.expect('PUT', apiHostname + '/v1/users/userId1', {
          status: true
        }).respond(200);

        isolateScope.status = true;
        isolateScope.bulkAction.apply(mockUsers[0]);

        $httpBackend.flush();
      }
    ]));
});
