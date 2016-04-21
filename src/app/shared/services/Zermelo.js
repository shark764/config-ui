'use strict';

angular.module('liveopsConfigPanel')
  .factory('ZermeloService', ['_', function(_) {
    return {
      addAnyFilter: addAnyFilter,
      removeAnyFilter: removeAnyFilter,
      addAllFilter: addAllFilter,
      removeAllFilter: removeAllFilter,
    };

    // TODO: We are going to replace the query[0] references with query[lvl] references once we start working with query escalations

    // TODO: Should this service handle errors - for instance if trying to add same user to query more than once? Or should the view/controller handle that?

    function addAnyFilter(type, query, itemId, condition) {
      var newClause = {};
      if (type === ":skills") {
        newClause[itemId] = condition;
      } else {
        newClause = [itemId];
      }
      if (angular.isDefined(query[0][":query"][type])) {
        var success = false;
        query[0][":query"][type].forEach(function(queryGroup, idx, groups) {
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
          query[0][":query"][type].push(["some", newClause])
        }
        return;
      }
      query[0][":query"][type] = [["some", newClause]];
    };

    function removeAnyFilter(type, query, itemId) {
      var index;
      query[0][":query"][type].forEach(function(queryGroup, idx, groups) {
        if (queryGroup[0] === "some") {
          index = idx;
          type === ":skills" ? delete groups[idx][1][itemId] : _.pull(queryGroup[1], itemId);
        }
      });
      if (type === ":skills" && !Object.keys(query[0][":query"][":skills"][index][1]).length) {
        query[0][":query"][type].splice(index, 1);
        if (!query[0][":query"][type].length) {
          delete query[0][":query"][type];
        }
      }
      if (type !== ":skills" && !query[0][":query"][type][index][1].length) {
        query[0][":query"][type].splice(index, 1);
        if (!query[0][":query"][type].length) {
          delete query[0][":query"][type];
        }
      }
    };

    function addAllFilter(type, query, itemId, condition) {
      var newClause = {};
      if (type === ":skills") {
        newClause[itemId] = condition;
      } else {
        newClause = [itemId];
      }
      if (angular.isDefined(query[0][":query"][type])) {
        var success = false;
        query[0][":query"][type].forEach(function(queryGroup, idx, groups) {
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
          query[0][":query"][type].push(["every", newClause]);
        }
        return;
      }
      query[0][":query"][type] = [["every", newClause]];
    };

    function removeAllFilter(type, query, itemId) {
      var index;
      query[0][":query"][type].forEach(function(queryGroup, idx, groups) {
        if (queryGroup[0] === "every") {
          index = idx;
          type === ":skills" ? delete groups[idx][1][itemId] : _.pull(queryGroup[1], itemId);
        }
      });
      if (type === ":skills" && !Object.keys(query[0][":query"][":skills"][index][1]).length) {
        query[0][":query"][type].splice(index, 1);
        if (!query[0][":query"][type].length) {
          delete query[0][":query"][type];
        }
      }
      if (type !== ":skills" && !query[0][":query"][type][index][1].length) {
        query[0][":query"][type].splice(index, 1);
        if (!query[0][":query"][type].length) {
          delete query[0][":query"][type];
        }
      }
    };

  }]);
