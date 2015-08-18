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
  beforeEach(module('liveopsConfigPanel.mock.content.management.tenantUsers'));

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

  it('should should set user.status on bulkAction.execute', inject(['mockUsers', 'mockTenantUsers', '$httpBackend', 'apiHostname',
    function(mockUsers, mockTenantUsers, $httpBackend, apiHostname) {
      mockUsers[1].status = 'disabled';
      var returnUser = angular.copy(mockUsers[1]);
      returnUser.status = 'enabled';

      $httpBackend.when('PUT', apiHostname + '/v1/users/userId2').respond(200, {
        result: returnUser
      });
      
      mockTenantUsers[1].$user = mockUsers[1];
      
      isolateScope.status = 'enabled';
      isolateScope.bulkAction.apply(mockTenantUsers[1]);

      expect(mockUsers[1].status).toEqual('disabled');

      $httpBackend.flush();

      expect(mockUsers[1].status).toEqual('enabled');
    }
  ]));
  
  it('should should only have the attribute in the PUT payload',
    inject(['mockUsers', '$httpBackend', 'apiHostname',
      function (mockUsers, $httpBackend, apiHostname) {
        $httpBackend.expect('PUT', apiHostname + '/v1/users/userId2', {
          status: 'enabled'
        }).respond(200);

        isolateScope.status = 'enabled';
        isolateScope.bulkAction.apply(mockUsers[1]);

        $httpBackend.flush();
      }
    ]));
  
  it('should reject the change if user attempts to disable themselves',
      inject(['mockUsers', function (mockUsers) {
          mockUsers[0].status = 'enabled';
          isolateScope.status = 'disabled';
          
          var result = isolateScope.bulkAction.apply(mockUsers[0]);

          result.then(function() {
            throw new Error('Promise should not be resolved');
          }, function(reason) {
            expect(reason.msg).toEqual('Cannot disable your own account');
          });
          
          expect(mockUsers[0].status).toEqual('enabled');
        }
      ]));
});
