'use strict';

angular.module('liveopsConfigPanel')
  .factory('ZermeloService', ['_', function(_) {
    return {
      addFilter: addFilter,
      removeFilter: removeFilter,
      addQueryLevel: addQueryLevel,
      removeQueryLevel: removeQueryLevel,
      updateQueryLevel: updateQueryLevel
    };

    function addFilter(level, type, filter, query, itemId, condition) {
      var newClause = makeNewClause(type, itemId, condition);
      if (angular.isDefined(query[level][':query'][type])) {
        var success = false;
        query[level][':query'][type].forEach(function(queryGroup, idx, groups) {
          if (queryGroup[0] === filter) {
            pushNewRule(type, groups[idx][1], itemId, condition);
            success = true;
          }
        });
        if (!success) {
          query[level][':query'][type].push([filter, newClause]);
        }
        return;
      }
      query[level][':query'][type] = [[filter, newClause]];
    }

    function removeFilter(level, type, filter, query, itemId) {
      var index;
      var blockToEdit = query[level][':query'][type];

      blockToEdit.forEach(function(queryGroup, idx, groups) {
        if (queryGroup[0] === filter) {
          index = idx;
          type === ':skills' ? delete groups[idx][1][itemId] : _.pull(queryGroup[1], itemId);
        }
      });

      var noSkillsRemaining = !Object.keys(blockToEdit[index][1]).length;
      var noGroupsRemaining = !blockToEdit[index][1].length;

      if ((type === ':skills' && noSkillsRemaining) || (type !== ':skills' && noGroupsRemaining)) {
        blockToEdit.splice(index, 1);
        if (!blockToEdit.length) {
          delete query[level][':query'][type];
        }
      }
    }

    function addQueryLevel(query) {
      var previousSecondsInQueue = query.slice(-1)[0][':after-seconds-in-queue'];
      query.push({
        ':after-seconds-in-queue': previousSecondsInQueue + 1,
        ':query': {}
      });
    }

    function removeQueryLevel(query, level) {
      query.splice(level, 1);
    }

    function updateQueryLevel(query, level, time) {
      query[level][':after-seconds-in-queue'] = time;
    }

    // =============================================================
    // Helper functions below are not exposed outside of the service
    // =============================================================

    function makeNewClause(type, itemId, condition) {
      var newClause = {};
      if (type === ':skills') {
        newClause[itemId] = condition;
        return newClause;
      }
      newClause = [itemId];
      return newClause;
    }

    function pushNewRule(type, queryGroup, itemId, condition) {
      if (type === ':skills') {
        queryGroup[itemId] = condition;
        return;
      }
      queryGroup.push(itemId);
    }

  }]);
