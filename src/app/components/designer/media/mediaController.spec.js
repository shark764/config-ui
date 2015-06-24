'use strict';
// jshint unused:false
describe('MediaController', function () {
  var $scope,
    $controller,
    $httpBackend,
    apiHostname,
    Session,
    medias,
    Media,
    apiHostname,
    routeParams;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel', 'liveopsConfigPanel.mock.content.designer.media.mediaController'));
  beforeEach(inject(['$rootScope', '$controller', '$httpBackend', 'Media', 'apiHostname', 'Session', 'medias',
    function ($rootScope, _$controller_, _$httpBackend_, _Media_, _apiHostname_, _Session_, medias) {
      $scope = $rootScope.$new();
      $controller = _$controller_;
      $httpBackend = _$httpBackend_;
      Media = _Media_;
      apiHostname = _apiHostname_;
      Session = _Session_;
      
      $httpBackend.when('GET', apiHostname + '/v1/tenants/' + Session.tenant.tenantId + '/media').respond({
        'result': medias
      });
      
      $controller('MediaController', {
        '$scope': $scope
      });
      
      $httpBackend.flush();
    }
  ]));
  
  it('should do somehting', function() {
    
  })
});