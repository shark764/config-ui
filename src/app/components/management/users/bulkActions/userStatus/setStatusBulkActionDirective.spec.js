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
      mockUsers[1].status = false;
      var returnUser = angular.copy(mockUsers[1]);
      returnUser.status = true;

      $httpBackend.when('PUT', apiHostname + '/v1/users/userId2').respond(200, {
        result: returnUser
      });

      isolateScope.status = true;
      isolateScope.bulkAction.apply(mockUsers[1]);

      expect(mockUsers[1].status).toEqual(false);

      $httpBackend.flush();

      expect(mockUsers[1].status).toEqual(true);
    }
  ]));
  
  it('should should only have the attribute in the PUT payload',
    inject(['mockUsers', '$httpBackend', 'apiHostname',
      function (mockUsers, $httpBackend, apiHostname) {
        $httpBackend.expect('PUT', apiHostname + '/v1/users/userId2', {
          status: true
        }).respond(200);

        isolateScope.status = true;
        isolateScope.bulkAction.apply(mockUsers[1]);

        $httpBackend.flush();
      }
    ]));
  
  it('should reject the change if user attempts to disable themselves',
      inject(['mockUsers', function (mockUsers) {
          mockUsers[0].status = true;
          isolateScope.status = false;
          
          var result = isolateScope.bulkAction.apply(mockUsers[0]);

          result.then(function() {
            throw new Error('Promise should not be resolved');
          }, function(reason) {
            expect(reason.msg).toEqual('Cannot disable your own account');
          });
          
          expect(mockUsers[0].status).toBeTruthy();
        }
      ]));
});
