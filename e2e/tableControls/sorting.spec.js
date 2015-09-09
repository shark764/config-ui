'use strict';

describe('The table sorting', function() {
  var loginPage = require('../login/login.po.js'),
    shared = require('../shared.po.js'),
    columns = require('./columns.po.js'),
    users = require('../management/users.po.js'),
    params = browser.params,
    elementCount;

  beforeEach(function() {
    loginPage.login(params.login.user, params.login.password);
  });

  afterAll(function() {
    shared.tearDown();
  });

  describe('for the User Management page', function() {
    beforeEach(function() {
      elementCount = shared.tableElements.count();
    });

    it('should default by alphebetical last name', function() {
      // Sorted icon displayed
      expect(columns.columnTwoHeader.element(by.css(columns.sortIconArrowDown)).isDisplayed()).toBeTruthy();
      expect(columns.displayedSortIcons.count()).toBe(1);

      // Not displayed on remaining columns
      expect(columns.columnThreeHeader.element(by.css(columns.sortIconArrowDown)).isDisplayed()).toBeFalsy();
      expect(columns.columnFourHeader.element(by.css(columns.sortIconArrowDown)).isDisplayed()).toBeFalsy();
      expect(columns.columnFiveHeader.element(by.css(columns.sortIconArrowDown)).isDisplayed()).toBeFalsy();
      expect(columns.columnSixHeader.element(by.css(columns.sortIconArrowDown)).isDisplayed()).toBeFalsy();
      expect(columns.columnSevenHeader.element(by.css(columns.sortIconArrowDown)).isDisplayed()).toBeFalsy();
      expect(columns.columnEightHeader.element(by.css(columns.sortIconArrowDown)).isDisplayed()).toBeFalsy();

      // Verify sorted order
      var previousLastName;

      shared.tableElements.then(function(rows) {
        expect(rows.length).toBe(elementCount);
        for (var i = 0; i < rows.length; ++i) {
          if (i == 0) {
            rows[i].click();
            previousLastName = users.lastNameFormField.getAttribute('value');
          } else {
            // Current last name is greater than or equal to the previous last name
            expect(users.lastNameFormField.getAttribute('value')).not.toBeLessThan(previousLastName);
            previousLastName = users.lastNameFormField.getAttribute('value');
          }
        };
      });
    });

    it('should reverse sorted order when the same column header is selected', function() {
      // Select column header
      columns.columnTwoHeader.click();

      // Sorted icon displayed
      expect(columns.columnTwoHeader.element(by.css(columns.sortIconArrowDown)).isPresent()).toBeFalsy();
      expect(columns.columnTwoHeader.element(by.css(columns.sortIconArrowUp)).isDisplayed()).toBeTruthy();
      expect(columns.displayedSortIcons.count()).toBe(1);

      // Verify reversed sorted order
      var previousLastName;

      shared.tableElements.then(function(rows) {
        expect(rows.length).toBe(elementCount);
        for (var i = 0; i < rows.length; ++i) {
          if (i == 0) {
            rows[i].click();
            previousLastName = users.lastNameFormField.getAttribute('value');
          } else {
            // Current last name is less than or equal to the previous last name
            expect(users.lastNameFormField.getAttribute('value')).not.toBeGreaterThan(previousLastName);
            previousLastName = users.lastNameFormField.getAttribute('value');
          }
        };
      });
    });

    it('should update sorted order when different column headers are selected', function() {
      // Select column header
      columns.columnThreeHeader.click();

      // Sorted icon displayed
      expect(columns.columnTwoHeader.element(by.css(columns.sortIconArrowDown)).isDisplayed()).toBeFalsy();
      expect(columns.columnThreeHeader.element(by.css(columns.sortIconArrowDown)).isDisplayed()).toBeTruthy();
      expect(columns.displayedSortIcons.count()).toBe(1);

      // Verify sorted order
      shared.tableElements.then(function(rows) {
        expect(rows.length).toBe(elementCount);
        for (var i = 1; i < rows.length; ++i) {
          // Current row value is greater than or equal to the previous row value
          expect(rows[i].all(by.css('td')).get(2).getText()).not.toBeLessThan(rows[i - 1].all(by.css('td')).get(2).getText());
        };
      });
    });

    it('should sort by each default column', function() {
      // Select column header
      columns.sortableHeaders.each(function(columnHeader, columnNum) {
        // Select column
        columnHeader.click();

        // Sorted icon displayed
        expect(columnHeader.element(by.css(columns.sortIconArrowDown)).isDisplayed()).toBeTruthy();
        expect(columns.displayedSortIcons.count()).toBe(1);

        // Verify sorted order
        shared.tableElements.then(function(rows) {
          for (var i = 1; i < rows.length; ++i) {
            // Current row value is greater than or equal to the previous row value
            expect(rows[i].all(by.css('td')).get(columnNum).getText()).not.toBeLessThan(rows[i - 1].all(by.css('td')).get(columnNum).getText());
          };
        }).then(function() {
          // Reverse sorted order
          columnHeader.click();

          // Sorted icon displayed
          expect(columnHeader.element(by.css(columns.sortIconArrowUp)).isDisplayed()).toBeTruthy();
          expect(columns.displayedSortIcons.count()).toBe(1);

          // Verify sorted order
          shared.tableElements.then(function(rows) {
            expect(rows.length).toBe(elementCount);
            for (var i = 1; i < rows.length; ++i) {
              // Current row value is less than or equal to the previous row value
              expect(rows[i].all(by.css('td')).get(columnNum).getText()).not.toBeGreaterThan(rows[i - 1].all(by.css('td')).get(columnNum).getText());
            };
          })
        });
      });
    });

    it('should update sorted order of table search and filter results', function() {
      // Search
      shared.searchField.sendKeys('a');

      // Add filter
      users.groupsTableDropDownLabel.click();
      users.dropdownGroups.get(1).click();
      users.groupsTableDropDownLabel.click().then(function() {
        elementCount = shared.tableElements.count();

        // Select column header
        columns.columnThreeHeader.click();

        // Sorted icon displayed
        expect(columns.columnTwoHeader.element(by.css(columns.sortIconArrowDown)).isDisplayed()).toBeFalsy();
        expect(columns.columnThreeHeader.element(by.css(columns.sortIconArrowDown)).isDisplayed()).toBeTruthy();
        expect(columns.displayedSortIcons.count()).toBe(1);

        // Verify sorted order
        shared.tableElements.then(function(rows) {
          expect(rows.length).toBe(elementCount);
          for (var i = 1; i < rows.length; ++i) {
            // Current row value is greater than or equal to the previous row value
            expect(rows[i].all(by.css('td')).get(2).getText()).not.toBeLessThan(rows[i - 1].all(by.css('td')).get(2).getText());
          };
        });
      });
    });
  });

  describe('for the Skills Management page', function() {
    beforeEach(function() {
      browser.get(shared.skillsPageUrl);
      elementCount = shared.tableElements.count();
    });

    it('should default by alphebetical last name', function() {
      // Sorted icon displayed
      expect(columns.columnTwoHeader.element(by.css(columns.sortIconArrowDown)).isDisplayed()).toBeTruthy();
      expect(columns.displayedSortIcons.count()).toBe(1);

      // Not displayed on remaining columns
      expect(columns.columnThreeHeader.element(by.css(columns.sortIconArrowDown)).isDisplayed()).toBeFalsy();
      expect(columns.columnFourHeader.element(by.css(columns.sortIconArrowDown)).isDisplayed()).toBeFalsy();
      expect(columns.columnFiveHeader.element(by.css(columns.sortIconArrowDown)).isDisplayed()).toBeFalsy();

      // Verify sorted order
      shared.tableElements.then(function(rows) {
        expect(rows.length).toBe(elementCount);
        for (var i = 1; i < rows.length; ++i) {
          // Current row value is greater than or equal to the previous row value
          expect(rows[i].all(by.css('td')).get(1).getText()).not.toBeLessThan(rows[i - 1].all(by.css('td')).get(1).getText());
        };
      });
    });

    it('should reverse sorted order when the same column header is selected', function() {
      // Select column header
      columns.columnTwoHeader.click();

      // Sorted icon displayed
      expect(columns.columnTwoHeader.element(by.css(columns.sortIconArrowDown)).isPresent()).toBeFalsy();
      expect(columns.columnTwoHeader.element(by.css(columns.sortIconArrowUp)).isDisplayed()).toBeTruthy();
      expect(columns.displayedSortIcons.count()).toBe(1);

      // Verify sorted order
      shared.tableElements.then(function(rows) {
        expect(rows.length).toBe(elementCount);
        for (var i = 1; i < rows.length; ++i) {
          // Current row value is less than or equal to the previous row value
          expect(rows[i].all(by.css('td')).get(1).getText()).not.toBeGreaterThan(rows[i - 1].all(by.css('td')).get(1).getText());
        };
      });
    });

    it('should update sorted order when different column headers are selected', function() {
      // Select column header
      columns.columnThreeHeader.click();

      // Sorted icon displayed
      expect(columns.columnTwoHeader.element(by.css(columns.sortIconArrowDown)).isDisplayed()).toBeFalsy();
      expect(columns.columnThreeHeader.element(by.css(columns.sortIconArrowDown)).isDisplayed()).toBeTruthy();
      expect(columns.displayedSortIcons.count()).toBe(1);

      // Verify sorted order
      shared.tableElements.then(function(rows) {
        expect(rows.length).toBe(elementCount);
        for (var i = 1; i < rows.length; ++i) {
          // Current row value is greater than or equal to the previous row value
          expect(rows[i].all(by.css('td')).get(2).getText()).not.toBeLessThan(rows[i - 1].all(by.css('td')).get(2).getText());
        };
      });
    });

    it('should sort by each default column', function() {
      // Select column header
      columns.sortableHeaders.each(function(columnHeader, columnNum) {
        // Select column
        columnHeader.click();

        // Sorted icon displayed
        expect(columnHeader.element(by.css(columns.sortIconArrowDown)).isDisplayed()).toBeTruthy();
        expect(columns.displayedSortIcons.count()).toBe(1);

        // Verify sorted order
        shared.tableElements.then(function(rows) {
          expect(rows.length).toBe(elementCount);
          for (var i = 1; i < rows.length; ++i) {
            // Current row value is greater than or equal to the previous row value
            expect(rows[i].all(by.css('td')).get(columnNum).getText()).not.toBeLessThan(rows[i - 1].all(by.css('td')).get(columnNum).getText());
          };
        }).then(function() {
          // Reverse sorted order
          columnHeader.click();

          // Sorted icon displayed
          expect(columnHeader.element(by.css(columns.sortIconArrowUp)).isDisplayed()).toBeTruthy();
          expect(columns.displayedSortIcons.count()).toBe(1);

          // Verify sorted order
          shared.tableElements.then(function(rows) {
            expect(rows.length).toBe(elementCount);
            for (var i = 1; i < rows.length; ++i) {
              // Current row value is less than or equal to the previous row value
              expect(rows[i].all(by.css('td')).get(columnNum).getText()).not.toBeGreaterThan(rows[i - 1].all(by.css('td')).get(columnNum).getText());
            };
          })
        });
      });
    });

    it('should update sorted order of table search and filter results', function() {
      // Search
      shared.searchField.sendKeys('a');

      // Add filter
      columns.statusTableDropDownLabel.click();
      columns.dropdownStatuses.get(1).click();
      columns.statusTableDropDownLabel.click().then(function() {
        elementCount = shared.tableElements.count();

        // Select column header
        columns.columnThreeHeader.click();

        // Sorted icon displayed
        expect(columns.columnTwoHeader.element(by.css(columns.sortIconArrowDown)).isDisplayed()).toBeFalsy();
        expect(columns.columnThreeHeader.element(by.css(columns.sortIconArrowDown)).isDisplayed()).toBeTruthy();
        expect(columns.displayedSortIcons.count()).toBe(1);

        // Verify sorted order
        shared.tableElements.then(function(rows) {
          expect(rows.length).toBe(elementCount);
          for (var i = 1; i < rows.length; ++i) {
            // Current row value is greater than or equal to the previous row value
            expect(rows[i].all(by.css('td')).get(2).getText()).not.toBeLessThan(rows[i - 1].all(by.css('td')).get(2).getText());
          };
        });
      });
    });
  });


});
