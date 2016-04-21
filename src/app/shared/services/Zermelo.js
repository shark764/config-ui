'use strict';

angular.module('liveopsConfigPanel')
  .factory('ZermeloService', ['_', function(_) {
    return {
      addUser: addUser,
      removeUser: removeUser,
      addAnyGroup: addAnyGroup,
      removeAnyGroup: removeAnyGroup,
      addAllGroup: addAllGroup,
      removeAllGroup: removeAllGroup,
      addAnySkill: addAnySkill,
      removeAnySkill: removeAnySkill,
      addAllSkill: addAllSkill,
      removeAllSkill: removeAllSkill
    };

    // TODO: Oh this can be -drastically- simplified if we can output users the same way as groups/skills
    // If we can, then we just have "addAny" and "addAll" functions and pass user/group/skill as a key
    // Just need to handle the fact that skills are maps while users/groups are sets

    // TODO: Also, we are going to replace the query[0] references with query[lvl] references once we start working with query escalations

    // TODO: Should this service handle errors - for instance if trying to add same user to query more than once? Or should the view/controller handle that?

    function addUser(query, userId) {
      if (angular.isDefined(query[0][":query"][":user-id"])) {
        query[0][":query"][":user-id"][1].push(userId);
        return;
      }
      query[0][":query"][":user-id"] = ["some", [userId]];
    };


    function addAnyGroup(query, groupId) {
      if (angular.isDefined(query[0][":query"][":groups"])) {
        var success = false;
        query[0][":query"][":groups"].forEach(function(queryGroup, idx, groups) {
          if (queryGroup[0] === "some") {
            groups[idx][1].push(groupId);
            success = true;
          }
        });
        if (!success) {
          query[0][":query"][":groups"].push(["some", [groupId]])
        }
        return;
      }
      query[0][":query"][":groups"] = [["some", [groupId]]];
    };

    function addAnySkill(query, skillId, condition) {
      var skillMap = {};
      skillMap[skillId] = condition;
      if (angular.isDefined(query[0][":query"][":skills"])) {
        var success = false;
        query[0][":query"][":skills"].forEach(function(queryGroup, idx, skills) {
          if (queryGroup[0] === "some") {
            skills[idx][1][skillId] = condition;
            success = true;
          }
        });
        if (!success) {
          query[0][":query"][":skills"].push(["some", skillMap]);
        }
        return;
      }
      query[0][":query"][":skills"] = [["some", skillMap]];
    };

    function removeUser(query, userId) {
      _.pull(query[0][":query"][":user-id"][1], userId);
      if (!query[0][":query"][":user-id"][1].length) {
        delete query[0][":query"][":user-id"];
      }
    };

    function removeAnyGroup(query, groupId) {
      var index;
      query[0][":query"][":groups"].forEach(function(queryGroup, idx) {
        if (queryGroup[0] === "some") {
          index = idx;
          _.pull(queryGroup[1], groupId);
        }
      });
      if (!query[0][":query"][":groups"][index][1].length) {
        query[0][":query"][":groups"].splice(index, 1);
        if (!query[0][":query"][":groups"].length) {
          delete query[0][":query"][":groups"];
        }
      }
    };

    function removeAnySkill(query, skillId) {
      var index;
      query[0][":query"][":skills"].forEach(function(queryGroup, idx, skills) {
        if (queryGroup[0] === "some") {
          index = idx;
          delete skills[idx][1][skillId];
        }
      });
      if (!Object.keys(query[0][":query"][":skills"][index][1]).length) {
        query[0][":query"][":skills"].splice(index, 1);
        if (!query[0][":query"][":skills"].length) {
          delete query[0][":query"][":skills"];
        }
      }
    };

// ------------------ ANY FILTERS ABOVE, ALL FILTERS BELOW ----------------------

    function addAllGroup(query, groupId) {
      if (angular.isDefined(query[0][":query"][":groups"])) {
        var success = false;
        query[0][":query"][":groups"].forEach(function(queryGroup, idx, groups) {
          if (queryGroup[0] === "every") {
            groups[idx][1].push(groupId);
            success = true;
          }
        });
        if (!success) {
          query[0][":query"][":groups"].push(["every", [groupId]])
        }
        return;
      }
      query[0][":query"][":groups"] = [["every", [groupId]]];
    };

    function addAllSkill(query, skillId, condition) {
      var skillMap = {};
      skillMap[skillId] = condition;
      if (angular.isDefined(query[0][":query"][":skills"])) {
        var success = false;
        query[0][":query"][":skills"].forEach(function(queryGroup, idx, skills) {
          if(queryGroup[0] === "every") {
            skills[idx][1][skillId] = condition;
            success = true;
          }
        });
        if (!success) {
          query[0][":query"][":skills"].push(["every", skillMap]);
        }
        query[0][":query"][":skills"][0][1][skillId] = condition;
        return;
      }
      query[0][":query"][":skills"] = [["every", skillMap]];
    };

    function removeAllGroup(query, groupId) {
      var index;
      query[0][":query"][":groups"].forEach(function(queryGroup, idx) {
        if (queryGroup[0] === "every") {
          index = idx;
          _.pull(queryGroup[1], groupId);
        }
      });
      if (!query[0][":query"][":groups"][index][1].length) {
        query[0][":query"][":groups"].splice(index, 1);
        if (!query[0][":query"][":groups"].length) {
          delete query[0][":query"][":groups"];
        }
      }
    };

    function removeAllSkill(query, skillId) {
      var index;
      query[0][":query"][":skills"].forEach(function(queryGroup, idx, skills) {
        if (queryGroup[0] === "every") {
          index = idx;
          delete skills[idx][1][skillId];
        }
      });
      if (!Object.keys(query[0][":query"][":skills"][index][1]).length) {
        query[0][":query"][":skills"].splice(index, 1);
        if (!query[0][":query"][":skills"].length) {
          delete query[0][":query"][":skills"];
        }
      }
    };

  }]);
