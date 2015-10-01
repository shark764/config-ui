'use strict';

describe('The styling', function() {
  var loginPage = require('../login/login.po.js'),
    shared = require('../shared.po.js'),
    mediaCollections = require('../flows/mediaCollections.po.js'),
    queues = require('../flows/queues.po.js'),
    params = browser.params;

  beforeAll(function() {
    loginPage.login(params.login.user, params.login.password);
  });

  afterAll(function() {
    shared.tearDown();
  });

  describe('for the cancel and submit buttons', function() {
    it('should be the same on the create and edit forms', function() {
      browser.get(shared.usersPageUrl);

      shared.createBtn.click();
      expect(shared.submitFormBtn.getAttribute('class')).toContain('btn btn-primary');
      expect(shared.cancelFormBtn.getAttribute('class')).toBe('btn');

      shared.tableElements.count().then(function(elementCount) {
        if (elementCount > 0) {
          shared.firstTableRow.click();
          expect(shared.submitFormBtn.getAttribute('class')).toContain('btn btn-primary');
          expect(shared.cancelFormBtn.getAttribute('class')).toBe('btn');
        }
      });
    });

    it('should be the same on the bulk actions forms', function() {
      browser.get(shared.usersPageUrl);

      shared.actionsBtn.click();
      expect(shared.submitFormBtn.getAttribute('class')).toContain('btn btn-primary');
      expect(shared.cancelFormBtn.getAttribute('class')).toBe('btn');
    });

    it('should be the same on the Media form on the Media Collections page', function() {
      browser.get(shared.mediaCollectionsPageUrl);

      shared.createBtn.click();
      mediaCollections.openCreateNewMedia();

      expect(mediaCollections.openCreateMediaButton.get(0).getAttribute('class')).toBe('btn');

      expect(mediaCollections.mediaCreateBtn.getAttribute('class')).toContain('btn btn-primary');
      expect(mediaCollections.mediaCreateAndNewBtn.getAttribute('class')).toContain('btn btn-primary');
      expect(mediaCollections.mediaCancelBtn.getAttribute('class')).toBe('btn');
    });

    xit('should be the same when creating a version', function() {
      browser.get(shared.queuesPageUrl);

      shared.tableElements.count().then(function(elementCount) {
        if (elementCount > 0) {
          shared.firstTableRow.click();

          queues.versionRowV1Plus.click();

          expect(queues.copyVersionBtn.getAttribute('class')).toContain('btn btn-primary');
          expect(queues.closeVersionBtn.getAttribute('class')).toBe('btn');
        }
      });
    });
  });

});
