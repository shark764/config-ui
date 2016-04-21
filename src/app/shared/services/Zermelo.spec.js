'use strict';

describe('Zermelo Query Service', function() {
  var $scope;
  var ZermeloService;
  var query;
  var mockId1 = "00000-00000";
  var mockId2 = "00000-00001";
  var condition1 = [">", 5];
  var condition2 = [">=", 3];
  var USER = ":user-id";
  var GROUPS = ":groups";
  var SKILLS = ":skills";

  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));

  beforeEach(inject(['$rootScope', 'ZermeloService', function($rootScope, _ZermeloService) {
    $scope = $rootScope.$new();
    ZermeloService = _ZermeloService;

    query = [{
      ":after-seconds-in-queue": 0,
      ":query": {}
    }];
  }]));

  describe('User filters', function() {

    // TODO: Test adding/removing users when groups or skills exist in query

    describe('Adding a user', function() {

      it('should add the :user-id key if not already there', function() {
        expect(query[0][":query"][":user-id"]).toBeUndefined();
        ZermeloService.addAnyFilter(USER, query, mockId1);
        expect(query[0][":query"][":user-id"]).toBeDefined();
      });

      it('should associate the :user-id key with an array of arrays', function() {
        ZermeloService.addAnyFilter(USER, query, mockId1);
        expect(Array.isArray(query[0][":query"][":user-id"])).toBe(true);
        expect(Array.isArray(query[0][":query"][":user-id"][0])).toBe(true);
      });

      it('should add a (some ...) expression associated with the ":user-id" key', function() {
        ZermeloService.addAnyFilter(USER, query, mockId1);
        expect(query[0][":query"][":user-id"][0][0]).toEqual("some");
      });

      it('should add an EDN set to the (some ...) expression if not already there', function() {
        ZermeloService.addAnyFilter(USER, query, mockId1);
        expect(Array.isArray(query[0][":query"][":user-id"][0][1])).toBe(true);
        expect(query[0][":query"][":user-id"][0][1]).toContain(mockId1);
      });

      it('should add user id to existing set if already there', function() {
        ZermeloService.addAnyFilter(USER, query, mockId1);
        ZermeloService.addAnyFilter(USER, query, mockId2);
        expect(query[0][":query"][":user-id"][0][1]).toContain(mockId1);
        expect(query[0][":query"][":user-id"][0][1]).toContain(mockId2);
      });

    });

    describe('Removing a user', function() {

      it('should no longer contain the user-id of the removed user in the query', function() {
        ZermeloService.addAnyFilter(USER, query, mockId1);
        ZermeloService.addAnyFilter(USER, query, mockId2);
        expect(query[0][":query"][":user-id"][0][1]).toContain(mockId1);
        expect(query[0][":query"][":user-id"][0][1]).toContain(mockId2);

        ZermeloService.removeAnyFilter(USER, query, mockId1);
        expect(query[0][":query"][":user-id"][0][1]).not.toContain(mockId1);
        expect(query[0][":query"][":user-id"][0][1]).toContain(mockId2);
      });

      it('should remove the :user-id key if there are no user ids', function() {
        ZermeloService.addAnyFilter(USER, query, mockId1);
        expect(query[0][":query"][":user-id"]).toBeDefined();
        ZermeloService.removeAnyFilter(USER, query, mockId1);
        expect(query[0][":query"][":user-id"]).toBeUndefined();
      });

      it('should NOT remove the :user-id key if there are still user ids', function() {
        ZermeloService.addAnyFilter(USER, query, mockId1);
        ZermeloService.addAnyFilter(USER, query, mockId2);
        ZermeloService.removeAnyFilter(USER, query, mockId1);
        expect(query[0][":query"][":user-id"]).toBeDefined();
      });

    });

  });

  describe('Group filters', function() {

    // TODO: Add tests that involve both Any and All groups
    // TODO: Add tests for adding/removing groups when users/skills present

    describe('Adding a group to the set of "Any" queries', function() {

      it('should add the :groups key if not already there', function() {
        expect(query[0][":query"][":groups"]).toBeUndefined();
        ZermeloService.addAnyFilter(GROUPS, query, mockId1);
        expect(query[0][":query"][":groups"]).toBeDefined();
      });

      it('should associate the :groups key with an array of arrays', function() {
        ZermeloService.addAnyFilter(GROUPS, query, mockId1);
        expect(Array.isArray(query[0][":query"][":groups"])).toBe(true);
        expect(Array.isArray(query[0][":query"][":groups"][0])).toBe(true);
      });

      it('should add a (some ...) expression to the groups array', function() {
        ZermeloService.addAnyFilter(GROUPS, query, mockId1);
        expect(query[0][":query"][":groups"][0][0]).toEqual("some");
      });

      it('should add an EDN set to the (some ...) expression if not already there', function() {
        ZermeloService.addAnyFilter(GROUPS, query, mockId1);
        expect(Array.isArray(query[0][":query"][":groups"][0][1])).toBe(true);
        expect(query[0][":query"][":groups"][0][1]).toContain(mockId1);
      });

      it('should add group id to existing set if already there', function() {
        ZermeloService.addAnyFilter(GROUPS, query, mockId1);
        ZermeloService.addAnyFilter(GROUPS, query, mockId2);
        expect(query[0][":query"][":groups"][0][1]).toContain(mockId1);
        expect(query[0][":query"][":groups"][0][1]).toContain(mockId2);
      });

    });

    describe('Adding a group to the set of "All" queries', function() {

      it('should add the :groups key if not already there', function() {
        expect(query[0][":query"][":groups"]).toBeUndefined();
        ZermeloService.addAllFilter(GROUPS, query, mockId1);
        expect(query[0][":query"][":groups"]).toBeDefined();
      });

      it('should associate the :groups key with an array of arrays', function() {
        ZermeloService.addAllFilter(GROUPS, query, mockId1);
        expect(Array.isArray(query[0][":query"][":groups"])).toBe(true);
        expect(Array.isArray(query[0][":query"][":groups"][0])).toBe(true);
      });

      it('should add an (every ...) expression to the groups array', function() {
        ZermeloService.addAllFilter(GROUPS, query, mockId1);
        expect(query[0][":query"][":groups"][0][0]).toEqual("every");
      });

      it('should add an EDN set to the (every ...) expression if not already there', function() {
        ZermeloService.addAllFilter(GROUPS, query, mockId1);
        expect(Array.isArray(query[0][":query"][":groups"][0][1])).toBe(true);
        expect(query[0][":query"][":groups"][0][1]).toContain(mockId1);
      });

      it('should add group id to existing set if already there', function() {
        ZermeloService.addAllFilter(GROUPS, query, mockId1);
        ZermeloService.addAllFilter(GROUPS, query, mockId2);
        expect(query[0][":query"][":groups"][0][1]).toContain(mockId1);
        expect(query[0][":query"][":groups"][0][1]).toContain(mockId2);
      });

    });

    describe('Removing a group from the set of "Any" queries', function() {

      it('should no longer contain the group-id of the removed group in the query', function() {
        ZermeloService.addAnyFilter(GROUPS, query, mockId1);
        ZermeloService.addAnyFilter(GROUPS, query, mockId2);
        expect(query[0][":query"][":groups"][0][1]).toContain(mockId1);
        expect(query[0][":query"][":groups"][0][1]).toContain(mockId2);

        ZermeloService.removeAnyFilter(GROUPS, query, mockId1);
        expect(query[0][":query"][":groups"][0][1]).not.toContain(mockId1);
        expect(query[0][":query"][":groups"][0][1]).toContain(mockId2);
      });

      it('should remove the :groups key if there are no group ids', function() {
        ZermeloService.addAnyFilter(GROUPS, query, mockId1);
        expect(query[0][":query"][":groups"]).toBeDefined();
        ZermeloService.removeAnyFilter(GROUPS, query, mockId1);
        expect(query[0][":query"][":groups"]).toBeUndefined();
      });

      it('should NOT remove the :groups key if there are more group ids', function() {
        ZermeloService.addAnyFilter(GROUPS, query, mockId1);
        ZermeloService.addAnyFilter(GROUPS, query, mockId2);
        ZermeloService.removeAnyFilter(GROUPS, query, mockId1);
        expect(query[0][":query"][":groups"]).toBeDefined();

        ZermeloService.addAllFilter(GROUPS, query, mockId1);
        ZermeloService.removeAnyFilter(GROUPS, query, mockId2);
        expect(query[0][":query"][":groups"]).toBeDefined();
      });

    });

    describe('Removing a group from the set of "All" queries', function() {

      it('should no longer contain the group-id of the removed group in the query', function() {
        ZermeloService.addAllFilter(GROUPS, query, mockId1);
        ZermeloService.addAllFilter(GROUPS, query, mockId2);
        expect(query[0][":query"][":groups"][0][1]).toContain(mockId1);
        expect(query[0][":query"][":groups"][0][1]).toContain(mockId2);

        ZermeloService.removeAllFilter(GROUPS, query, mockId1);
        expect(query[0][":query"][":groups"][0][1]).not.toContain(mockId1);
        expect(query[0][":query"][":groups"][0][1]).toContain(mockId2);
      });

      it('should remove the :groups key if there are no group ids', function() {
        ZermeloService.addAllFilter(GROUPS, query, mockId1);
        expect(query[0][":query"][":groups"]).toBeDefined();
        ZermeloService.removeAllFilter(GROUPS, query, mockId1);
        expect(query[0][":query"][":groups"]).toBeUndefined();
      });

      it('should NOT remove the :groups key if there are more group ids', function() {
        ZermeloService.addAllFilter(GROUPS, query, mockId1);
        ZermeloService.addAllFilter(GROUPS, query, mockId2);
        ZermeloService.removeAllFilter(GROUPS, query, mockId1);
        expect(query[0][":query"][":groups"]).toBeDefined();

        ZermeloService.addAnyFilter(GROUPS, query, mockId1);
        ZermeloService.removeAllFilter(GROUPS, query, mockId2);
        expect(query[0][":query"][":groups"]).toBeDefined();
      });

    });

  });

  describe('Skill filters', function() {

    // TODO Add tests that involve both Any and All skills
    // TODO: Add tests for adding/removing groups when groups/users present

    describe('Adding a skill to the set of "Any" queries', function() {

      it('should add the :skills key if not already there', function() {
        expect(query[0][":query"][":skills"]).toBeUndefined();
        ZermeloService.addAnyFilter(SKILLS, query, mockId1, condition1);
        expect(query[0][":query"][":skills"]).toBeDefined();
      });

      it('should associate the :skills key with an array of arrays', function() {
        ZermeloService.addAnyFilter(SKILLS, query, mockId1, condition1);
        expect(Array.isArray(query[0][":query"][":skills"])).toBe(true);
        expect(Array.isArray(query[0][":query"][":skills"][0])).toBe(true);
      });

      it('should add a (some ...) expression to the skills array', function() {
        ZermeloService.addAnyFilter(SKILLS, query, mockId1, condition1);
        expect(query[0][":query"][":skills"][0][0]).toEqual("some");
      });

      it('should add skill/comparator to a new attribute map in the (some ...) expression if not already there', function() {
        ZermeloService.addAnyFilter(SKILLS, query, mockId1, condition1);
        expect(query[0][":query"][":skills"][0][1][mockId1]).toEqual(condition1);
      });

      it('should add new skills/comparators to existing attribute map if it already exists', function() {
        ZermeloService.addAnyFilter(SKILLS, query, mockId1, condition1);
        ZermeloService.addAnyFilter(SKILLS, query, mockId2, condition2);
        expect(query[0][":query"][":skills"][0][1][mockId2]).toEqual(condition2);
      });

    });

    describe('Adding a skill to the set of "All" queries', function() {

      it('should add the :skills key if not already there', function() {
        expect(query[0][":query"][":skills"]).toBeUndefined();
        ZermeloService.addAllFilter(SKILLS, query, mockId1, condition1);
        expect(query[0][":query"][":skills"]).toBeDefined();
      });

      it('should associate the :skills key with an array of arrays', function() {
        ZermeloService.addAllFilter(SKILLS, query, mockId1, condition1);
        expect(Array.isArray(query[0][":query"][":skills"])).toBe(true);
        expect(Array.isArray(query[0][":query"][":skills"][0])).toBe(true);
      });

      it('should add an (every ...) expression to the skills array', function() {
        ZermeloService.addAllFilter(SKILLS, query, mockId1, condition1);
        expect(query[0][":query"][":skills"][0][0]).toEqual("every");
      });

      it('should add skill/comparator to a new attribute map in the (some ...) expression if not already there', function() {
        ZermeloService.addAllFilter(SKILLS, query, mockId1, condition1);
        expect(query[0][":query"][":skills"][0][1][mockId1]).toEqual(condition1);
      });

      it('should add new skills/comparators to existing attribute map if it already exists', function() {
        ZermeloService.addAllFilter(SKILLS, query, mockId1, condition1);
        ZermeloService.addAllFilter(SKILLS, query, mockId2, condition2);
        expect(query[0][":query"][":skills"][0][1][mockId2]).toEqual(condition2);
      });

    });

    describe('Removing a skill from the set of "Any" queries', function() {

      it('should no longer contain the skill-id of the removed skill in the query', function() {
        ZermeloService.addAnyFilter(SKILLS, query, mockId1, condition1);
        ZermeloService.addAnyFilter(SKILLS, query, mockId2, condition2);
        expect(Object.keys(query[0][":query"][":skills"][0][1])).toContain(mockId1);
        expect(Object.keys(query[0][":query"][":skills"][0][1])).toContain(mockId2);
        ZermeloService.removeAnyFilter(SKILLS, query, mockId1);
        expect(Object.keys(query[0][":query"][":skills"][0][1])).not.toContain(mockId1);
        expect(Object.keys(query[0][":query"][":skills"][0][1])).toContain(mockId2);
      });

      it('should remove the :skills key if there are no skill ids', function() {
        ZermeloService.addAnyFilter(SKILLS, query, mockId1, condition1);
        expect(query[0][":query"][":skills"]).toBeDefined();
        ZermeloService.removeAnyFilter(SKILLS, query, mockId1);
        expect(query[0][":query"][":skills"]).toBeUndefined();
      });

      it('should NOT remove the :skills key if there are more skill ids', function() {
        ZermeloService.addAnyFilter(SKILLS, query, mockId1, condition1);
        ZermeloService.addAnyFilter(SKILLS, query, mockId2, condition2);
        ZermeloService.removeAnyFilter(SKILLS, query, mockId1);
        expect(query[0][":query"][":skills"]).toBeDefined();

        ZermeloService.addAllFilter(SKILLS, query, mockId1, condition1);
        ZermeloService.removeAnyFilter(SKILLS, query, mockId2);
        expect(query[0][":query"][":skills"]).toBeDefined();
      });

    });

    describe('Removing a skill from the set of "All" queries', function() {

      it('should no longer contain the skill-id of the removed skill in the query', function() {
        ZermeloService.addAllFilter(SKILLS, query, mockId1, condition1);
        ZermeloService.addAllFilter(SKILLS, query, mockId2, condition2);
        expect(Object.keys(query[0][":query"][":skills"][0][1])).toContain(mockId1);
        expect(Object.keys(query[0][":query"][":skills"][0][1])).toContain(mockId2);

        ZermeloService.removeAllFilter(SKILLS, query, mockId1);
        expect(Object.keys(query[0][":query"][":skills"][0][1])).not.toContain(mockId1);
        expect(Object.keys(query[0][":query"][":skills"][0][1])).toContain(mockId2);
      });

      it('should remove the :skills key if there are no skill ids', function() {
        ZermeloService.addAllFilter(SKILLS, query, mockId1, condition1);
        expect(query[0][":query"][":skills"]).toBeDefined();
        ZermeloService.removeAllFilter(SKILLS, query, mockId1);
        expect(query[0][":query"][":skills"]).toBeUndefined();
      });

      it('should NOT remove the :skills key if there are more skill ids', function() {
        ZermeloService.addAllFilter(SKILLS, query, mockId1, condition1);
        ZermeloService.addAllFilter(SKILLS, query, mockId2, condition2);
        ZermeloService.removeAllFilter(SKILLS, query, mockId1);
        expect(query[0][":query"][":skills"]).toBeDefined();

        ZermeloService.addAnyFilter(SKILLS, query, mockId1, condition1);
        ZermeloService.removeAllFilter(SKILLS, query, mockId2);
        expect(query[0][":query"][":skills"]).toBeDefined();
      });

    });

  });

  describe('Query levels', function() {

    describe('Adding a query level', function() {

      it('should add a backoff rule to the end of the existing list of rules', function() {

      });

    });

    describe('Removing a query level', function() {

      it('should remove a backoff rule from the list of rules', function() {

      });

    });

  });

});
