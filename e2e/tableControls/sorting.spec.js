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
        for (var i = 0; i < rows.length && i < 10; ++i) { // Limit test length
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

    xit('should sort by each default column', function() {
      // Select column header
      columns.sortableHeaders.each(function(columnHeader, columnNum) {
        if (columnNum !== 0) { // Skip User Name column
          // Select column
          columnHeader.click();
          // Sorted icon displayed
          expect(columnHeader.element(by.css(columns.sortIconArrowDown)).isDisplayed()).toBeTruthy();
          expect(columns.displayedSortIcons.count()).toBe(1);

          // Verify sorted order
          shared.tableElements.then(function(rows) {
            for (var i = 1; i < rows.length; ++i) {
              // Current row value is less than or equal to the previous row value
              rows[i].all(by.css('td')).get(columnNum + 1).getText().then(function (rowValue){
                if (rowValue !== ''){
                  rows[i - 1].all(by.css('td')).get(columnNum + 1).getText().then(function(previousValue){
                    if (previousValue != ''){
                      expect(rowValue).not.toBeGreaterThan();
                    }
                  });
                }
              });
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
                // Current row value is greater than or equal to the previous row value
                rows[i].all(by.css('td')).get(columnNum + 1).getText().then(function(rowValue){
                  if (rowValue !== ''){
                    expect(rowValue).not.toBeLessThan(rows[i - 1].all(by.css('td')).get(columnNum + 1).getText());
                  }
                });
              };
            })
          });
        }
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

    it('should default by alphebetical name', function() {
      // Sorted icon displayed
      expect(columns.columnTwoHeader.element(by.css(columns.sortIconArrowDown)).isDisplayed()).toBeTruthy();
      expect(columns.displayedSortIcons.count()).toBe(1);

      // Not displayed on remaining columns
      expect(columns.columnThreeHeader.element(by.css(columns.sortIconArrowDown)).isDisplayed()).toBeFalsy();
      expect(columns.columnFourHeader.element(by.css(columns.sortIconArrowDown)).isDisplayed()).toBeFalsy();
      expect(columns.columnFiveHeader.element(by.css(columns.sortIconArrowDown)).isDisplayed()).toBeFalsy();

      // Verify sorted order
      shared.tableElements.map(function (row) {
        return row.element(by.css('td:nth-child(2)')).getText().then(function (text) {
            return text.toLowerCase();
        });
      }).then(function (strings) {
        // get a copy of the array
        var sortedStrings = strings.slice();

        //Sorts it based on character code by default
        sortedStrings = sortedStrings.sort();

        expect(strings).toEqual(sortedStrings);
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
      shared.tableElements.map(function (row) {
        return row.element(by.css('td:nth-child(2)')).getText().then(function (text) {
            return text.toLowerCase();
        });
      }).then(function (strings) {
        // get a copy of the array
        var sortedStrings = strings.slice();

        //Sorts it based on character code by default
        sortedStrings = sortedStrings.sort().reverse();

        expect(strings).toEqual(sortedStrings);
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

    xit('should sort by each default column', function() {
      columns.columnTwoHeader.click(); // Change sorting order

      columns.allHeaders.each(function(columnHeader, index) {
        columnHeader.getAttribute('class').then(function (classes) {
          if (classes.indexOf('sortable-header') !== -1){ //Only check sorting results on sortable columns
            shared.tableElements.map(function (row, rowIndex) {
              var cell = shared.table.element(by.css('tr:nth-child(' + (rowIndex + 1) + ') td:nth-child(' + (index + 1) + ')'));
              return cell.getText().then(function (text) {
                  return text.toLowerCase();
              });
            }).then(function (strings) {
              // get a copy of the array
              var sortedStrings = strings.slice();

              //Sorts it based on character code by default
              sortedStrings = sortedStrings.sort();

              //Verify that column is properly sorted
              expect(strings).toEqual(sortedStrings);

              // Verify that sorted icon displayed
              expect(columns.tableHeader.element(by.css('th:nth-child(' + (index + 1) + ')')).element(by.css(columns.sortIconArrowDown)).isDisplayed()).toBeTruthy();
              expect(columns.displayedSortIcons.count()).toBe(1);
            }).then(function (strings) {
              //Reverse the sort order
              columns.tableHeader.element(by.css('th:nth-child(' + (index + 1) + ')')).click();

              shared.tableElements.map(function (row, rowIndex) {
                var cell = shared.table.element(by.css('tr:nth-child(' + (rowIndex + 1) + ') td:nth-child(' + (index + 1) + ')'));
                return cell.getText().then(function (text) {
                    return text.toLowerCase();
                });
              }).then(function (strings) {
                // get a copy of the array
                var sortedStrings = strings.slice();

                //Reverse sort the target array
                sortedStrings = sortedStrings.sort().reverse();

                //Verify that column is properly sorted
                expect(strings).toEqual(sortedStrings);

                // Verify that sorted icon displayed
                expect(columns.tableHeader.element(by.css('th:nth-child(' + (index + 1) + ')')).element(by.css(columns.sortIconArrowUp)).isDisplayed()).toBeTruthy();
                expect(columns.displayedSortIcons.count()).toBe(1);
              })
            });
          }
        }).thenFinally(function(){
          //Click to sort the next column, if it exists
          columns.allHeaders.count().then(function(count){
            if (index + 2 <= count){
              columns.tableHeader.element(by.css('th:nth-child(' + (index + 2) + ')')).click();
            }
          });
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

  describe('for the Groups Management page', function() {
    beforeEach(function() {
      browser.get(shared.groupsPageUrl);
      elementCount = shared.tableElements.count();
    });

    it('should default to sort by alphebetical name', function() {
      // Sorted icon displayed
      expect(columns.columnTwoHeader.element(by.css(columns.sortIconArrowDown)).isDisplayed()).toBeTruthy();
      expect(columns.displayedSortIcons.count()).toBe(1);

      // Not displayed on remaining columns
      expect(columns.columnThreeHeader.element(by.css(columns.sortIconArrowDown)).isDisplayed()).toBeFalsy();
      expect(columns.columnFourHeader.element(by.css(columns.sortIconArrowDown)).isDisplayed()).toBeFalsy();
      expect(columns.columnFiveHeader.element(by.css(columns.sortIconArrowDown)).isDisplayed()).toBeFalsy();

      // Verify sorted order
      shared.tableElements.map(function (row) {
        return row.element(by.css('td:nth-child(2)')).getText().then(function (text) {
            return text.toLowerCase();
        });
      }).then(function (strings) {
        // get a copy of the array
        var sortedStrings = strings.slice();

        //Sorts it based on character code by default
        sortedStrings = sortedStrings.sort();

        expect(strings).toEqual(sortedStrings);
      });
    });

    xit('should sort by each default column', function() {
      columns.columnTwoHeader.click(); //Reset the name column

      columns.allHeaders.each(function(columnHeader, index) {
        columnHeader.getAttribute('class').then(function (classes) {
          if (classes.indexOf('sortable-header') !== -1){ //Only check sorting results on sortable columns
            shared.tableElements.map(function (row, rowIndex) {
              var cell = shared.table.element(by.css('tr:nth-child(' + (rowIndex + 1) + ') td:nth-child(' + (index + 1) + ')'));
              return cell.getText().then(function (text) {
                  return text.toLowerCase();
              });
            }).then(function (strings) {
              // get a copy of the array
              var sortedStrings = strings.slice();

              //Sorts it based on character code by default
              sortedStrings = sortedStrings.sort();

              //Verify that column is properly sorted
              expect(strings).toEqual(sortedStrings);

              // Verify that sorted icon displayed
              expect(columns.tableHeader.element(by.css('th:nth-child(' + (index + 1) + ')')).element(by.css(columns.sortIconArrowDown)).isDisplayed()).toBeTruthy();
              expect(columns.displayedSortIcons.count()).toBe(1);
            }).then(function (strings) {
              //Reverse the sort order
              columns.tableHeader.element(by.css('th:nth-child(' + (index + 1) + ')')).click();

              shared.tableElements.map(function (row, rowIndex) {
                var cell = shared.table.element(by.css('tr:nth-child(' + (rowIndex + 1) + ') td:nth-child(' + (index + 1) + ')'));
                return cell.getText().then(function (text) {
                    return text.toLowerCase();
                });
              }).then(function (strings) {
                // get a copy of the array
                var sortedStrings = strings.slice();

                //Reverse sort the target array
                sortedStrings = sortedStrings.sort().reverse();

                //Verify that column is properly sorted
                expect(strings).toEqual(sortedStrings);

                // Verify that sorted icon displayed
                expect(columns.tableHeader.element(by.css('th:nth-child(' + (index + 1) + ')')).element(by.css(columns.sortIconArrowUp)).isDisplayed()).toBeTruthy();
                expect(columns.displayedSortIcons.count()).toBe(1);
              })
            });
          }
        }).thenFinally(function(){
          //Click to sort the next column, if it exists
          columns.allHeaders.count().then(function(count){
            if (index + 2 <= count){
              columns.tableHeader.element(by.css('th:nth-child(' + (index + 2) + ')')).click();
            }
          });
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

  describe('for the Roles Management page', function() {
    beforeEach(function() {
      browser.get(shared.rolesPageUrl);
      elementCount = shared.tableElements.count();
    });

    it('should default by alphebetical name', function() {
      // Sorted icon displayed
      expect(columns.columnTwoHeader.element(by.css(columns.sortIconArrowDown)).isDisplayed()).toBeTruthy();
      expect(columns.displayedSortIcons.count()).toBe(1);

      // Not displayed on remaining columns
      expect(columns.columnThreeHeader.element(by.css(columns.sortIconArrowDown)).isDisplayed()).toBeFalsy();
      expect(columns.columnFourHeader.element(by.css(columns.sortIconArrowDown)).isDisplayed()).toBeFalsy();

      // Verify sorted order
      shared.tableElements.map(function (row) {
        return row.element(by.css('td:nth-child(2)')).getText().then(function (text) {
            return text.toLowerCase();
        });
      }).then(function (strings) {
        // get a copy of the array
        var sortedStrings = strings.slice();

        //Sorts it based on character code by default
        sortedStrings = sortedStrings.sort();

        expect(strings).toEqual(sortedStrings);
      });
    });

    xit('should sort by each default column', function() {
      columns.columnTwoHeader.click(); // Change sorting order

      columns.allHeaders.each(function(columnHeader, index) {
        columnHeader.getAttribute('class').then(function (classes) {
          if (classes.indexOf('sortable-header') !== -1){ //Only check sorting results on sortable columns
            shared.tableElements.map(function (row, rowIndex) {
              var cell = shared.table.element(by.css('tr:nth-child(' + (rowIndex + 1) + ') td:nth-child(' + (index + 1) + ')'));
              return cell.getText().then(function (text) {
                if (index === 3){ //Permissions column is sorted numerically
                  return parseInt(text);
                } else {
                  return text.toLowerCase();
                }
              });
            }).then(function (values) {
              // get a copy of the array
              var sortedValues = values.slice();

              //Sorts it based on character code by default
              if (index === 3){
                sortedValues = sortedValues.sort(function(a,b) { return a - b; });
              } else {
                sortedValues = sortedValues.sort();
              }

              //Verify that column is properly sorted
              expect(values).toEqual(sortedValues);

              // Verify that sorted icon displayed
              expect(columns.tableHeader.element(by.css('th:nth-child(' + (index + 1) + ')')).element(by.css(columns.sortIconArrowDown)).isDisplayed()).toBeTruthy();
              expect(columns.displayedSortIcons.count()).toBe(1);
            }).then(function (strings) {
              //Reverse the sort order
              columns.tableHeader.element(by.css('th:nth-child(' + (index + 1) + ')')).click();

              shared.tableElements.map(function (row, rowIndex) {
                var cell = shared.table.element(by.css('tr:nth-child(' + (rowIndex + 1) + ') td:nth-child(' + (index + 1) + ')'));
                return cell.getText().then(function (text) {
                  if (index === 3){ //Permissions column is sorted numerically
                    return parseInt(text);
                  } else {
                    return text.toLowerCase();
                  }
                });
              }).then(function (values) {
                // get a copy of the array
                var sortedValues = values.slice();

                //Reverse sort the target array
                if (index === 3){
                  sortedValues = sortedValues.sort(function(a,b) { return a - b; }).reverse();
                } else {
                  sortedValues = sortedValues.sort().reverse();
                }

                //Verify that column is properly sorted
                expect(values).toEqual(sortedValues);

                // Verify that sorted icon displayed
                expect(columns.tableHeader.element(by.css('th:nth-child(' + (index + 1) + ')')).element(by.css(columns.sortIconArrowUp)).isDisplayed()).toBeTruthy();
                expect(columns.displayedSortIcons.count()).toBe(1);
              })
            });
          }
        }).thenFinally(function(){
          //Click to sort the next column, if it exists
          columns.allHeaders.count().then(function(count){
            if (index + 2 <= count){
              columns.tableHeader.element(by.css('th:nth-child(' + (index + 2) + ')')).click();
            }
          });
        });
      });
    });

    it('should update sorted order of table search results', function() {
      // Search
      shared.searchField.sendKeys('a').then(function() {
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

  describe('for the Tenants Management page', function() {
    beforeEach(function() {
      browser.get(shared.tenantsPageUrl);
      elementCount = shared.tableElements.count();
    });

    xit('should default by alphebetical name', function() {
      // Sorted icon displayed
      expect(columns.columnTwoHeader.element(by.css(columns.sortIconArrowDown)).isDisplayed()).toBeTruthy();
      expect(columns.displayedSortIcons.count()).toBe(1);

      // Not displayed on remaining columns
      expect(columns.columnThreeHeader.element(by.css(columns.sortIconArrowDown)).isDisplayed()).toBeFalsy();
      expect(columns.columnFourHeader.element(by.css(columns.sortIconArrowDown)).isDisplayed()).toBeFalsy();

      // Verify sorted order
      shared.tableElements.then(function(rows) {
        expect(rows.length).toBe(elementCount);
        for (var i = 1; i < rows.length; ++i) {
          // Current row value is greater than or equal to the previous row value
          expect(rows[i].all(by.css('td')).get(1).getText()).not.toBeLessThan(rows[i - 1].all(by.css('td')).get(1).getText());
        };
      });
    });

    xit('should sort by each default column', function() {
      columns.columnTwoHeader.click(); // Change sorting order

      columns.allHeaders.each(function(columnHeader, index) {
        columnHeader.getAttribute('class').then(function (classes) {
          if (classes.indexOf('sortable-header') !== -1){ //Only check sorting results on sortable columns
            shared.tableElements.map(function (row, rowIndex) {
              var cell = shared.table.element(by.css('tr:nth-child(' + (rowIndex + 1) + ') td:nth-child(' + (index + 1) + ')'));
              return cell.getText().then(function (text) {
                  return text.toLowerCase();
              });
            }).then(function (strings) {
              // get a copy of the array
              var sortedStrings = strings.slice();

              //Sorts it based on character code by default
              sortedStrings = sortedStrings.sort();

              //Verify that column is properly sorted
              expect(strings).toEqual(sortedStrings);

              // Verify that sorted icon displayed
              expect(columns.tableHeader.element(by.css('th:nth-child(' + (index + 1) + ')')).element(by.css(columns.sortIconArrowDown)).isDisplayed()).toBeTruthy();
              expect(columns.displayedSortIcons.count()).toBe(1);
            }).then(function (strings) {
              //Reverse the sort order
              columns.tableHeader.element(by.css('th:nth-child(' + (index + 1) + ')')).click();

              shared.tableElements.map(function (row, rowIndex) {
                var cell = shared.table.element(by.css('tr:nth-child(' + (rowIndex + 1) + ') td:nth-child(' + (index + 1) + ')'));
                return cell.getText().then(function (text) {
                    return text.toLowerCase();
                });
              }).then(function (strings) {
                // get a copy of the array
                var sortedStrings = strings.slice();

                //Reverse sort the target array
                sortedStrings = sortedStrings.sort().reverse();

                //Verify that column is properly sorted
                expect(strings).toEqual(sortedStrings);

                // Verify that sorted icon displayed
                expect(columns.tableHeader.element(by.css('th:nth-child(' + (index + 1) + ')')).element(by.css(columns.sortIconArrowUp)).isDisplayed()).toBeTruthy();
                expect(columns.displayedSortIcons.count()).toBe(1);
              })
            });
          }
        }).thenFinally(function(){
          //Click to sort the next column, if it exists
          columns.allHeaders.count().then(function(count){
            if (index + 2 <= count){
              columns.tableHeader.element(by.css('th:nth-child(' + (index + 2) + ')')).click();
            }
          });
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

  describe('for the Integrations Management page', function() {
    beforeEach(function() {
      browser.get(shared.integrationsPageUrl);
      elementCount = shared.tableElements.count();
    });

    it('should default by type', function() {
      // Sorted icon displayed
      expect(columns.columnTwoHeader.element(by.css(columns.sortIconArrowDown)).isDisplayed()).toBeTruthy();
      expect(columns.displayedSortIcons.count()).toBe(1);

      // Not displayed on remaining columns
      expect(columns.columnThreeHeader.element(by.css(columns.sortIconArrowDown)).isDisplayed()).toBeFalsy();

      // Verify sorted order
      shared.tableElements.map(function (row) {
        return row.element(by.css('td:nth-child(2)')).getText().then(function (text) {
            return text.toLowerCase();
        });
      }).then(function (strings) {
        // get a copy of the array
        var sortedStrings = strings.slice();

        //Sorts it based on character code by default
        sortedStrings = sortedStrings.sort();

        expect(strings).toEqual(sortedStrings);
      });
    });

    xit('should sort by each default column', function() {
      columns.columnTwoHeader.click(); // Change sorting order

      columns.allHeaders.each(function(columnHeader, index) {
        columnHeader.getAttribute('class').then(function (classes) {
          if (classes.indexOf('sortable-header') !== -1){ //Only check sorting results on sortable columns
            shared.tableElements.map(function (row, rowIndex) {
              var cell = shared.table.element(by.css('tr:nth-child(' + (rowIndex + 1) + ') td:nth-child(' + (index + 1) + ')'));
              return cell.getText().then(function (text) {
                  return text.toLowerCase();
              });
            }).then(function (strings) {
              // get a copy of the array
              var sortedStrings = strings.slice();

              //Sorts it based on character code by default
              sortedStrings = sortedStrings.sort();

              //Verify that column is properly sorted
              expect(strings).toEqual(sortedStrings);

              // Verify that sorted icon displayed
              expect(columns.tableHeader.element(by.css('th:nth-child(' + (index + 1) + ')')).element(by.css(columns.sortIconArrowDown)).isDisplayed()).toBeTruthy();
              expect(columns.displayedSortIcons.count()).toBe(1);
            }).then(function (strings) {
              //Reverse the sort order
              columns.tableHeader.element(by.css('th:nth-child(' + (index + 1) + ')')).click();

              shared.tableElements.map(function (row, rowIndex) {
                var cell = shared.table.element(by.css('tr:nth-child(' + (rowIndex + 1) + ') td:nth-child(' + (index + 1) + ')'));
                return cell.getText().then(function (text) {
                    return text.toLowerCase();
                });
              }).then(function (strings) {
                // get a copy of the array
                var sortedStrings = strings.slice();

                //Reverse sort the target array
                sortedStrings = sortedStrings.sort().reverse();

                //Verify that column is properly sorted
                expect(strings).toEqual(sortedStrings);

                // Verify that sorted icon displayed
                expect(columns.tableHeader.element(by.css('th:nth-child(' + (index + 1) + ')')).element(by.css(columns.sortIconArrowUp)).isDisplayed()).toBeTruthy();
                expect(columns.displayedSortIcons.count()).toBe(1);
              })
            });
          }
        }).thenFinally(function(){
          //Click to sort the next column, if it exists
          columns.allHeaders.count().then(function(count){
            if (index + 2 <= count){
              columns.tableHeader.element(by.css('th:nth-child(' + (index + 2) + ')')).click();
            }
          });
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

  describe('for the Flows Management page', function() {
    beforeEach(function() {
      browser.get(shared.flowsPageUrl);
      elementCount = shared.tableElements.count();
    });

    it('should default by alphebetical name', function() {
      // Sorted icon displayed
      expect(columns.columnTwoHeader.element(by.css(columns.sortIconArrowDown)).isDisplayed()).toBeTruthy();
      expect(columns.displayedSortIcons.count()).toBe(1);

      // Not displayed on remaining columns
      expect(columns.columnThreeHeader.element(by.css(columns.sortIconArrowDown)).isDisplayed()).toBeFalsy();
      expect(columns.columnFourHeader.element(by.css(columns.sortIconArrowDown)).isDisplayed()).toBeFalsy();
      expect(columns.columnFiveHeader.element(by.css(columns.sortIconArrowDown)).isDisplayed()).toBeFalsy();

      // Verify sorted order
      shared.tableElements.map(function (row) {
        return row.element(by.css('td:nth-child(2)')).getText().then(function (text) {
            return text.toLowerCase();
        });
      }).then(function (strings) {
        // get a copy of the array
        var sortedStrings = strings.slice();

        //Sorts it based on character code by default
        sortedStrings = sortedStrings.sort();

        expect(strings).toEqual(sortedStrings);
      });
    });

    xit('should sort by each default column', function() {
      columns.columnTwoHeader.click(); // Change sorting order

      columns.allHeaders.each(function(columnHeader, index) {
        columnHeader.getAttribute('class').then(function (classes) {
          if (classes.indexOf('sortable-header') !== -1){ //Only check sorting results on sortable columns
            shared.tableElements.map(function (row, rowIndex) {
              var cell = shared.table.element(by.css('tr:nth-child(' + (rowIndex + 1) + ') td:nth-child(' + (index + 1) + ')'));
              return cell.getText().then(function (text) {
                  return text.toLowerCase();
              });
            }).then(function (strings) {
              // get a copy of the array
              var sortedStrings = strings.slice();

              //Sorts it based on character code by default
              sortedStrings = sortedStrings.sort();

              //Verify that column is properly sorted
              expect(strings).toEqual(sortedStrings);

              // Verify that sorted icon displayed
              expect(columns.tableHeader.element(by.css('th:nth-child(' + (index + 1) + ')')).element(by.css(columns.sortIconArrowDown)).isDisplayed()).toBeTruthy();
              expect(columns.displayedSortIcons.count()).toBe(1);
            }).then(function (strings) {
              //Reverse the sort order
              columns.tableHeader.element(by.css('th:nth-child(' + (index + 1) + ')')).click();

              shared.tableElements.map(function (row, rowIndex) {
                var cell = shared.table.element(by.css('tr:nth-child(' + (rowIndex + 1) + ') td:nth-child(' + (index + 1) + ')'));
                return cell.getText().then(function (text) {
                    return text.toLowerCase();
                });
              }).then(function (strings) {
                // get a copy of the array
                var sortedStrings = strings.slice();

                //Reverse sort the target array
                sortedStrings = sortedStrings.sort().reverse();

                //Verify that column is properly sorted
                expect(strings).toEqual(sortedStrings);

                // Verify that sorted icon displayed
                expect(columns.tableHeader.element(by.css('th:nth-child(' + (index + 1) + ')')).element(by.css(columns.sortIconArrowUp)).isDisplayed()).toBeTruthy();
                expect(columns.displayedSortIcons.count()).toBe(1);
              })
            });
          }
        }).thenFinally(function(){
          //Click to sort the next column, if it exists
          columns.allHeaders.count().then(function(count){
            if (index + 2 <= count){
              columns.tableHeader.element(by.css('th:nth-child(' + (index + 2) + ')')).click();
            }
          });
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

  describe('for the Queues Management page', function() {
    beforeEach(function() {
      browser.get(shared.queuesPageUrl);
      elementCount = shared.tableElements.count();
    });

    it('should default by alphebetical name', function() {
      // Sorted icon displayed
      expect(columns.columnTwoHeader.element(by.css(columns.sortIconArrowDown)).isDisplayed()).toBeTruthy();
      expect(columns.displayedSortIcons.count()).toBe(1);

      // Not displayed on remaining columns
      expect(columns.columnThreeHeader.element(by.css(columns.sortIconArrowDown)).isDisplayed()).toBeFalsy();
      expect(columns.columnFourHeader.element(by.css(columns.sortIconArrowDown)).isDisplayed()).toBeFalsy();
      expect(columns.columnFiveHeader.element(by.css(columns.sortIconArrowDown)).isDisplayed()).toBeFalsy();

      // Verify sorted order
      shared.tableElements.map(function (row) {
        return row.element(by.css('td:nth-child(2)')).getText().then(function (text) {
            return text.toLowerCase();
        });
      }).then(function (strings) {
        // get a copy of the array
        var sortedStrings = strings.slice();

        //Sorts it based on character code by default
        sortedStrings = sortedStrings.sort();

        expect(strings).toEqual(sortedStrings);
      });
    });

    xit('should sort by each default column', function() {
      columns.columnTwoHeader.click(); // Change sorting order

      columns.allHeaders.each(function(columnHeader, index) {
        columnHeader.getAttribute('class').then(function (classes) {
          if (classes.indexOf('sortable-header') !== -1){ //Only check sorting results on sortable columns
            shared.tableElements.map(function (row, rowIndex) {
              var cell = shared.table.element(by.css('tr:nth-child(' + (rowIndex + 1) + ') td:nth-child(' + (index + 1) + ')'));
              return cell.getText().then(function (text) {
                  return text.toLowerCase();
              });
            }).then(function (strings) {
              // get a copy of the array
              var sortedStrings = strings.slice();

              //Sorts it based on character code by default
              sortedStrings = sortedStrings.sort();

              //Verify that column is properly sorted
              expect(strings).toEqual(sortedStrings);

              // Verify that sorted icon displayed
              expect(columns.tableHeader.element(by.css('th:nth-child(' + (index + 1) + ')')).element(by.css(columns.sortIconArrowDown)).isDisplayed()).toBeTruthy();
              expect(columns.displayedSortIcons.count()).toBe(1);
            }).then(function (strings) {
              //Reverse the sort order
              columns.tableHeader.element(by.css('th:nth-child(' + (index + 1) + ')')).click();

              shared.tableElements.map(function (row, rowIndex) {
                var cell = shared.table.element(by.css('tr:nth-child(' + (rowIndex + 1) + ') td:nth-child(' + (index + 1) + ')'));
                return cell.getText().then(function (text) {
                    return text.toLowerCase();
                });
              }).then(function (strings) {
                // get a copy of the array
                var sortedStrings = strings.slice();

                //Reverse sort the target array
                sortedStrings = sortedStrings.sort().reverse();

                //Verify that column is properly sorted
                expect(strings).toEqual(sortedStrings);

                // Verify that sorted icon displayed
                expect(columns.tableHeader.element(by.css('th:nth-child(' + (index + 1) + ')')).element(by.css(columns.sortIconArrowUp)).isDisplayed()).toBeTruthy();
                expect(columns.displayedSortIcons.count()).toBe(1);
              })
            });
          }
        }).thenFinally(function(){
          //Click to sort the next column, if it exists
          columns.allHeaders.count().then(function(count){
            if (index + 2 <= count){
              columns.tableHeader.element(by.css('th:nth-child(' + (index + 2) + ')')).click();
            }
          });
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

  describe('for the Media Collections Management page', function() {
    beforeEach(function() {
      browser.get(shared.mediaCollectionsPageUrl);
      elementCount = shared.tableElements.count();
    });

    it('should default by alphebetical name', function() {
      // Sorted icon displayed
      expect(columns.columnTwoHeader.element(by.css(columns.sortIconArrowDown)).isDisplayed()).toBeTruthy();
      expect(columns.displayedSortIcons.count()).toBe(1);

      // Not displayed on remaining columns
      expect(columns.columnThreeHeader.element(by.css(columns.sortIconArrowDown)).isDisplayed()).toBeFalsy();
      expect(columns.columnFourHeader.element(by.css(columns.sortIconArrowDown)).isDisplayed()).toBeFalsy();

      // Verify sorted order
      shared.tableElements.map(function (row) {
        return row.element(by.css('td:nth-child(2)')).getText().then(function (text) {
            return text.toLowerCase();
        });
      }).then(function (strings) {
        // get a copy of the array
        var sortedStrings = strings.slice();

        //Sorts it based on character code by default
        sortedStrings = sortedStrings.sort();

        expect(strings).toEqual(sortedStrings);
      });
    });

    xit('should sort by each default column', function() {
      columns.columnTwoHeader.click(); // Change sorting order

      columns.allHeaders.each(function(columnHeader, index) {
        columnHeader.getAttribute('class').then(function (classes) {
          if (classes.indexOf('sortable-header') !== -1){ //Only check sorting results on sortable columns
            shared.tableElements.map(function (row, rowIndex) {
              var cell = shared.table.element(by.css('tr:nth-child(' + (rowIndex + 1) + ') td:nth-child(' + (index + 1) + ')'));
              return cell.getText().then(function (text) {
                  return text.toLowerCase();
              });
            }).then(function (strings) {
              // get a copy of the array
              var sortedStrings = strings.slice();

              //Sorts it based on character code by default
              sortedStrings = sortedStrings.sort();

              //Verify that column is properly sorted
              expect(strings).toEqual(sortedStrings);

              // Verify that sorted icon displayed
              expect(columns.tableHeader.element(by.css('th:nth-child(' + (index + 1) + ')')).element(by.css(columns.sortIconArrowDown)).isDisplayed()).toBeTruthy();
              expect(columns.displayedSortIcons.count()).toBe(1);
            }).then(function (strings) {
              //Reverse the sort order
              columns.tableHeader.element(by.css('th:nth-child(' + (index + 1) + ')')).click();

              shared.tableElements.map(function (row, rowIndex) {
                var cell = shared.table.element(by.css('tr:nth-child(' + (rowIndex + 1) + ') td:nth-child(' + (index + 1) + ')'));
                return cell.getText().then(function (text) {
                    return text.toLowerCase();
                });
              }).then(function (strings) {
                // get a copy of the array
                var sortedStrings = strings.slice();

                //Reverse sort the target array
                sortedStrings = sortedStrings.sort().reverse();

                //Verify that column is properly sorted
                expect(strings).toEqual(sortedStrings);

                // Verify that sorted icon displayed
                expect(columns.tableHeader.element(by.css('th:nth-child(' + (index + 1) + ')')).element(by.css(columns.sortIconArrowUp)).isDisplayed()).toBeTruthy();
                expect(columns.displayedSortIcons.count()).toBe(1);
              })
            });
          }
        }).thenFinally(function(){
          //Click to sort the next column, if it exists
          columns.allHeaders.count().then(function(count){
            if (index + 2 <= count){
              columns.tableHeader.element(by.css('th:nth-child(' + (index + 2) + ')')).click();
            }
          });
        });
      });
    });

    it('should update sorted order of table search results', function() {
      // Search
      shared.searchField.sendKeys('a').then(function() {
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

  describe('for the Media Management page', function() {
    beforeEach(function() {
      browser.get(shared.mediaPageUrl);
      elementCount = shared.tableElements.count();
    });

    it('should default by alphebetical name', function() {
      // Sorted icon displayed
      expect(columns.columnTwoHeader.element(by.css(columns.sortIconArrowDown)).isDisplayed()).toBeTruthy();
      expect(columns.displayedSortIcons.count()).toBe(1);

      // Not displayed on remaining columns
      expect(columns.columnThreeHeader.element(by.css(columns.sortIconArrowDown)).isDisplayed()).toBeFalsy();
      expect(columns.columnFourHeader.element(by.css(columns.sortIconArrowDown)).isDisplayed()).toBeFalsy();
      expect(columns.columnFiveHeader.element(by.css(columns.sortIconArrowDown)).isDisplayed()).toBeFalsy();

      // Verify sorted order
      shared.tableElements.map(function (row) {
        return row.element(by.css('td:nth-child(2)')).getText().then(function (text) {
            return text.toLowerCase();
        });
      }).then(function (strings) {
        // get a copy of the array
        var sortedStrings = strings.slice();

        //Sorts it based on character code by default
        sortedStrings = sortedStrings.sort();

        expect(strings).toEqual(sortedStrings);
      });
    });

    xit('should sort by each default column', function() {
      columns.columnTwoHeader.click(); // Change sorting order

      columns.allHeaders.each(function(columnHeader, index) {
        columnHeader.getAttribute('class').then(function (classes) {
          if (classes.indexOf('sortable-header') !== -1){ //Only check sorting results on sortable columns
            shared.tableElements.map(function (row, rowIndex) {
              var cell = shared.table.element(by.css('tr:nth-child(' + (rowIndex + 1) + ') td:nth-child(' + (index + 1) + ')'));
              return cell.getText().then(function (text) {
                  return text.toLowerCase();
              });
            }).then(function (strings) {
              // get a copy of the array
              var sortedStrings = strings.slice();

              //Sorts it based on character code by default
              sortedStrings = sortedStrings.sort();

              //Verify that column is properly sorted
              expect(strings).toEqual(sortedStrings);

              // Verify that sorted icon displayed
              expect(columns.tableHeader.element(by.css('th:nth-child(' + (index + 1) + ')')).element(by.css(columns.sortIconArrowDown)).isDisplayed()).toBeTruthy();
              expect(columns.displayedSortIcons.count()).toBe(1);
            }).then(function (strings) {
              //Reverse the sort order
              columns.tableHeader.element(by.css('th:nth-child(' + (index + 1) + ')')).click();

              shared.tableElements.map(function (row, rowIndex) {
                var cell = shared.table.element(by.css('tr:nth-child(' + (rowIndex + 1) + ') td:nth-child(' + (index + 1) + ')'));
                return cell.getText().then(function (text) {
                    return text.toLowerCase();
                });
              }).then(function (strings) {
                // get a copy of the array
                var sortedStrings = strings.slice();

                //Reverse sort the target array
                sortedStrings = sortedStrings.sort().reverse();

                //Verify that column is properly sorted
                expect(strings).toEqual(sortedStrings);

                // Verify that sorted icon displayed
                expect(columns.tableHeader.element(by.css('th:nth-child(' + (index + 1) + ')')).element(by.css(columns.sortIconArrowUp)).isDisplayed()).toBeTruthy();
                expect(columns.displayedSortIcons.count()).toBe(1);
              })
            });
          }
        }).thenFinally(function(){
          //Click to sort the next column, if it exists
          columns.allHeaders.count().then(function(count){
            if (index + 2 <= count){
              columns.tableHeader.element(by.css('th:nth-child(' + (index + 2) + ')')).click();
            }
          });
        });
      });
    });

    xit('should update sorted order of table search results', function() {
      // Search
      shared.searchField.sendKeys('a').then(function() {
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

  describe('for the Dispatch Mappings Management page', function() {
    beforeEach(function() {
      browser.get(shared.dispatchMappingsPageUrl);
      elementCount = shared.tableElements.count();
    });

    it('should default by alphebetical name', function() {
      // Sorted icon displayed
      expect(columns.columnTwoHeader.element(by.css(columns.sortIconArrowDown)).isDisplayed()).toBeTruthy();
      expect(columns.displayedSortIcons.count()).toBe(1);

      // Not displayed on remaining columns
      expect(columns.columnThreeHeader.element(by.css(columns.sortIconArrowDown)).isDisplayed()).toBeFalsy();
      expect(columns.columnFourHeader.element(by.css(columns.sortIconArrowDown)).isDisplayed()).toBeFalsy();
      expect(columns.columnFiveHeader.element(by.css(columns.sortIconArrowDown)).isDisplayed()).toBeFalsy();
      expect(columns.columnSixHeader.element(by.css(columns.sortIconArrowDown)).isDisplayed()).toBeFalsy();
      expect(columns.columnSevenHeader.element(by.css(columns.sortIconArrowDown)).isDisplayed()).toBeFalsy();

      // Verify sorted order
      shared.tableElements.map(function (row) {
        return row.element(by.css('td:nth-child(2)')).getText().then(function (text) {
            return text.toLowerCase();
        });
      }).then(function (strings) {
        // get a copy of the array
        var sortedStrings = strings.slice();

        //Sorts it based on character code by default
        sortedStrings = sortedStrings.sort();

        expect(strings).toEqual(sortedStrings);
      });
    });

    xit('should sort by each default column', function() {
      columns.columnTwoHeader.click(); // Change sorting order

      columns.allHeaders.each(function(columnHeader, index) {
        columnHeader.getAttribute('class').then(function (classes) {
          if (classes.indexOf('sortable-header') !== -1){ //Only check sorting results on sortable columns
            shared.tableElements.map(function (row, rowIndex) {
              var cell = shared.table.element(by.css('tr:nth-child(' + (rowIndex + 1) + ') td:nth-child(' + (index + 1) + ')'));
              return cell.getText().then(function (text) {
                  return text.toLowerCase();
              });
            }).then(function (strings) {
              // get a copy of the array
              var sortedStrings = strings.slice();

              //Sorts it based on character code by default
              sortedStrings = sortedStrings.sort();

              //Verify that column is properly sorted
              expect(strings).toEqual(sortedStrings);

              // Verify that sorted icon displayed
              expect(columns.tableHeader.element(by.css('th:nth-child(' + (index + 1) + ')')).element(by.css(columns.sortIconArrowDown)).isDisplayed()).toBeTruthy();
              expect(columns.displayedSortIcons.count()).toBe(1);
            }).then(function (strings) {
              //Reverse the sort order
              columns.tableHeader.element(by.css('th:nth-child(' + (index + 1) + ')')).click();

              shared.tableElements.map(function (row, rowIndex) {
                var cell = shared.table.element(by.css('tr:nth-child(' + (rowIndex + 1) + ') td:nth-child(' + (index + 1) + ')'));
                return cell.getText().then(function (text) {
                    return text.toLowerCase();
                });
              }).then(function (strings) {
                // get a copy of the array
                var sortedStrings = strings.slice();

                //Reverse sort the target array
                sortedStrings = sortedStrings.sort().reverse();

                //Verify that column is properly sorted
                expect(strings).toEqual(sortedStrings);

                // Verify that sorted icon displayed
                expect(columns.tableHeader.element(by.css('th:nth-child(' + (index + 1) + ')')).element(by.css(columns.sortIconArrowUp)).isDisplayed()).toBeTruthy();
                expect(columns.displayedSortIcons.count()).toBe(1);
              })
            });
          }
        }).thenFinally(function(){
          //Click to sort the next column, if it exists
          columns.allHeaders.count().then(function(count){
            if (index + 2 <= count){
              columns.tableHeader.element(by.css('th:nth-child(' + (index + 2) + ')')).click();
            }
          });
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
