'use strict';

describe('tabset directive', function () {
  var $scope,
    $compile;

  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));

  beforeEach(inject(['$compile', '$rootScope', function (_$compile_, _$rootScope_) {
    $scope = _$rootScope_.$new();
    $compile = _$compile_;
  }]));

  var user = {
    firstName: 'Don',
    lastName: 'Cherry',
    displayName: 'Don C',
    state: 'offline',
    createdBy: '32jasdlfjk-23ljdsfa',
    created: '2015-08-01'
  };

  var display = {
    firstName: 'Don',
    lastName: 'Cherry',
    displayName: 'Don C.',
    state: 'offline',
    createdBy: '32jasdlfjk-23ljdsfa',
    created: '2015-08-01'
  };

  it('should have display bindings equal to scope', inject(function () {
    $scope.user = user;
    $scope.display = display;

    var element = $compile('<user-details user="user" display="display"></user-details>')($scope);
    $scope.$digest();

    var fullNameDisplayElement = element.find('#user-details-header-name h1');
    expect(fullNameDisplayElement.length).toEqual(1);
    expect(fullNameDisplayElement.text()).toEqual('Don Cherry');

    var displayNameDisplayElement = element.find('#user-details-header-name span h2');
    expect(displayNameDisplayElement.length).toEqual(1);
    expect(displayNameDisplayElement.text()).toEqual('Don C.');

    var createdByDisplayElement = element.find('#user-details-header-name .state-description:first');
    expect(createdByDisplayElement.length).toEqual(1);
    expect(createdByDisplayElement.html()).toEqual('User Created by <b>{John Doh}</b> on <b class="ng-binding">2015-08-01</b>');

    var enabledByDisplayElement = element.find('#user-details-header-name .state-description:last');
    expect(createdByDisplayElement.length).toEqual(1);
    expect(enabledByDisplayElement.html()).toEqual('Enabled by <b>{John Doh}</b> on <b class="ng-binding">2015-08-01</b>');
  }));
});
