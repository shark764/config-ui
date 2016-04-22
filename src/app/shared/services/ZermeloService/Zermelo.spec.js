'use strict';

describe('Zermelo Query Service', function() {
  var $scope;
  var ZermeloService;
  var query;
  var mockId1 = "00000-00000";
  var mockId2 = "00000-00001";
  var condition1 = [">", 5];
  var condition2 = [">=", 3];
  var skillMap;
  var USER = ":user-id";
  var GROUPS = ":groups";
  var SKILLS = ":skills";

  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));

  beforeEach(inject(['$rootScope', 'ZermeloService', function($rootScope, _ZermeloService) {
    $scope = $rootScope.$new();
    ZermeloService = _ZermeloService;
    skillMap = {};
    skillMap[mockId1] = condition1;

    query = [{
      ":after-seconds-in-queue": 0,
      ":query": {}
    }];
  }]));

  describe('User filters', function() {

    describe('Adding a user', function() {

      it('should add the :user-id key if not already there', function() {
        ZermeloService.addFilter(0, USER, "some", query, mockId1);
        expect(query[0][":query"][":user-id"]).toBeDefined();
      });

      it('should associate the :user-id key with an array of arrays', function() {
        ZermeloService.addFilter(0, USER, "some", query, mockId1);
        expect(Array.isArray(query[0][":query"][":user-id"])).toBe(true);
        expect(Array.isArray(query[0][":query"][":user-id"][0])).toBe(true);
      });

      it('should add a (some ...) expression associated with the ":user-id" key', function() {
        ZermeloService.addFilter(0, USER, "some", query, mockId1);
        expect(query[0][":query"][":user-id"][0][0]).toEqual("some");
      });

      it('should add an EDN set to the (some ...) expression if not already there', function() {
        ZermeloService.addFilter(0, USER, "some", query, mockId1);
        expect(Array.isArray(query[0][":query"][":user-id"][0][1])).toBe(true);
        expect(query[0][":query"][":user-id"][0][1]).toContain(mockId1);
      });

      it('should add user id to existing set if already there', function() {
        query[0][":query"][":user-id"] = [["some", [mockId1]]];

        ZermeloService.addFilter(0, USER, "some", query, mockId2);
        expect(query[0][":query"][":user-id"][0][1]).toContain(mockId1);
        expect(query[0][":query"][":user-id"][0][1]).toContain(mockId2);
      });

      it('should not effect groups or skills already in the query', function() {
        query[0][":query"][":skills"] = [["some", skillMap]];
        query[0][":query"][":groups"] = [["some", [mockId1]]];
        var skillsBeforeAdd = query[0][":query"][":skills"];
        var groupsBeforeAdd = query[0][":query"][":groups"];

        ZermeloService.addFilter(0, USER, "some", query, mockId1);
        expect(query[0][":query"][":skills"]).toEqual(skillsBeforeAdd);
        expect(query[0][":query"][":groups"]).toEqual(groupsBeforeAdd);
      });

    });

    describe('Removing a user', function() {

      it('should no longer contain the user-id of the removed user in the query', function() {
        query[0][":query"][":user-id"] = [["some", [mockId1, mockId2]]];

        ZermeloService.removeFilter(0, USER, "some", query, mockId1);
        expect(query[0][":query"][":user-id"][0][1]).not.toContain(mockId1);
        expect(query[0][":query"][":user-id"][0][1]).toContain(mockId2);
      });

      it('should remove the :user-id key if there are no user ids', function() {
        query[0][":query"][":user-id"] = [["some", [mockId1]]];

        ZermeloService.removeFilter(0, USER, "some", query, mockId1);
        expect(query[0][":query"][":user-id"]).toBeUndefined();
      });

      it('should NOT remove the :user-id key if there are still user ids', function() {
        query[0][":query"][":user-id"] = [["some", [mockId1, mockId2]]];

        ZermeloService.removeFilter(0, USER, "some", query, mockId1);
        expect(query[0][":query"][":user-id"]).toBeDefined();
      });

    });

  });

  describe('Group filters', function() {

    describe('Adding a group to the set of "Any" queries', function() {

      it('should add the :groups key if not already there', function() {
        ZermeloService.addFilter(0, GROUPS, "some", query, mockId1);
        expect(query[0][":query"][":groups"]).toBeDefined();
      });

      it('should associate the :groups key with an array of arrays', function() {
        ZermeloService.addFilter(0, GROUPS, "some", query, mockId1);
        expect(Array.isArray(query[0][":query"][":groups"])).toBe(true);
        expect(Array.isArray(query[0][":query"][":groups"][0])).toBe(true);
      });

      it('should add a (some ...) expression to the groups array', function() {
        ZermeloService.addFilter(0, GROUPS, "some", query, mockId1);
        expect(query[0][":query"][":groups"][0][0]).toEqual("some");
      });

      it('should add an EDN set to the (some ...) expression if not already there', function() {
        ZermeloService.addFilter(0, GROUPS, "some", query, mockId1);
        expect(Array.isArray(query[0][":query"][":groups"][0][1])).toBe(true);
        expect(query[0][":query"][":groups"][0][1]).toContain(mockId1);
      });

      it('should add group id to existing set if already there', function() {
        query[0][":query"][":groups"] = [["some", [mockId1]]];

        ZermeloService.addFilter(0, GROUPS, "some", query, mockId2);
        expect(query[0][":query"][":groups"][0][1]).toContain(mockId1);
        expect(query[0][":query"][":groups"][0][1]).toContain(mockId2);
      });

      it('should not effect users or skills already in the query', function() {
        query[0][":query"][":skills"] = [["some", skillMap]];
        query[0][":query"][":user-id"] = [["some", [mockId1]]];
        var skillsBeforeAdd = query[0][":query"][":skills"];
        var usersBeforeAdd = query[0][":query"][":user-id"];

        ZermeloService.addFilter(0, GROUPS, "some", query, mockId1);
        expect(query[0][":query"][":skills"]).toEqual(skillsBeforeAdd);
        expect(query[0][":query"][":user-id"]).toEqual(usersBeforeAdd);
      });

      it('should not effect existing "All" filters', function() {
        query[0][":query"][":groups"] = [["every", [mockId1]]];

        ZermeloService.addFilter(0, GROUPS, "some", query, mockId2);
        expect(query[0][":query"][":groups"][0]).toEqual(["every", [mockId1]]);
        expect(query[0][":query"][":groups"][1]).toEqual(["some", [mockId2]]);
      });

    });

    describe('Adding a group to the set of "All" queries', function() {

      it('should add the :groups key if not already there', function() {
        ZermeloService.addFilter(0, GROUPS, "every", query, mockId1);
        expect(query[0][":query"][":groups"]).toBeDefined();
      });

      it('should associate the :groups key with an array of arrays', function() {
        ZermeloService.addFilter(0, GROUPS, "every", query, mockId1);
        expect(Array.isArray(query[0][":query"][":groups"])).toBe(true);
        expect(Array.isArray(query[0][":query"][":groups"][0])).toBe(true);
      });

      it('should add an (every ...) expression to the groups array', function() {
        ZermeloService.addFilter(0, GROUPS, "every", query, mockId1);
        expect(query[0][":query"][":groups"][0][0]).toEqual("every");
      });

      it('should add an EDN set to the (every ...) expression if not already there', function() {
        ZermeloService.addFilter(0, GROUPS, "every", query, mockId1);
        expect(Array.isArray(query[0][":query"][":groups"][0][1])).toBe(true);
        expect(query[0][":query"][":groups"][0][1]).toContain(mockId1);
      });

      it('should add group id to existing set if already there', function() {
        query[0][":query"][":groups"] = [["every", [mockId1]]];

        ZermeloService.addFilter(0, GROUPS, "every", query, mockId2);
        expect(query[0][":query"][":groups"][0][1]).toContain(mockId1);
        expect(query[0][":query"][":groups"][0][1]).toContain(mockId2);
      });

      it('should not effect users or skills already in the query', function() {
        query[0][":query"][":skills"] = [["every", skillMap]];
        query[0][":query"][":user-id"] = [["some", [mockId1]]];
        var skillsBeforeAdd = query[0][":query"][":skills"];
        var usersBeforeAdd = query[0][":query"][":user-id"];

        ZermeloService.addFilter(0, GROUPS, "every", query, mockId1);
        expect(query[0][":query"][":skills"]).toEqual(skillsBeforeAdd);
        expect(query[0][":query"][":user-id"]).toEqual(usersBeforeAdd);
      });

      it('should not effect existing "Any" filters', function() {
        query[0][":query"][":groups"] = [["some", [mockId1]]];

        ZermeloService.addFilter(0, GROUPS, "every", query, mockId2);
        expect(query[0][":query"][":groups"][0]).toEqual(["some", [mockId1]]);
        expect(query[0][":query"][":groups"][1]).toEqual(["every", [mockId2]]);
      });

    });

    describe('Removing a group from the set of "Any" queries', function() {

      it('should no longer contain the group-id of the removed group in the query', function() {
        query[0][":query"][":groups"] = [["some", [mockId1, mockId2]]];

        ZermeloService.removeFilter(0, GROUPS, "some", query, mockId1);
        expect(query[0][":query"][":groups"][0][1]).not.toContain(mockId1);
        expect(query[0][":query"][":groups"][0][1]).toContain(mockId2);
      });

      it('should remove the :groups key if there are no group ids', function() {
        query[0][":query"][":groups"] = [["some", [mockId1]]];

        ZermeloService.removeFilter(0, GROUPS, "some", query, mockId1);
        expect(query[0][":query"][":groups"]).toBeUndefined();
      });

      it('should NOT remove the :groups key if there are more group ids', function() {
        query[0][":query"][":groups"] = [["some", [mockId1, mockId2]]];
        ZermeloService.removeFilter(0, GROUPS, "some", query, mockId1);
        expect(query[0][":query"][":groups"]).toBeDefined();

        query[0][":query"][":groups"] = [["some", [mockId2]], ["every", [mockId1]]];
        ZermeloService.removeFilter(0, GROUPS, "some", query, mockId2);
        expect(query[0][":query"][":groups"]).toBeDefined();
        expect(query[0][":query"][":groups"].length).toEqual(1);
      });

    });

    describe('Removing a group from the set of "All" queries', function() {

      it('should no longer contain the group-id of the removed group in the query', function() {
        query[0][":query"][":groups"] = [["every", [mockId1, mockId2]]];

        ZermeloService.removeFilter(0, GROUPS, "every", query, mockId1);
        expect(query[0][":query"][":groups"][0][1]).not.toContain(mockId1);
        expect(query[0][":query"][":groups"][0][1]).toContain(mockId2);
      });

      it('should remove the :groups key if there are no group ids', function() {
        query[0][":query"][":groups"] = [["every", [mockId1]]];

        ZermeloService.removeFilter(0, GROUPS, "every", query, mockId1);
        expect(query[0][":query"][":groups"]).toBeUndefined();
      });

      it('should NOT remove the :groups key if there are more group ids', function() {
        query[0][":query"][":groups"] = [["every", [mockId1, mockId2]]];
        ZermeloService.removeFilter(0, GROUPS, "every", query, mockId1);
        expect(query[0][":query"][":groups"]).toBeDefined();

        query[0][":query"][":groups"] = [["every", [mockId2]], ["some", [mockId1]]];
        ZermeloService.removeFilter(0, GROUPS, "every", query, mockId2);
        expect(query[0][":query"][":groups"]).toBeDefined();
        expect(query[0][":query"][":groups"].length).toEqual(1);
      });

    });

  });

  describe('Skill filters', function() {

    describe('Adding a skill to the set of "Any" queries', function() {

      it('should add the :skills key if not already there', function() {
        ZermeloService.addFilter(0, SKILLS, "some", query, mockId1, condition1);
        expect(query[0][":query"][":skills"]).toBeDefined();
      });

      it('should associate the :skills key with an array of arrays', function() {
        ZermeloService.addFilter(0, SKILLS, "some", query, mockId1, condition1);
        expect(Array.isArray(query[0][":query"][":skills"])).toBe(true);
        expect(Array.isArray(query[0][":query"][":skills"][0])).toBe(true);
      });

      it('should add a (some ...) expression to the skills array', function() {
        ZermeloService.addFilter(0, SKILLS, "some", query, mockId1, condition1);
        expect(query[0][":query"][":skills"][0][0]).toEqual("some");
      });

      it('should add skill/comparator to a new attribute map in the (some ...) expression if not already there', function() {
        ZermeloService.addFilter(0, SKILLS, "some", query, mockId1, condition1);
        expect(query[0][":query"][":skills"][0][1][mockId1]).toEqual(condition1);
      });

      it('should add new skills/comparators to existing attribute map if it already exists', function() {
        query[0][":query"][":skills"] = [["some", skillMap]];

        ZermeloService.addFilter(0, SKILLS, "some", query, mockId2, condition2);
        expect(query[0][":query"][":skills"][0][1][mockId1]).toEqual(condition1);
        expect(query[0][":query"][":skills"][0][1][mockId2]).toEqual(condition2);
      });

      it('should not effect users or groups already in the query', function() {
        query[0][":query"][":user-id"] = [["some", [mockId1]]];
        query[0][":query"][":groups"] = [["some", [mockId1]]];
        var usersBeforeAdd = query[0][":query"][":user-id"];
        var groupsBeforeAdd = query[0][":query"][":groups"];

        ZermeloService.addFilter(0, SKILLS, "some", query, mockId1, condition1);
        expect(query[0][":query"][":groups"]).toEqual(groupsBeforeAdd);
        expect(query[0][":query"][":user-id"]).toEqual(usersBeforeAdd);
      });

      it('should not effect existing "All" filters', function() {
        query[0][":query"][":skills"] = [["every", skillMap]];

        ZermeloService.addFilter(0, SKILLS, "some", query, mockId1, condition1);
        expect(query[0][":query"][":skills"][0]).toEqual(["every", skillMap]);
        expect(query[0][":query"][":skills"][1]).toEqual(["some", skillMap]);
      });

    });

    describe('Adding a skill to the set of "All" queries', function() {

      it('should add the :skills key if not already there', function() {
        ZermeloService.addFilter(0, SKILLS, "every", query, mockId1, condition1);
        expect(query[0][":query"][":skills"]).toBeDefined();
      });

      it('should associate the :skills key with an array of arrays', function() {
        ZermeloService.addFilter(0, SKILLS, "every", query, mockId1, condition1);
        expect(Array.isArray(query[0][":query"][":skills"])).toBe(true);
        expect(Array.isArray(query[0][":query"][":skills"][0])).toBe(true);
      });

      it('should add an (every ...) expression to the skills array', function() {
        ZermeloService.addFilter(0, SKILLS, "every", query, mockId1, condition1);
        expect(query[0][":query"][":skills"][0][0]).toEqual("every");
      });

      it('should add skill/comparator to a new attribute map in the (some ...) expression if not already there', function() {
        ZermeloService.addFilter(0, SKILLS, "every", query, mockId1, condition1);
        expect(query[0][":query"][":skills"][0][1][mockId1]).toEqual(condition1);
      });

      it('should add new skills/comparators to existing attribute map if it already exists', function() {
        query[0][":query"][":skills"] = [["every", skillMap]];

        ZermeloService.addFilter(0, SKILLS, "every", query, mockId2, condition2);
        expect(query[0][":query"][":skills"][0][1][mockId1]).toEqual(condition1);
        expect(query[0][":query"][":skills"][0][1][mockId2]).toEqual(condition2);
      });

      it('should not effect users or groups already in the query', function() {
        query[0][":query"][":user-id"] = [["some", [mockId1]]];
        query[0][":query"][":groups"] = [["every", [mockId1]]];
        var usersBeforeAdd = query[0][":query"][":user-id"];
        var groupsBeforeAdd = query[0][":query"][":groups"];

        ZermeloService.addFilter(0, SKILLS, "every", query, mockId1, condition1);
        expect(query[0][":query"][":groups"]).toEqual(groupsBeforeAdd);
        expect(query[0][":query"][":user-id"]).toEqual(usersBeforeAdd);
      });

      it('should not effect existing "Any" filters', function() {
        query[0][":query"][":skills"] = [["some", skillMap]];

        ZermeloService.addFilter(0, SKILLS, "every", query, mockId1, condition1);
        expect(query[0][":query"][":skills"][0]).toEqual(["some", skillMap]);
        expect(query[0][":query"][":skills"][1]).toEqual(["every", skillMap]);
      });

    });

    describe('Removing a skill from the set of "Any" queries', function() {

      it('should no longer contain the skill-id of the removed skill in the query', function() {
        skillMap[mockId2] = condition2;
        query[0][":query"][":skills"] = [["some", skillMap]];

        ZermeloService.removeFilter(0, SKILLS, "some", query, mockId1);
        expect(Object.keys(query[0][":query"][":skills"][0][1])).not.toContain(mockId1);
        expect(Object.keys(query[0][":query"][":skills"][0][1])).toContain(mockId2);
      });

      it('should remove the :skills key if there are no skill ids', function() {
        query[0][":query"][":skills"] = [["some", skillMap]];

        ZermeloService.removeFilter(0, SKILLS, "some", query, mockId1);
        expect(query[0][":query"][":skills"]).toBeUndefined();
      });

      it('should NOT remove the :skills key if there are more skill ids', function() {
        skillMap[mockId2] = condition2;
        query[0][":query"][":skills"] = [["some", skillMap]];

        ZermeloService.removeFilter(0, SKILLS, "some", query, mockId1);
        expect(query[0][":query"][":skills"]).toBeDefined();

        var skillMap2 = {};
        skillMap2[mockId1] = condition1;
        query[0][":query"][":skills"].push(["every", skillMap2]);

        ZermeloService.removeFilter(0, SKILLS, "some", query, mockId2);
        expect(query[0][":query"][":skills"]).toBeDefined();
      });

    });

    describe('Removing a skill from the set of "All" queries', function() {

      it('should no longer contain the skill-id of the removed skill in the query', function() {
        skillMap[mockId2] = condition2;
        query[0][":query"][":skills"] = [["every", skillMap]];

        ZermeloService.removeFilter(0, SKILLS, "every", query, mockId1);
        expect(Object.keys(query[0][":query"][":skills"][0][1])).not.toContain(mockId1);
        expect(Object.keys(query[0][":query"][":skills"][0][1])).toContain(mockId2);
      });

      it('should remove the :skills key if there are no skill ids', function() {
        query[0][":query"][":skills"] = [["every", skillMap]];

        ZermeloService.removeFilter(0, SKILLS, "every", query, mockId1);
        expect(query[0][":query"][":skills"]).toBeUndefined();
      });

      it('should NOT remove the :skills key if there are more skill ids', function() {
        skillMap[mockId2] = condition2;
        query[0][":query"][":skills"] = [["every", skillMap]];
        ZermeloService.removeFilter(0, SKILLS, "every", query, mockId1);
        expect(query[0][":query"][":skills"]).toBeDefined();

        var skillMap2 = {};
        skillMap2[mockId1] = condition1;
        query[0][":query"][":skills"].push(["some", skillMap2]);
        ZermeloService.removeFilter(0, SKILLS, "every", query, mockId2);
        expect(query[0][":query"][":skills"]).toBeDefined();
      });

    });

  });

  describe('Query levels', function() {

    describe('Adding a query level', function() {

      it('should add a backoff rule to the end of the existing list of rules', function() {
        ZermeloService.addQueryLevel(query);
        expect(query.length).toEqual(2);
      });

      it('should create a backoff rule with ":after-seconds-in-queue" set to one more second than the previous level', function() {
        ZermeloService.addQueryLevel(query);
        expect(query[1][":after-seconds-in-queue"]).toEqual(query[0][":after-seconds-in-queue"] + 1);
      });

    });

    describe('Removing a query level', function() {

      it('should remove a backoff rule from the list of rules', function() {
        query.push({
          ":after-seconds-in-queue": 1,
          ":query": {}
        });
        ZermeloService.removeQueryLevel(query, 1);
        expect(query.length).toEqual(1);
      });

      it('should specifically remove the query level specified', function() {
        query.push({
          ":after-seconds-in-queue": 1,
          ":query": {}
        });
        query.push({
          ":after-seconds-in-queue": 2,
          ":query": {}
        });
        query.push({
          ":after-seconds-in-queue": 3,
          ":query": {}
        });
        ZermeloService.removeQueryLevel(query, 2);
        expect(query[2][":after-seconds-in-queue"]).not.toEqual(2);
      });

    });

    describe('Updating a query level', function() {

      it('should update the correct query level with a new ":after-seconds-in-queue" value', function() {
        query.push({
          ":after-seconds-in-queue": 1,
          ":query": {}
        });
        query.push({
          ":after-seconds-in-queue": 2,
          ":query": {}
        });
        ZermeloService.updateQueryLevel(query, 1, 10);
        expect(query[0][":after-seconds-in-queue"]).toEqual(0);
        expect(query[1][":after-seconds-in-queue"]).toEqual(10);
        expect(query[2][":after-seconds-in-queue"]).toEqual(2);
      });

      it('should update the correct query level with user, group, and skill changes', function() {
        query[0][":query"][":user-id"] = [["some", [mockId1]]];
        query.push({
          ":after-seconds-in-queue": 1,
          ":query": {
            ":groups": [["some", [mockId1]]]
          }
        });
        query.push({
          ":after-seconds-in-queue": 2,
          ":query": {
            ":skills": [["some", skillMap]]
          }
        });
        expect(query[0][":query"][":user-id"]).toBeDefined();
        expect(query[1][":query"][":user-id"]).toBeUndefined();
        expect(query[2][":query"][":user-id"]).toBeUndefined();
        expect(query[0][":query"][":groups"]).toBeUndefined();
        expect(query[1][":query"][":groups"]).toBeDefined();
        expect(query[2][":query"][":groups"]).toBeUndefined();
        expect(query[0][":query"][":skills"]).toBeUndefined();
        expect(query[1][":query"][":skills"]).toBeUndefined();
        expect(query[2][":query"][":skills"]).toBeDefined();
        ZermeloService.removeFilter(1, GROUPS, "some", query, mockId1);
        expect(query[1][":query"][":groups"]).toBeUndefined();
      });

    });

  });

});
