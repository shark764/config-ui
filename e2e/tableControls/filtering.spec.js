'use strict';

describe('The table filters', function() {
  var loginPage = require('../login/login.po.js'),
    shared = require('../shared.po.js'),
    columns = require('./columns.po.js'),
    params = browser.params,
    elementCount;

  beforeEach(function() {
    loginPage.login(params.login.user, params.login.password);
  });

  afterEach(function() {
    shared.tearDown();
  });

  describe('on the Skill Management Page', function() {
    beforeEach(function() {
      browser.get(shared.skillsPageUrl);
      elementCount = shared.tableElements.count();
    });

    it('should display all of the Proficiency options', function() {
      columns.proficiencyTableDropDownLabel.click();

      // All options listed
      expect(columns.dropdownProficiencies.get(0).getText()).toBe('No');
      expect(columns.dropdownProficiencies.get(1).getText()).toBe('Yes');

      // All input is selected by default
      expect(columns.dropdownProficiencyInputs.get(0).isSelected()).toBeTruthy();

      // Remaining inputs are unselected by default
      expect(columns.dropdownProficiencyInputs.get(1).isSelected()).toBeFalsy();
      expect(columns.dropdownProficiencyInputs.get(2).isSelected()).toBeFalsy();
    });

    it('should display rows based on the Proficiency', function() {
      columns.proficiencyTableDropDownLabel.click();

      // Select No from Role drop down
      columns.dropdownProficiencies.get(0).click().then(function() {
        // All input is unselected
        expect(columns.dropdownProficiencyInputs.get(0).isSelected()).toBeFalsy();
        // No input is selected
        expect(columns.dropdownProficiencyInputs.get(1).isSelected()).toBeTruthy();

        columns.proficiencyTableDropDownLabel.click().then(function() {
          shared.tableElements.then(function(rows) {
            for (var i = 0; i < rows.length; ++i) {
              expect(rows[i].getText()).toContain('No');
            };
          });
        });
      }).then(function() {
        columns.proficiencyTableDropDownLabel.click();

        // Select Yes from drop down
        columns.dropdownProficiencies.get(1).click().then(function() {

          // All input is unselected
          expect(columns.dropdownProficiencyInputs.get(0).isSelected()).toBeFalsy();
          // Yes and No inputs are selected
          expect(columns.dropdownProficiencyInputs.get(1).isSelected()).toBeTruthy();
          expect(columns.dropdownProficiencyInputs.get(2).isSelected()).toBeTruthy();

          columns.proficiencyTableDropDownLabel.click().then(function() {
            shared.tableElements.then(function(rows) {
              for (var i = 0; i < rows.length; ++i) {
                expect(['Yes', 'No']).toContain(rows[i].element(by.css('td:nth-child(4)')).getText());
              };
            });
          });
        });
      }).thenFinally(function() {
        columns.proficiencyTableDropDownLabel.click();

        // Select All from Role drop down
        columns.allSkillProficiency.click().then(function() {

          // All input is selected
          expect(columns.dropdownProficiencyInputs.get(0).isSelected()).toBeTruthy();

          // Other inputs are unselected
          expect(columns.dropdownProficiencyInputs.get(1).isSelected()).toBeFalsy();
          expect(columns.dropdownProficiencyInputs.get(2).isSelected()).toBeFalsy();

          columns.proficiencyTableDropDownLabel.click().then(function() {
            expect(shared.tableElements.count()).toBe(elementCount)
          });
        });
      });
    });

    it('should display all of the Status options', function() {
      columns.statusTableDropDownLabel.click();

      // All options listed
      expect(columns.dropdownStatuses.get(0).getText()).toBe('Disabled');
      expect(columns.dropdownStatuses.get(1).getText()).toBe('Enabled');

      // All input is selected by default
      expect(columns.dropdownStatusInputs.get(0).isSelected()).toBeTruthy();

      // Remaining inputs are unselected by default
      expect(columns.dropdownStatusInputs.get(1).isSelected()).toBeFalsy();
      expect(columns.dropdownStatusInputs.get(2).isSelected()).toBeFalsy();
    });

    it('should display rows by Status', function() {
      columns.statusTableDropDownLabel.click();

      // Select input from drop down
      columns.dropdownStatuses.get(0).click().then(function() {
        // All input is unselected
        expect(columns.dropdownStatusInputs.get(0).isSelected()).toBeFalsy();
        // Input is selected
        expect(columns.dropdownStatusInputs.get(1).isSelected()).toBeTruthy();

        columns.statusTableDropDownLabel.click().then(function() {
          shared.tableElements.then(function(rows) {
            for (var i = 0; i < rows.length; ++i) {
              expect(rows[i].getText()).toContain('Disabled');
            };
          });
        });
      }).then(function() {
        columns.statusTableDropDownLabel.click();

        // Select other input from drop down
        columns.dropdownStatuses.get(1).click().then(function() {

          // All input is unselected
          expect(columns.dropdownStatusInputs.get(0).isSelected()).toBeFalsy();
          // Both inputs are selected
          expect(columns.dropdownStatusInputs.get(1).isSelected()).toBeTruthy();
          expect(columns.dropdownStatusInputs.get(2).isSelected()).toBeTruthy();

          columns.statusTableDropDownLabel.click().then(function() {
            shared.tableElements.then(function(rows) {
              for (var i = 0; i < rows.length; ++i) {
                expect(['Enabled', 'Disabled']).toContain(rows[i].element(by.css('td:nth-child(5)')).getText());
              };
            });
          });
        });
      }).thenFinally(function() {
        columns.statusTableDropDownLabel.click();

        // Select All from Role drop down
        columns.allStatus.click().then(function() {

          // All input is selected
          expect(columns.dropdownStatusInputs.get(0).isSelected()).toBeTruthy();

          // Other inputs are unselected
          expect(columns.dropdownStatusInputs.get(1).isSelected()).toBeFalsy();
          expect(columns.dropdownStatusInputs.get(2).isSelected()).toBeFalsy();

          columns.statusTableDropDownLabel.click().then(function() {
            expect(shared.tableElements.count()).toBe(elementCount)
          });
        });
      });
    });

    it('should filter by multiple columns', function() {
      // TODO with TITAN2-2433
      // Select No from Proficiency filter
      columns.proficiencyTableDropDownLabel.click();
      columns.dropdownProficiencies.get(0).click();
      columns.proficiencyTableDropDownLabel.click();

      // Select Enabled from Status filter
      columns.statusTableDropDownLabel.click();
      columns.dropdownStatuses.get(0).click();
      columns.statusTableDropDownLabel.click().then(function() {

        // Ensure only rows that meet both filters are displayed
        shared.tableElements.then(function(rows) {
          for (var i = 0; i < rows.length; ++i) {
            expect(rows[i].getText()).toContain('No');
            expect(rows[i].getText()).toContain('Disabled');
          };
        });
      });
    });
  });

  describe('on the Group Management Page', function() {
    beforeEach(function() {
      browser.get(shared.groupsPageUrl);
      elementCount = shared.tableElements.count();
    });

    it('should display all of the Status options', function() {
      columns.statusTableDropDownLabel.click();

      // All options listed
      expect(columns.dropdownStatuses.get(0).getText()).toBe('Disabled');
      expect(columns.dropdownStatuses.get(1).getText()).toBe('Enabled');

      // All input is selected by default
      expect(columns.dropdownStatusInputs.get(0).isSelected()).toBeTruthy();

      // Remaining inputs are unselected by default
      expect(columns.dropdownStatusInputs.get(1).isSelected()).toBeFalsy();
      expect(columns.dropdownStatusInputs.get(2).isSelected()).toBeFalsy();
    });

    it('should display rows by Status', function() {
      columns.statusTableDropDownLabel.click();

      // Select input from drop down
      columns.dropdownStatuses.get(0).click().then(function() {
        // All input is unselected
        expect(columns.dropdownStatusInputs.get(0).isSelected()).toBeFalsy();
        // Input is selected
        expect(columns.dropdownStatusInputs.get(1).isSelected()).toBeTruthy();

        columns.statusTableDropDownLabel.click().then(function() {
          shared.tableElements.then(function(rows) {
            for (var i = 0; i < rows.length; ++i) {
              expect(rows[i].getText()).toContain('Disabled');
            };
          });
        });
      }).then(function() {
        columns.statusTableDropDownLabel.click();

        // Select other input from drop down
        columns.dropdownStatuses.get(1).click().then(function() {

          // All input is unselected
          expect(columns.dropdownStatusInputs.get(0).isSelected()).toBeFalsy();
          // Both inputs are selected
          expect(columns.dropdownStatusInputs.get(1).isSelected()).toBeTruthy();
          expect(columns.dropdownStatusInputs.get(2).isSelected()).toBeTruthy();

          columns.statusTableDropDownLabel.click().then(function() {
            shared.tableElements.then(function(rows) {
              for (var i = 0; i < rows.length; ++i) {
                expect(['Enabled', 'Disabled']).toContain(rows[i].element(by.css('td:nth-child(5)')).getText());
              };
            });
          });
        });
      }).thenFinally(function() {
        columns.statusTableDropDownLabel.click();

        // Select All from Role drop down
        columns.allStatus.click().then(function() {

          // All input is selected
          expect(columns.dropdownStatusInputs.get(0).isSelected()).toBeTruthy();

          // Other inputs are unselected
          expect(columns.dropdownStatusInputs.get(1).isSelected()).toBeFalsy();
          expect(columns.dropdownStatusInputs.get(2).isSelected()).toBeFalsy();

          columns.statusTableDropDownLabel.click().then(function() {
            expect(shared.tableElements.count()).toBe(elementCount)
          });
        });
      });
    });
  });

  describe('on the Tenant Management Page', function() {
    beforeEach(function() {
      browser.get(shared.tenantsPageUrl);
      elementCount = shared.tableElements.count();
    });

    it('should display all of the Status options', function() {
      columns.statusTableDropDownLabel.click();

      // All options listed
      expect(columns.dropdownStatuses.get(0).getText()).toBe('Disabled');
      expect(columns.dropdownStatuses.get(1).getText()).toBe('Enabled');

      // All input is selected by default
      expect(columns.dropdownStatusInputs.get(0).isSelected()).toBeTruthy();

      // Remaining inputs are unselected by default
      expect(columns.dropdownStatusInputs.get(1).isSelected()).toBeFalsy();
      expect(columns.dropdownStatusInputs.get(2).isSelected()).toBeFalsy();
    });

    it('should display rows by Status', function() {
      columns.statusTableDropDownLabel.click();

      // Select input from drop down
      columns.dropdownStatuses.get(0).click().then(function() {
        // All input is unselected
        expect(columns.dropdownStatusInputs.get(0).isSelected()).toBeFalsy();
        // Input is selected
        expect(columns.dropdownStatusInputs.get(1).isSelected()).toBeTruthy();

        columns.statusTableDropDownLabel.click().then(function() {
          shared.tableElements.then(function(rows) {
            for (var i = 0; i < rows.length; ++i) {
              expect(rows[i].getText()).toContain('Disabled');
            };
          });
        });
      }).then(function() {
        columns.statusTableDropDownLabel.click();

        // Select other input from drop down
        columns.dropdownStatuses.get(1).click().then(function() {

          // All input is unselected
          expect(columns.dropdownStatusInputs.get(0).isSelected()).toBeFalsy();
          // Both inputs are selected
          expect(columns.dropdownStatusInputs.get(1).isSelected()).toBeTruthy();
          expect(columns.dropdownStatusInputs.get(2).isSelected()).toBeTruthy();

          columns.statusTableDropDownLabel.click().then(function() {
            shared.tableElements.then(function(rows) {
              for (var i = 0; i < rows.length; ++i) {
                expect(['Enabled', 'Disabled']).toContain(rows[i].element(by.css('td:nth-child(4)')).getText());
              };
            });
          });
        });
      }).thenFinally(function() {
        columns.statusTableDropDownLabel.click();

        // Select All from Role drop down
        columns.allStatus.click().then(function() {

          // All input is selected
          expect(columns.dropdownStatusInputs.get(0).isSelected()).toBeTruthy();

          // Other inputs are unselected
          expect(columns.dropdownStatusInputs.get(1).isSelected()).toBeFalsy();
          expect(columns.dropdownStatusInputs.get(2).isSelected()).toBeFalsy();

          columns.statusTableDropDownLabel.click().then(function() {
            expect(shared.tableElements.count()).toBe(elementCount)
          });
        });
      });
    });
  });

  describe('on the Interaction Management Page', function() {
    beforeEach(function() {
      browser.get(shared.interactionsPageUrl);
      elementCount = shared.tableElements.count();
    });

    it('should display all of the WebRTC options', function() {
      columns.webRTCTableDropDownLabel.click();

      // All options listed
      expect(columns.dropdownWebRTCOptions.get(0).getText()).toBe('Disabled');
      expect(columns.dropdownWebRTCOptions.get(1).getText()).toBe('Enabled');

      // All input is selected by default
      expect(columns.dropdownWebRTCInputs.get(0).isSelected()).toBeTruthy();

      // Remaining inputs are unselected by default
      expect(columns.dropdownWebRTCInputs.get(1).isSelected()).toBeFalsy();
      expect(columns.dropdownWebRTCInputs.get(2).isSelected()).toBeFalsy();
    });

    it('should display rows by WebRTC', function() {
      columns.webRTCTableDropDownLabel.click();

      // Select input from drop down
      columns.dropdownWebRTCOptions.get(0).click().then(function() {
        // All input is unselected
        expect(columns.dropdownWebRTCInputs.get(0).isSelected()).toBeFalsy();
        // Input is selected
        expect(columns.dropdownWebRTCInputs.get(1).isSelected()).toBeTruthy();

        columns.webRTCTableDropDownLabel.click().then(function() {
          shared.tableElements.then(function(rows) {
            for (var i = 0; i < rows.length; ++i) {
              expect(rows[i].getText()).toContain('Disabled');
            };
          });
        });
      }).then(function() {
        columns.webRTCTableDropDownLabel.click();

        // Select other input from drop down
        columns.dropdownWebRTCOptions.get(1).click().then(function() {

          // All input is unselected
          expect(columns.dropdownWebRTCInputs.get(0).isSelected()).toBeFalsy();
          // Both inputs are selected
          expect(columns.dropdownWebRTCInputs.get(1).isSelected()).toBeTruthy();
          expect(columns.dropdownWebRTCInputs.get(2).isSelected()).toBeTruthy();

          columns.webRTCTableDropDownLabel.click().then(function() {
            shared.tableElements.then(function(rows) {
              for (var i = 0; i < rows.length; ++i) {
                expect(['Enabled', 'Disabled']).toContain(rows[i].element(by.css('td:nth-child(4)')).getText());
              };
            });
          });
        });
      }).thenFinally(function() {
        columns.webRTCTableDropDownLabel.click();

        // Select All from Role drop down
        columns.allWebRTCs.click().then(function() {

          // All input is selected
          expect(columns.dropdownWebRTCInputs.get(0).isSelected()).toBeTruthy();

          // Other inputs are unselected
          expect(columns.dropdownWebRTCInputs.get(1).isSelected()).toBeFalsy();
          expect(columns.dropdownWebRTCInputs.get(2).isSelected()).toBeFalsy();

          columns.webRTCTableDropDownLabel.click().then(function() {
            expect(shared.tableElements.count()).toBe(elementCount)
          });
        });
      });
    });

    it('should display all of the Status options', function() {
      columns.statusTableDropDownLabel.click();

      // All options listed
      expect(columns.dropdownStatuses.get(0).getText()).toBe('Disabled');
      expect(columns.dropdownStatuses.get(1).getText()).toBe('Enabled');

      // All input is selected by default
      expect(columns.dropdownStatusInputs.get(0).isSelected()).toBeTruthy();

      // Remaining inputs are unselected by default
      expect(columns.dropdownStatusInputs.get(1).isSelected()).toBeFalsy();
      expect(columns.dropdownStatusInputs.get(2).isSelected()).toBeFalsy();
    });

    it('should display rows by Status', function() {
      columns.statusTableDropDownLabel.click();

      // Select input from drop down
      columns.dropdownStatuses.get(0).click().then(function() {
        // All input is unselected
        expect(columns.dropdownStatusInputs.get(0).isSelected()).toBeFalsy();
        // Input is selected
        expect(columns.dropdownStatusInputs.get(1).isSelected()).toBeTruthy();

        columns.statusTableDropDownLabel.click().then(function() {
          shared.tableElements.then(function(rows) {
            for (var i = 0; i < rows.length; ++i) {
              expect(rows[i].getText()).toContain('Disabled');
            };
          });
        });
      }).then(function() {
        columns.statusTableDropDownLabel.click();

        // Select other input from drop down
        columns.dropdownStatuses.get(1).click().then(function() {

          // All input is unselected
          expect(columns.dropdownStatusInputs.get(0).isSelected()).toBeFalsy();
          // Both inputs are selected
          expect(columns.dropdownStatusInputs.get(1).isSelected()).toBeTruthy();
          expect(columns.dropdownStatusInputs.get(2).isSelected()).toBeTruthy();

          columns.statusTableDropDownLabel.click().then(function() {
            shared.tableElements.then(function(rows) {
              for (var i = 0; i < rows.length; ++i) {
                expect(['Enabled', 'Disabled']).toContain(rows[i].element(by.css('td:nth-child(4)')).getText());
              };
            });
          });
        });
      }).thenFinally(function() {
        columns.statusTableDropDownLabel.click();

        // Select All from Role drop down
        columns.allStatus.click().then(function() {

          // All input is selected
          expect(columns.dropdownStatusInputs.get(0).isSelected()).toBeTruthy();

          // Other inputs are unselected
          expect(columns.dropdownStatusInputs.get(1).isSelected()).toBeFalsy();
          expect(columns.dropdownStatusInputs.get(2).isSelected()).toBeFalsy();

          columns.statusTableDropDownLabel.click().then(function() {
            expect(shared.tableElements.count()).toBe(elementCount)
          });
        });
      });
    });

    it('should filter by multiple columns', function() {});
  });

  describe('on the Flow Management Page', function() {
    beforeEach(function() {
      browser.get(shared.flowsPageUrl);
      elementCount = shared.tableElements.count();
    });

    it('should display all of the Status options', function() {
      columns.statusTableDropDownLabel.click();

      // All options listed
      expect(columns.dropdownStatuses.get(0).getText()).toBe('Disabled');
      expect(columns.dropdownStatuses.get(1).getText()).toBe('Enabled');

      // All input is selected by default
      expect(columns.dropdownStatusInputs.get(0).isSelected()).toBeTruthy();

      // Remaining inputs are unselected by default
      expect(columns.dropdownStatusInputs.get(1).isSelected()).toBeFalsy();
      expect(columns.dropdownStatusInputs.get(2).isSelected()).toBeFalsy();
    });

    it('should display elements by Status', function() {
      columns.statusTableDropDownLabel.click();

      // Select input from drop down
      columns.dropdownStatuses.get(0).click().then(function() {
        // All input is unselected
        expect(columns.dropdownStatusInputs.get(0).isSelected()).toBeFalsy();
        // Input is selected
        expect(columns.dropdownStatusInputs.get(1).isSelected()).toBeTruthy();

        columns.statusTableDropDownLabel.click().then(function() {
          shared.tableElements.then(function(rows) {
            for (var i = 0; i < rows.length; ++i) {
              expect(rows[i].getText()).toContain('Disabled');
            };
          });
        });
      }).then(function() {
        columns.statusTableDropDownLabel.click();

        // Select other input from drop down
        columns.dropdownStatuses.get(1).click().then(function() {

          // All input is unselected
          expect(columns.dropdownStatusInputs.get(0).isSelected()).toBeFalsy();
          // Both inputs are selected
          expect(columns.dropdownStatusInputs.get(1).isSelected()).toBeTruthy();
          expect(columns.dropdownStatusInputs.get(2).isSelected()).toBeTruthy();

          columns.statusTableDropDownLabel.click().then(function() {
            shared.tableElements.then(function(rows) {
              for (var i = 0; i < rows.length; ++i) {
                expect(['Enabled', 'Disabled']).toContain(rows[i].element(by.css('td:nth-child(5)')).getText());
              };
            });
          });
        });
      }).thenFinally(function() {
        columns.statusTableDropDownLabel.click();

        // Select All from Role drop down
        columns.allStatus.click().then(function() {

          // All input is selected
          expect(columns.dropdownStatusInputs.get(0).isSelected()).toBeTruthy();

          // Other inputs are unselected
          expect(columns.dropdownStatusInputs.get(1).isSelected()).toBeFalsy();
          expect(columns.dropdownStatusInputs.get(2).isSelected()).toBeFalsy();

          columns.statusTableDropDownLabel.click().then(function() {
            expect(shared.tableElements.count()).toBe(elementCount)
          });
        });
      });
    });
  });

  describe('on the Queue Management Page', function() {
    beforeEach(function() {
      browser.get(shared.queuesPageUrl);
      elementCount = shared.tableElements.count();
    });

    it('should display all of the Status options', function() {
      columns.statusTableDropDownLabel.click();

      // All options listed
      expect(columns.dropdownStatuses.get(0).getText()).toBe('Disabled');
      expect(columns.dropdownStatuses.get(1).getText()).toBe('Enabled');

      // All input is selected by default
      expect(columns.dropdownStatusInputs.get(0).isSelected()).toBeTruthy();

      // Remaining inputs are unselected by default
      expect(columns.dropdownStatusInputs.get(1).isSelected()).toBeFalsy();
      expect(columns.dropdownStatusInputs.get(2).isSelected()).toBeFalsy();
    });

    it('should display rows by Status', function() {
      columns.statusTableDropDownLabel.click();

      // Select input from drop down
      columns.dropdownStatuses.get(0).click().then(function() {
        // All input is unselected
        expect(columns.dropdownStatusInputs.get(0).isSelected()).toBeFalsy();
        // Input is selected
        expect(columns.dropdownStatusInputs.get(1).isSelected()).toBeTruthy();

        columns.statusTableDropDownLabel.click().then(function() {
          shared.tableElements.then(function(rows) {
            for (var i = 0; i < rows.length; ++i) {
              expect(rows[i].getText()).toContain('Disabled');
            };
          });
        });
      }).then(function() {
        columns.statusTableDropDownLabel.click();

        // Select other input from drop down
        columns.dropdownStatuses.get(1).click().then(function() {

          // All input is unselected
          expect(columns.dropdownStatusInputs.get(0).isSelected()).toBeFalsy();
          // Both inputs are selected
          expect(columns.dropdownStatusInputs.get(1).isSelected()).toBeTruthy();
          expect(columns.dropdownStatusInputs.get(2).isSelected()).toBeTruthy();

          columns.statusTableDropDownLabel.click().then(function() {
            shared.tableElements.then(function(rows) {
              for (var i = 0; i < rows.length; ++i) {
                expect(['Enabled', 'Disabled']).toContain(rows[i].element(by.css('td:nth-child(5)')).getText());
              };
            });
          });
        });
      }).thenFinally(function() {
        columns.statusTableDropDownLabel.click();

        // Select All from Role drop down
        columns.allStatus.click().then(function() {

          // All input is selected
          expect(columns.dropdownStatusInputs.get(0).isSelected()).toBeTruthy();

          // Other inputs are unselected
          expect(columns.dropdownStatusInputs.get(1).isSelected()).toBeFalsy();
          expect(columns.dropdownStatusInputs.get(2).isSelected()).toBeFalsy();

          columns.statusTableDropDownLabel.click().then(function() {
            expect(shared.tableElements.count()).toBe(elementCount)
          });
        });
      });
    });
  });

  describe('on the Media Collection Management Page', function() {
    beforeEach(function() {
      browser.get(shared.mediaCollectionsPageUrl);
      elementCount = shared.tableElements.count();
    });

    it('should not have any column filters', function() {
      expect(columns.allFilterDropDowns.count()).toBe(0);
    });
  });

  describe('on the Media Management Page', function() {
    beforeEach(function() {
      browser.get(shared.mediaPageUrl);
      elementCount = shared.tableElements.count();
    });

    it('should display all of the Type options', function() {
      columns.typeTableDropDownLabel.click();

      // All listed
      expect(columns.dropdownTypes.get(0).getText()).toBe('Audio');
      expect(columns.dropdownTypes.get(1).getText()).toBe('TTS');

      // All input is selected by default
      expect(columns.dropdownTypeInputs.get(0).isSelected()).toBeTruthy();

      // Remaining inputs are unselected by default
      expect(columns.dropdownTypeInputs.get(1).isSelected()).toBeFalsy();
      expect(columns.dropdownTypeInputs.get(2).isSelected()).toBeFalsy();
    });

    it('should display rows by Type', function() {
      columns.typeTableDropDownLabel.click();

      // Select input from drop down
      columns.dropdownTypes.get(0).click().then(function() {
        // All input is unselected
        expect(columns.dropdownTypeInputs.get(0).isSelected()).toBeFalsy();
        // Input is selected
        expect(columns.dropdownTypeInputs.get(1).isSelected()).toBeTruthy();

        columns.typeTableDropDownLabel.click().then(function() {
          shared.tableElements.then(function(rows) {
            for (var i = 0; i < rows.length; ++i) {
              expect(rows[i].getText()).toContain('audio');
            };
          });
        });
      }).then(function() {
        columns.typeTableDropDownLabel.click();

        // Select other input from drop down
        columns.dropdownTypes.get(1).click().then(function() {

          // All input is unselected
          expect(columns.dropdownTypeInputs.get(0).isSelected()).toBeFalsy();
          // Both inputs are selected
          expect(columns.dropdownTypeInputs.get(1).isSelected()).toBeTruthy();
          expect(columns.dropdownTypeInputs.get(2).isSelected()).toBeTruthy();

          columns.typeTableDropDownLabel.click().then(function() {
            shared.tableElements.then(function(rows) {
              for (var i = 0; i < rows.length; ++i) {
                expect(['audio', 'tts']).toContain(rows[i].element(by.css('td:nth-child(4)')).getText());
              };
            });
          });
        });
      }).thenFinally(function() {
        columns.typeTableDropDownLabel.click();

        // Select All from Role drop down
        columns.allTypes.click().then(function() {

          // All input is selected
          expect(columns.dropdownTypeInputs.get(0).isSelected()).toBeTruthy();

          // Other inputs are unselected
          expect(columns.dropdownTypeInputs.get(1).isSelected()).toBeFalsy();
          expect(columns.dropdownTypeInputs.get(2).isSelected()).toBeFalsy();

          columns.typeTableDropDownLabel.click().then(function() {
            expect(shared.tableElements.count()).toBe(elementCount)
          });
        });
      });
    });
  });

  describe('on the Dispatch Mapping Management Page', function() {
    beforeEach(function() {
      browser.get(shared.dispatchMappingsPageUrl);
      elementCount = shared.tableElements.count();
    });

    it('should display all of the Interaction options', function() {
      columns.interactionTableDropDownLabel.click();

      // All options listed
      expect(columns.dropdownInteractions.get(0).getText()).toBe('Customer');
      expect(columns.dropdownInteractions.get(1).getText()).toBe('Contact Point');
      expect(columns.dropdownInteractions.get(2).getText()).toBe('Integration');
      expect(columns.dropdownInteractions.get(3).getText()).toBe('Direction');

      // All input is selected by default
      expect(columns.dropdownInteractionInputs.get(0).isSelected()).toBeTruthy();

      // Remaining inputs are unselected by default
      expect(columns.dropdownInteractionInputs.get(1).isSelected()).toBeFalsy();
      expect(columns.dropdownInteractionInputs.get(2).isSelected()).toBeFalsy();
      expect(columns.dropdownInteractionInputs.get(3).isSelected()).toBeFalsy();
      expect(columns.dropdownInteractionInputs.get(4).isSelected()).toBeFalsy();
    });

    it('should display rows by Interaction', function() {
      columns.interactionTableDropDownLabel.click();

      // Select input from drop down
      columns.dropdownInteractions.get(0).click().then(function() {
        // All input is unselected
        expect(columns.dropdownInteractionInputs.get(0).isSelected()).toBeFalsy();
        // Input is selected
        expect(columns.dropdownInteractionInputs.get(1).isSelected()).toBeTruthy();

        columns.interactionTableDropDownLabel.click().then(function() {
          shared.tableElements.then(function(rows) {
            for (var i = 0; i < rows.length; ++i) {
              expect(rows[i].getText()).toContain('customer');
            };
          });
        });
      }).then(function() {
        columns.interactionTableDropDownLabel.click();

        // Select other input from drop down
        columns.dropdownInteractions.get(3).click().then(function() {

          // All input is unselected
          expect(columns.dropdownInteractionInputs.get(0).isSelected()).toBeFalsy();
          // Both inputs are selected
          expect(columns.dropdownInteractionInputs.get(1).isSelected()).toBeTruthy();
          expect(columns.dropdownInteractionInputs.get(4).isSelected()).toBeTruthy();

          columns.interactionTableDropDownLabel.click().then(function() {
            shared.tableElements.then(function(rows) {
              for (var i = 0; i < rows.length; ++i) {
                expect(['customer', 'direction']).toContain(rows[i].element(by.css('td:nth-child(5)')).getText());
              };
            });
          });
        });
      }).thenFinally(function() {
        columns.interactionTableDropDownLabel.click();

        // Select All from Role drop down
        columns.allInteractions.click().then(function() {

          // All input is selected
          expect(columns.dropdownInteractionInputs.get(0).isSelected()).toBeTruthy();

          // Other inputs are unselected
          expect(columns.dropdownInteractionInputs.get(1).isSelected()).toBeFalsy();
          expect(columns.dropdownInteractionInputs.get(2).isSelected()).toBeFalsy();

          columns.interactionTableDropDownLabel.click().then(function() {
            expect(shared.tableElements.count()).toBe(elementCount)
          });
        });
      });
    });

    it('should display all of the Channel Type options', function() {
      columns.channelTypeTableDropDownLabel.click();

      // All options listed
      expect(columns.dropdownChannelTypes.get(0).getText()).toBe('Voice');

      // All input is selected by default
      expect(columns.dropdownChannelTypeInputs.get(0).isSelected()).toBeTruthy();

      // Remaining inputs are unselected by default
      expect(columns.dropdownChannelTypeInputs.get(1).isSelected()).toBeFalsy();
    });

    it('should display rows by Channel Type', function() {
      columns.channelTypeTableDropDownLabel.click();

      // Select input from drop down
      columns.dropdownChannelTypes.get(0).click().then(function() {
        // All input is unselected
        expect(columns.dropdownChannelTypeInputs.get(0).isSelected()).toBeFalsy();
        // Input is selected
        expect(columns.dropdownChannelTypeInputs.get(1).isSelected()).toBeTruthy();

        columns.channelTypeTableDropDownLabel.click().then(function() {
          shared.tableElements.then(function(rows) {
            for (var i = 0; i < rows.length; ++i) {
              expect(rows[i].getText()).toContain('voice');
            };
          });
        });
      }).thenFinally(function() {
        columns.channelTypeTableDropDownLabel.click();

        // Select All from Role drop down
        columns.allChannelTypes.click().then(function() {

          // All input is selected
          expect(columns.dropdownChannelTypeInputs.get(0).isSelected()).toBeTruthy();

          // Other inputs are unselected
          expect(columns.dropdownChannelTypeInputs.get(1).isSelected()).toBeFalsy();

          columns.channelTypeTableDropDownLabel.click().then(function() {
            expect(shared.tableElements.count()).toBe(elementCount)
          });
        });
      });
    });

    it('should display all of the Status options', function() {
      columns.statusTableDropDownLabel.click();

      // All options listed
      expect(columns.dropdownStatuses.get(0).getText()).toBe('Disabled');
      expect(columns.dropdownStatuses.get(1).getText()).toBe('Enabled');

      // All input is selected by default
      expect(columns.dropdownStatusInputs.get(0).isSelected()).toBeTruthy();

      // Remaining inputs are unselected by default
      expect(columns.dropdownStatusInputs.get(1).isSelected()).toBeFalsy();
      expect(columns.dropdownStatusInputs.get(2).isSelected()).toBeFalsy();
    });

    it('should display rows by Status', function() {
      columns.statusTableDropDownLabel.click();

      // Select input from drop down
      columns.dropdownStatuses.get(0).click().then(function() {
        // All input is unselected
        expect(columns.dropdownStatusInputs.get(0).isSelected()).toBeFalsy();
        // Input is selected
        expect(columns.dropdownStatusInputs.get(1).isSelected()).toBeTruthy();

        columns.statusTableDropDownLabel.click().then(function() {
          shared.tableElements.then(function(rows) {
            for (var i = 0; i < rows.length; ++i) {
              expect(rows[i].getText()).toContain('Disabled');
            };
          });
        });
      }).then(function() {
        columns.statusTableDropDownLabel.click();

        // Select other input from drop down
        columns.dropdownStatuses.get(1).click().then(function() {

          // All input is unselected
          expect(columns.dropdownStatusInputs.get(0).isSelected()).toBeFalsy();
          // Both inputs are selected
          expect(columns.dropdownStatusInputs.get(1).isSelected()).toBeTruthy();
          expect(columns.dropdownStatusInputs.get(2).isSelected()).toBeTruthy();

          columns.statusTableDropDownLabel.click().then(function() {
            shared.tableElements.then(function(rows) {
              for (var i = 0; i < rows.length; ++i) {
                expect(['Enabled', 'Disabled']).toContain(rows[i].element(by.css('td:nth-child(7)')).getText());
              };
            });
          });
        });
      }).thenFinally(function() {
        columns.statusTableDropDownLabel.click();

        // Select All from Role drop down
        columns.allStatus.click().then(function() {

          // All input is selected
          expect(columns.dropdownStatusInputs.get(0).isSelected()).toBeTruthy();

          // Other inputs are unselected
          expect(columns.dropdownStatusInputs.get(1).isSelected()).toBeFalsy();
          expect(columns.dropdownStatusInputs.get(2).isSelected()).toBeFalsy();

          columns.statusTableDropDownLabel.click().then(function() {
            expect(shared.tableElements.count()).toBe(elementCount)
          });
        });
      });
    });

    it('should filter by multiple columns', function() {
      // TODO with TITAN2-2433
    });
  });

});
