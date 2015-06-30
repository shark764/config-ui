'use strict';

describe('apiError directive', function(){
  var $scope,
    $compile;

  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));

  beforeEach(inject(['$compile', '$rootScope', '$httpBackend', 'apiHostname', function(_$compile_,_$rootScope_, $httpBackend, apiHostname) {
    $scope = _$rootScope_.$new();
    $compile = _$compile_;
    
    $httpBackend.when('GET', apiHostname + '/v1/regions').respond({'result' : [{
      'id': 'c98f5fc0-f91a-11e4-a64e-7f6e9992be1f',
      'description': 'US East (N. Virginia)',
      'name': 'us-east-1'
    }]}); 
    $httpBackend.when('POST', apiHostname + '/v1/login').respond({'result' : {
      'tenants': []
    }});
  }]));

  it('should set the inputs to valid initially', inject(function() {
    $scope.myInput = 5;
    var element = $compile('<ng-form name="myForm"><input name="myInput" ng-model="myInput" api-error></input></ng-form>')($scope);
    $scope.$digest();
    
    $scope.myForm.myInput.$setViewValue('10'); //Force form to call $parsers
    $scope.$digest();
    
    expect(element.find('input').hasClass('ng-valid-api')).toBeTruthy();
  }));
});
