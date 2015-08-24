'use strict';

describe('auditText directive', function () {
  var $scope,
    $compile,
    element,
    isolateScope;

  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel.mock.content.management.users'));

  beforeEach(module('pascalprecht.translate', function ($translateProvider) {
    $translateProvider.translations('en', {
      'value.displayName': '{{displayName}}',
      'plain.value': 'A string'
    });

    $translateProvider.preferredLanguage('en');
  }));

  beforeEach(inject(['$compile', '$rootScope', 'mockUsers',
    function (_$compile, $rootScope, mockUsers) {
      $scope = $rootScope.$new();
      $compile = _$compile;

      $scope.user = mockUsers[0];
    }
  ]));

  describe('refresh function', function () {
    it('should do a plain translate if not given a userId', function () {
      element = $compile('<audit-text translation="plain.value"></audit-text>')($scope);
      $scope.$digest();
      isolateScope = element.isolateScope();

      var text = isolateScope.get();
      expect(text).toEqual('A string');
    });

    it('should translate the displayname with the one returned by usercache',
      inject(['$httpBackend', '$q', 'User', 'apiHostname', 'mockUsers',
        function ($httpBackend, $q, User, apiHostname, mockUsers) {
          $httpBackend.expect('GET', apiHostname + '/v1/users/userId1').respond(mockUsers[0]);

          element = $compile('<audit-text translation="value.displayName" user-id="user.id"></audit-text>')($scope);
          $scope.$digest();
          isolateScope = element.isolateScope();

          isolateScope.get();

          $httpBackend.flush();

          expect(isolateScope.text).toEqual('Munoz Lowe');
        }
      ]));
  });

});