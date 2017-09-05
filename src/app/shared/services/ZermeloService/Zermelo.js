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
    var escalation;
    var query;
    var ednString;
    resetQuery();

    return {
      getQuery: getQuery,
      getQueryString: getQueryString,
      addFilter: addFilter,
      displayProficiency: displayProficiency,
      removeFilter: removeFilter,
      removeType: removeType,
      addQueryLevel: addQueryLevel,
      removeQueryLevel: removeQueryLevel,
      updateQueryLevel: updateQueryLevel,
      resetQuery: resetQuery,
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

    function getQueryString() {
      return ednString;
    }

    function displayProficiency(skill, advancedQuery, someOrAllSkills) {
      var proficiency = '';

      if (advancedQuery) {
        var parsedAdvancedQuery = jsedn.parse(advancedQuery);
        var parsedQuery = parsedAdvancedQuery.jsEncode();
        var skillsArray = parsedQuery[0][keywordEnum.QUERY][keywordEnum.SKILLS];
        var skillsIdx;

        // if this isn't a proper skill filter, then we have no proficiency
        // to display, bail out now, no harm, no foul :)
        if (!skillsArray) {
          return proficiency;
        }

        // the location of the data we need in the query object
        // depends on whether we're filtering for all or some of the
        // skills, so here is how we set an index to point to the correct
        // object as we traverse through the query
        skillsIdx =  _.findIndex(skillsArray, function (val) {
          return val[0] === someOrAllSkills;
        });

        // if we find nothing in the skills list using this index, bail out!
        if (!skillsArray[skillsIdx]) {
          return proficiency;
        }

        var skillsObject = skillsArray[skillsIdx][1];
        // create a list of the keys for the EDN entity, since we'll need these
        // keys to find the index of the skill whose proficiency we need
        var parsedKeyList = _.keysIn(skillsObject);

        // using the index of the current filter item, find the corresponding
        // array containing the 2 strings that comprise the proficiency
        // display (ex: [">=", 2]) that the user sees. Then combine the 2 strings
        // into one (ex: ">= 2").
        if (parsedKeyList.indexOf(skill.id) !== -1) {
          var indexOfSkill = parsedKeyList.indexOf(skill.id);
          var parsedValueList = _.valuesIn(skillsObject);
          proficiency = ' (' + parsedValueList[indexOfSkill].join('') + ')';
        }
      }

      return proficiency;
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
        ednString = toEdnString(query);
        return query;
      }
      var newVector = new jsedn.Vector([filterExpression]);
      query.at(level).at(keywordEnum.QUERY).set(type, newVector);
      ednString = toEdnString(query);
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
      ednString = toEdnString(query);
      return query;
    }

    function removeType(level, type) {
      type = keywordEnum[type];
      query.at(level).at(keywordEnum.QUERY).keys.forEach(function(val, idx) {
        query.at(level).at(keywordEnum.QUERY).keys.splice(idx, 1);
        query.at(level).at(keywordEnum.QUERY).vals.splice(idx, 1);
      });
      ednString = toEdnString(query);
      return query;
    }

    function addQueryLevel() {
      var newASIQ = _.last(query.val).at(keywordEnum.ASIQ) + 1;
      var newLevel = new jsedn.Map();
      newLevel.set(keywordEnum.ASIQ, newASIQ);
      newLevel.set(keywordEnum.QUERY, new jsedn.Map());
      query.val.push(newLevel);
      ednString = toEdnString(query);
      return query;
    }

    function removeQueryLevel(level) {
      query.val.splice(level, 1);
      ednString = toEdnString(query);
      return query;
    }

    function updateQueryLevel(level, time) {
      query.at(level).set(keywordEnum.ASIQ, time);
      ednString = toEdnString(query);
      return query;
    }

    function resetQuery() {
      escalation = new jsedn.Map();
      escalation.set(keywordEnum.ASIQ, 0);
      escalation.set(keywordEnum.QUERY, new jsedn.Map());
      query = new jsedn.Vector([escalation]);
      ednString = toEdnString(query);
      return query;
    }

    function toEdnString(queryObj) {
      return jsedn.encode(queryObj);
    }

    function parseString(stringToParse) {
      try {
        var counter = 0;
        stringToParse = stringToParse.replace(/#uuid/g, function(match) {
          counter++;
          return match + counter;
        });
        var newQuery = jsedn.parse(stringToParse);
        replaceUUID(newQuery);
        query = newQuery;
        ednString = toEdnString(query);
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
        return new jsedn.Map([new jsedn.Tagged(new jsedn.Tag('uuid'), itemId), comparator]);
      }
      return new jsedn.Set([new jsedn.Tagged(new jsedn.Tag('uuid'), itemId)]);
    }

    function pushNewRule(type, queryGroup, itemId, condition) {
      if (type === keywordEnum.SKILLS) {
        var comparator = new jsedn.List([keywordEnum[condition[0]], condition[1]]);
        queryGroup.set(new jsedn.Tagged(new jsedn.Tag('uuid'), itemId), comparator);
        return;
      }
      queryGroup.val.push(new jsedn.Tagged(new jsedn.Tag('uuid'), itemId));
    }

    function deleteIdFromQuery(type, queryGroup, itemId) {
      if (type === keywordEnum.SKILLS) {
        queryGroup.keys.forEach(function(key, index) {
          if (key._obj === itemId) {
            queryGroup.keys.splice(index, 1);
            queryGroup.vals.splice(index, 1);
          }
        });
        return;
      }
      _.remove(queryGroup.val, function(value) {
        return value._obj === itemId;
      });
    }

    function replaceUUID(obj) {
      if (Array.isArray(obj)) {
        obj.forEach(function(val) {
          replaceUUID(val);
        });
      } else {
        for (var prop in obj) {
          if (obj[prop] === null || !obj.hasOwnProperty(prop)) {
            continue;
          }
          if (typeof obj[prop] === 'object') {
            replaceUUID(obj[prop]);
          } else if (obj.hasOwnProperty('_tag')) {
            obj._tag = new jsedn.Tag('uuid');
          }
        }
      }
    }

  }]);
