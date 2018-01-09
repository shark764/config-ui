'use strict';

describe('loExtensionEditor directive', function(){
  var isolateScope;

  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));

  beforeEach(inject(['$compile', '$rootScope', function($compile,$rootScope) {
    var $scope = $rootScope.$new();
    $scope.extension = {type: 'webrtc'};

    var element = $compile('<ng-form><lo-extension-editor extension="extension"></lo-extension-editor></ng-form>')($scope);
    $scope.$digest();

    isolateScope = element.find('lo-extension-editor').isolateScope();
    isolateScope.form = {
      type: {
        $setPristine: jasmine.createSpy('$setPristine'),
        $setUntouched: jasmine.createSpy('$setUntouched'),
        $setValidity: jasmine.createSpy('$setPristine')
      },
      provider: {
        $setPristine: jasmine.createSpy('$setPristine'),
        $setUntouched: jasmine.createSpy('$setUntouched'),
        $setValidity: jasmine.createSpy('$setPristine')
      },
      value: {
        $setPristine: jasmine.createSpy('$setPristine'),
        $setUntouched: jasmine.createSpy('$setUntouched'),
        $setValidity: jasmine.createSpy('$setPristine')
      },
      sipValue: {
        $setPristine: jasmine.createSpy('$setPristine'),
        $setUntouched: jasmine.createSpy('$setUntouched'),
        $setValidity: jasmine.createSpy('$setPristine')
      },
      telValue: {
        $setPristine: jasmine.createSpy('$setPristine'),
        $setUntouched: jasmine.createSpy('$setUntouched'),
        $setValidity: jasmine.createSpy('$setPristine')
      },
      extensiondescription: {
        $setPristine: jasmine.createSpy('$setPristine'),
        $setUntouched: jasmine.createSpy('$setUntouched'),
        $setValidity: jasmine.createSpy('$setPristine')
      },
      extensions: {
        $setPristine: jasmine.createSpy('$setPristine'),
        $setUntouched: jasmine.createSpy('$setUntouched'),
        $setValidity: jasmine.createSpy('$setPristine')
      },
      region: {
        $setPristine: jasmine.createSpy('$setPristine'),
        $setUntouched: jasmine.createSpy('$setUntouched'),
        $setValidity: jasmine.createSpy('$setPristine')
      },
      activeExtension: {
        $setPristine: jasmine.createSpy('$setPristine'),
        $setUntouched: jasmine.createSpy('$setUntouched'),
        $setValidity: jasmine.createSpy('$setPristine'),
        $setDirty: jasmine.createSpy('$setDirty')
      },
      loFormSubmitController: {
        populateApiErrors: jasmine.createSpy('populateApiErrors')
      }
    };
  }]));

  describe('clearValues function', function() {
    it('should reset the form state', function() {
      isolateScope.phoneNumber = '12345678';
      isolateScope.phoneExtension = '1234';
      isolateScope.clearValues();

      expect(isolateScope.phoneNumber).toBeNull();
      expect(isolateScope.phoneExtension).toBeNull();
      expect(isolateScope.sipExtension).toBeNull();

      expect(isolateScope.form.type.$setPristine).toHaveBeenCalled();
      expect(isolateScope.form.type.$setUntouched).toHaveBeenCalled();
      expect(isolateScope.form.provider.$setPristine).toHaveBeenCalled();
      expect(isolateScope.form.provider.$setUntouched).toHaveBeenCalled();
      expect(isolateScope.form.sipValue.$setPristine).toHaveBeenCalled();
      expect(isolateScope.form.sipValue.$setUntouched).toHaveBeenCalled();
      expect(isolateScope.form.telValue.$setPristine).toHaveBeenCalled();
      expect(isolateScope.form.telValue.$setUntouched).toHaveBeenCalled();
      expect(isolateScope.form.extensiondescription.$setPristine).toHaveBeenCalled();
      expect(isolateScope.form.extensiondescription.$setUntouched).toHaveBeenCalled();
    });
  });

  describe('updateExtension function', function() {
    it('should set the sip value, if given', function() {
      isolateScope.sipExtension = 'sip:user@example.com';
      isolateScope.updateExtension();
      expect(isolateScope.extension.value).toEqual('sip:user@example.com');
    });
  });

  describe('updateDisplay function', function() {
    it('should set the $scope.phoneNumber value if the extension is a plain phone number', function() {
      isolateScope.extension = {
        value: '+1-506-555-5555',
        type: 'pstn'
      };

      isolateScope.updateDisplay();
      expect(isolateScope.phoneNumber).toEqual('+1-506-555-5555');
      expect(isolateScope.sipExtension).toBeFalsy();
      expect(isolateScope.phoneExtension).toBeFalsy();
    });

    it('should set the $scope.sipExtension value if given a sip extension', function() {
      isolateScope.extension = {
        value: 'sip:test@example.com',
        type: 'sip'
      };

      isolateScope.updateDisplay();
      expect(isolateScope.phoneNumber).toBeFalsy();
      expect(isolateScope.sipExtension).toEqual('sip:test@example.com');
      expect(isolateScope.phoneExtension).toBeFalsy();
    });
  });
});
