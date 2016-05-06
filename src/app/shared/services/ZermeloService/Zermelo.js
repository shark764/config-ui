'use strict';

angular.module('liveopsConfigPanel')
  .factory('ZermeloService', ['jsedn', '_', function(jsedn, _) {

    // EDN keywords and filter symbols found in the query
    var keywordEnum = {
      QUERY: jsedn.kw(':query'),
      USERS: jsedn.kw(':user-id'),
      SKILLS: jsedn.kw(':skills'),
      GROUPS: jsedn.kw(':groups'),
      ASIQ: jsedn.kw(':after-seconds-in-queue'),
      some: jsedn.sym('some'),
      all: jsedn.sym('every'),
      '=': jsedn.sym('='),
      '>=': jsedn.sym('>='),
      '>': jsedn.sym('>'),
      '<=': jsedn.sym('<='),
      '<': jsedn.sym('<')
    };

    // Initializing the query in its starting state
    var escalation = new jsedn.Map();
    escalation.set(keywordEnum.ASIQ, 0);
    escalation.set(keywordEnum.QUERY, new jsedn.Map());
    var query = new jsedn.Vector([escalation]);

    return {
      getQuery: getQuery,
      addFilter: addFilter,
      removeFilter: removeFilter,
      removeType: removeType,
      addQueryLevel: addQueryLevel,
      removeQueryLevel: removeQueryLevel,
      updateQueryLevel: updateQueryLevel,
      toEdnString: toEdnString,
      parseString: parseString,
      keywordEnum: keywordEnum
    };

    // =======================================================================
    // Factory methods =======================================================
    // =======================================================================

    function getQuery() {
      return query;
    }

    function addFilter(level, type, filter, itemId, condition) {
      type = keywordEnum[type];
      var newClause = makeNewClause(type, itemId, condition);
      var filterExpression = new jsedn.List([keywordEnum[filter], newClause]);
      if (query.at(level).at(keywordEnum.QUERY).exists(type)) {
        var success = false;
        query.at(level).at(keywordEnum.QUERY).at(type).each(function(queryGroup) {
          if(queryGroup.at(0) === keywordEnum[filter]) {
            pushNewRule(type, queryGroup.at(1), itemId, condition);
            success = true;
          }
        });
        if (!success) {
          query.at(0).at(keywordEnum.QUERY).at(type).val.push(filterExpression);
        }
        return query;
      }
      var newVector = new jsedn.Vector([filterExpression]);
      query.at(level).at(keywordEnum.QUERY).set(type, newVector);
      return query;
    }

    function removeFilter(level, type, filter, itemId) {
      type = keywordEnum[type];
      var typeClause = query.at(level).at(keywordEnum.QUERY).at(type).val;
      typeClause.forEach(function(queryGroup, idx) {
        if(queryGroup.at(0) === keywordEnum[filter]) {
          deleteIdFromQuery(type, queryGroup.at(1), itemId);
          var idsRemaining = type === keywordEnum.SKILLS ? queryGroup.at(1).vals.length : queryGroup.at(1).val.length;
          if (!idsRemaining) {
            typeClause.splice(idx, 1);
            if(!typeClause.length) {
              _.pull(query.at(level).at(keywordEnum.QUERY).keys, type);
              _.remove(query.at(level).at(keywordEnum.QUERY).vals, function(obj) {
                return !obj.val.length;
              });
            }
          }
        }
      });
      return query;
    }

    function removeType(level, type) {
      type = keywordEnum[type];
      query.at(level).at(keywordEnum.QUERY).keys.forEach(function(val, idx) {
        query.at(level).at(keywordEnum.QUERY).keys.splice(idx, 1);
        query.at(level).at(keywordEnum.QUERY).vals.splice(idx, 1);
      });
      return query;
    }

    function addQueryLevel() {
      var newASIQ = _.last(query.val).at(keywordEnum.ASIQ) + 1;
      var newLevel = new jsedn.Map();
      newLevel.set(keywordEnum.ASIQ, newASIQ);
      newLevel.set(keywordEnum.QUERY, new jsedn.Map());
      query.val.push(newLevel);
      return query;
    }

    function removeQueryLevel(level) {
      query.val.splice(level, 1);
      return query;
    }

    function updateQueryLevel(level, time) {
      query.at(level).set(keywordEnum.ASIQ, time);
      return query;
    }

    function toEdnString() {
      return jsedn.encode(query);
    }

    function parseString(ednString) {
      try {
        var newQuery = jsedn.parse(ednString);
        query = newQuery;
        return query;
      } catch (e) {
        return null;
      }
    }

    // =============================================================
    // Helper functions below are not exposed outside of the service
    // =============================================================

    function makeNewClause(type, itemId, condition) {
      if (type === keywordEnum.SKILLS) {
        var comparator = new jsedn.List([keywordEnum[condition[0]], condition[1]]);
        return new jsedn.Map([itemId, comparator]);
      }
      return new jsedn.Set([itemId]);
    }

    function pushNewRule(type, queryGroup, itemId, condition) {
      if (type === keywordEnum.SKILLS) {
        var comparator = new jsedn.List([keywordEnum[condition[0]], condition[1]]);
        queryGroup.set(itemId, comparator);
        return;
      }
      queryGroup.val.push(itemId);
    }

    function deleteIdFromQuery(type, queryGroup, itemId) {
      if (type === keywordEnum.SKILLS) {
        queryGroup.keys.forEach(function(key, index) {
          if (key === itemId) {
            queryGroup.keys.splice(index, 1);
            queryGroup.vals.splice(index, 1);
          }
        });
        return;
      }
      _.pull(queryGroup.val, itemId);
    }

  }]);
