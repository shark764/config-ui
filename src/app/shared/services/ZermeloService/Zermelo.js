'use strict';

angular.module('liveopsConfigPanel')
  .factory('ZermeloService', ['_', function(_) {
    return {
      addAnyFilter: addAnyFilter,
      removeAnyFilter: removeAnyFilter,
      addAllFilter: addAllFilter,
      removeAllFilter: removeAllFilter,
      addQueryLevel: addQueryLevel,
      removeQueryLevel: removeQueryLevel,
      updateQueryLevel: updateQueryLevel
    };

    function addAnyFilter(level, type, query, itemId, condition) {
      var newClause = {};
      if (type === ":skills") {
        newClause[itemId] = condition;
      } else {
        newClause = [itemId];
      }
      if (angular.isDefined(query[level][":query"][type])) {
        var success = false;
        query[level][":query"][type].forEach(function(queryGroup, idx, groups) {
          if (queryGroup[0] === "some") {
            if (type === ":user-id" || type === ":groups") {
              groups[idx][1].push(itemId);
            } else if (type === ":skills") {
              groups[idx][1][itemId] = condition;
            }
            success = true;
          }
        });
        if (!success) {
          query[level][":query"][type].push(["some", newClause])
        }
        return;
      }
      query[level][":query"][type] = [["some", newClause]];
    };

    function removeAnyFilter(level, type, query, itemId) {
      var index;
      query[level][":query"][type].forEach(function(queryGroup, idx, groups) {
        if (queryGroup[0] === "some") {
          index = idx;
          type === ":skills" ? delete groups[idx][1][itemId] : _.pull(queryGroup[1], itemId);
        }
      });
      if ((type === ":skills" && !Object.keys(query[level][":query"][":skills"][index][1]).length)
          || (type !== ":skills" && !query[level][":query"][type][index][1].length)) {
        query[level][":query"][type].splice(index, 1);
        if (!query[level][":query"][type].length) {
          delete query[level][":query"][type];
        }
      }
    };

    function addAllFilter(level, type, query, itemId, condition) {
      var newClause = {};
      if (type === ":skills") {
        newClause[itemId] = condition;
      } else {
        newClause = [itemId];
      }
      if (angular.isDefined(query[level][":query"][type])) {
        var success = false;
        query[level][":query"][type].forEach(function(queryGroup, idx, groups) {
          if (queryGroup[0] === "every") {
            if (type === ":groups") {
              groups[idx][1].push(itemId);
            } else if (type === ":skills") {
              groups[idx][1][itemId] = condition;
            }
            success = true;
          }
        });
        if (!success) {
          query[level][":query"][type].push(["every", newClause]);
        }
        return;
      }
      query[level][":query"][type] = [["every", newClause]];
    };

    function removeAllFilter(level, type, query, itemId) {
      var index;
      query[level][":query"][type].forEach(function(queryGroup, idx, groups) {
        if (queryGroup[0] === "every") {
          index = idx;
          type === ":skills" ? delete groups[idx][1][itemId] : _.pull(queryGroup[1], itemId);
        }
      });
      if ((type === ":skills" && !Object.keys(query[level][":query"][":skills"][index][1]).length)
          || (type !== ":skills" && !query[level][":query"][type][index][1].length)) {
        query[level][":query"][type].splice(index, 1);
        if (!query[level][":query"][type].length) {
          delete query[level][":query"][type];
        }
      }
    };

    function addQueryLevel(query) {
      var previousSecondsInQueue = query.slice(-1)[0][":after-seconds-in-queue"];
      query.push({
        ":after-seconds-in-queue": previousSecondsInQueue + 1,
        ":query": {}
      });
    };

    function removeQueryLevel(query, level) {
      query.splice(level, 1);
    };

    function updateQueryLevel(query, level, time) {
      query[level][":after-seconds-in-queue"] = time;
    };

  }]);
