'use strict';

/* global spyOn: false  */
describe('userDetails directive', function () {
  var $scope,
    $compile,
    element;

  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));

  beforeEach(inject(['$compile', '$rootScope', function (_$compile_, _$rootScope_) {
    $scope = _$rootScope_.$new();
    $compile = _$compile_;
  }]));

  var user = {
    firstName: 'Don',
    lastName: 'Cherry',
    displayName: 'Don C.',
    state: 'offline',
    createdBy: '32jasdlfjk-23ljdsfa',
    created: '2015-08-01'
  };
  
  //TODO
  
});
