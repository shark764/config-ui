'use strict';

describe('setGroupStatusBulkAction directive', function() {
  var $scope,
    $compile,
    element,
    isolateScope,
    BulkAction;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.mock.content.management.groups'));

  beforeEach(inject(['$compile', '$rootScope', 'BulkAction',
    function(_$compile_, _$rootScope_, _BulkAction) {
      $scope = _$rootScope_.$new();
      $compile = _$compile_;
      BulkAction = _BulkAction;
    }
  ]));

  beforeEach(function() {
    $scope.bulkAction = new BulkAction();

    element = $compile('<ba-set-group-status bulk-action="bulkAction"></ba-set-group-status>')($scope);
    $scope.$digest();
    isolateScope = element.isolateScope();
  });

  it('should override bulkAction.execute', function() {
    expect(isolateScope.bulkAction.apply).toBeDefined();
  });

  it('should should set group.status on bulkAction.execute', inject(['mockGroups', '$httpBackend', 'apiHostname',
    function(mockGroups, $httpBackend, apiHostname) {
      var returnGroup = angular.copy(mockGroups[0]);
      returnGroup.status = true;

      $httpBackend.when('PUT', apiHostname + '/v1/tenants/tenant-id/groups/groupId1').respond(200, {
        result: returnGroup
      });
      
      expect(mockGroups[0].status).toBeFalsy();
      isolateScope.status = true;
      isolateScope.bulkAction.apply(mockGroups[0]);

      $httpBackend.flush();

      expect(mockGroups[0].status).toEqual(true);
    }
  ]));
  
  it('should only have the attribute in the PUT payload',
    inject(['mockGroups', '$httpBackend', 'apiHostname',
      function (mockGroups, $httpBackend, apiHostname) {
        $httpBackend.expect('PUT', apiHostname + '/v1/tenants/tenant-id/groups/groupId1', {
          status: true
        }).respond(200);

        isolateScope.status = true;
        isolateScope.bulkAction.apply(mockGroups[0]);

        $httpBackend.flush();
      }
    ]));
  
  it('should reject the change if attempting to edit the Everyone group', inject(['Group', function (Group) {
          var everyoneGroup = new Group({
            type: 'everyone',
            id: '123456',
            status: true
          });
          
          isolateScope.status = false;
          var result = isolateScope.bulkAction.apply(everyoneGroup);

          result.then(function() {
            throw new Error('Promise should not be resolved');
          }, function(reason) {
            expect(reason.msg).toEqual('Cannot disable the Everyone group.');
          });
          
          expect(everyoneGroup.status).toBeTruthy();
        }
      ]));
});
