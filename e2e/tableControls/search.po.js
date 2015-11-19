'use strict';

var Search = function() {
  var users = require('../management/users.po.js');

  this.verifyUserSearch = function(searchTerm, rows) {
    var searchTermFound = false;

    // Users name, email, skills, or groups contain search phrase
    for (var i = 0; i < rows.length && i < 10; ++i) { // Limit test length
      rows[i].click();
      rows[i].getText().then(function(userRowText) {
        userRowText = userRowText.replace(/(?:\r\n|\r|\n)/g, ' ');
        if (userRowText.toLowerCase().indexOf(searchTerm) > -1) {
          searchTermFound = true;
        };
      });
      users.userSkills.then(function(userSkillElements) {
        for (var i = 0; i < userSkillElements.length && !searchTermFound; i++) {
          userSkillElements[i].getText().then(function(skillName) {
            if (skillName.toLowerCase().indexOf(searchTerm) > -1) {
              searchTermFound = true;
            };
          });
        }
      });
      users.userGroups.then(function(userGroupsElements) {
        for (var i = 0; i < userGroupsElements.length && !searchTermFound; i++) {
          userGroupsElements[i].getText().then(function(groupName) {
            if (groupName.toLowerCase().indexOf(searchTerm) > -1) {
              searchTermFound = true;
            };
          });
        }
      }).then(function() {
        expect(searchTermFound).toBeTruthy();
      });
    };
  };

  this.verifyUserSearchRegex = function(searchTermRegex, rows) {
    var searchTermFound = false;

    // Users name, email, skills, or groups contain search phrase
    for (var i = 0; i < rows.length && i < 10; ++i) { // Limit test length
      rows[i].click();
      rows[i].getText().then(function(userRowText) {
        if (userRowText.toLowerCase().search(searchTermRegex) > -1) {
          searchTermFound = true;
        };
      });
      users.userSkills.then(function(userSkillElements) {
        for (var i = 0; i < userSkillElements.length && !searchTermFound; i++) {
          userSkillElements[i].getText().then(function(skillName) {
            if (skillName.toLowerCase().search(searchTermRegex) > -1) {
              searchTermFound = true;
            };
          });
        }
      });
      users.userGroups.then(function(userGroupsElements) {
        for (var i = 0; i < userGroupsElements.length && !searchTermFound; i++) {
          userGroupsElements[i].getText().then(function(groupName) {
            if (groupName.toLowerCase().search(searchTermRegex) > -1) {
              searchTermFound = true;
            };
          });
        }
      }).then(function() {
        expect(searchTermFound).toBeTruthy();
      });
    };
  };
};

module.exports = new Search();
