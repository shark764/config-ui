'use strict';

describe('Zermelo Query Service', function() {
  var $scope;
  var jsedn;
  var query;
  var queryKey;
  var usersKey;
  var skillsKey;
  var groupsKey;
  var asiqKey;
  var someKey;
  var allKey;
  var greaterKey;
  var greaterEqualKey;
  var ZermeloService;
  var mockId1 = '00000-00000';
  var mockId2 = '00000-00001';
  var condition1 = ['>', 5];
  var condition2 = ['>=', 3];

  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));

  beforeEach(inject(['$rootScope', 'jsedn', 'ZermeloService', function($rootScope, _jsedn, _ZermeloService) {
    $scope = $rootScope.$new();
    ZermeloService = _ZermeloService;
    jsedn = _jsedn;
    query = undefined;

    queryKey = ZermeloService.keywordEnum.QUERY;
    usersKey = ZermeloService.keywordEnum.USERS;
    skillsKey = ZermeloService.keywordEnum.SKILLS;
    groupsKey = ZermeloService.keywordEnum.GROUPS;
    asiqKey = ZermeloService.keywordEnum.ASIQ;
    someKey = ZermeloService.keywordEnum.some;
    allKey = ZermeloService.keywordEnum.all;
    greaterKey = ZermeloService.keywordEnum['>'];
    greaterEqualKey = ZermeloService.keywordEnum['>='];
  }]));

  describe('User filters', function() {

    describe('adding a user', function() {

      it('should add the :user-id key if not already there', function() {
        query = ZermeloService.addFilter(0, 'USERS', 'some', mockId1);
        expect(query.at(0).at(queryKey).exists(usersKey)).toEqual(true);
      });

      it('should associate the :user-id key with a Vector', function() {
        query = ZermeloService.addFilter(0, 'USERS', 'some', mockId1);
        expect(query.at(0).at(queryKey).at(usersKey) instanceof jsedn.Vector).toEqual(true);
      });

      it('should add a (some ...) expression associated with the ":user-id" key', function() {
        query = ZermeloService.addFilter(0, 'USERS', 'some', mockId1);
        var expression = query.at(0).at(queryKey).at(usersKey).at(0);
        expect(expression instanceof jsedn.List).toEqual(true);
        expect(expression.at(0) instanceof jsedn.Symbol).toEqual(true);
        expect(expression.at(0).val).toEqual('some');
      });

      it('should add an EDN set to the (some ...) expression if not already there', function() {
        query = ZermeloService.addFilter(0, 'USERS', 'some', mockId1);
        var set = query.at(0).at(queryKey).at(usersKey).at(0).at(1);
        expect(set instanceof jsedn.Set).toEqual(true);
        expect(set.val).toContain(jasmine.objectContaining({_obj: mockId1}));
      });

      it('should add user id to existing set if already there', function() {
        ZermeloService.addFilter(0, 'USERS', 'some', mockId1);

        query = ZermeloService.addFilter(0, 'USERS', 'some', mockId2);
        expect(query.at(0).at(queryKey).at(usersKey).at(0).at(1).val).toContain(jasmine.objectContaining({_obj: mockId1}));
        expect(query.at(0).at(queryKey).at(usersKey).at(0).at(1).val).toContain(jasmine.objectContaining({_obj: mockId2}));
      });

      it('should not effect groups or skills already in the query', function() {
        ZermeloService.addFilter(0, 'SKILLS', 'some', mockId1, condition1);
        query = ZermeloService.addFilter(0, 'GROUPS', 'some', mockId2);
        var skillsBeforeAdd = query.at(0).at(queryKey).at(skillsKey);
        var groupsBeforeAdd = query.at(0).at(queryKey).at(groupsKey);

        query = ZermeloService.addFilter(0, 'USERS', 'some', mockId1);
        expect(query.at(0).at(queryKey).at(skillsKey)).toEqual(skillsBeforeAdd);
        expect(query.at(0).at(queryKey).at(groupsKey)).toEqual(groupsBeforeAdd);
      });

    });

    describe('removing a user', function() {

      it('should no longer contain the user-id of the removed user in the query', function() {
        ZermeloService.addFilter(0, 'USERS', 'some', mockId1);
        ZermeloService.addFilter(0, 'USERS', 'some', mockId2);

        query = ZermeloService.removeFilter(0, 'USERS', 'some', mockId1);
        expect(query.at(0).at(queryKey).at(usersKey).at(0).at(1).val).not.toContain(jasmine.objectContaining({_obj: mockId1}));
        expect(query.at(0).at(queryKey).at(usersKey).at(0).at(1).val).toContain(jasmine.objectContaining({_obj: mockId2}));
      });

      it('should remove the :user-id key if there are no user ids', function() {
        ZermeloService.addFilter(0, 'USERS', 'some', mockId1);

        query = ZermeloService.removeFilter(0, 'USERS', 'some', mockId1);
        expect(query.at(0).at(queryKey).exists(usersKey)).toEqual(false);
      });

      it('should NOT remove the :user-id key if there are still user ids', function() {
        ZermeloService.addFilter(0, 'USERS', 'some', mockId1);
        ZermeloService.addFilter(0, 'USERS', 'some', mockId2);

        query = ZermeloService.removeFilter(0, 'USERS', 'some', mockId1);
        expect(query.at(0).at(queryKey).exists(usersKey)).toEqual(true);
      });

      it('should not effect groups or skills already in the query', function() {
        ZermeloService.addFilter(0, 'SKILLS', 'some', mockId1, condition1);
        query = ZermeloService.addFilter(0, 'GROUPS', 'some', mockId2);
        var skillsBeforeRemove = query.at(0).at(queryKey).at(skillsKey);
        var groupsBeforeRemove = query.at(0).at(queryKey).at(groupsKey);

        ZermeloService.addFilter(0, 'USERS', 'some', mockId1);
        query = ZermeloService.removeFilter(0, 'USERS', 'some', mockId1);
        expect(query.at(0).at(queryKey).at(skillsKey)).toEqual(skillsBeforeRemove);
        expect(query.at(0).at(queryKey).at(groupsKey)).toEqual(groupsBeforeRemove);
      });

    });

  });

  describe('Group filters', function() {

    describe('adding a group to the set of "Any" queries', function() {

      it('should add the :groups key if not already there', function() {
        query = ZermeloService.addFilter(0, 'GROUPS', 'some', mockId1);
        expect(query.at(0).at(queryKey).exists(groupsKey)).toEqual(true);
      });

      it('should associate the :groups key with a Vector', function() {
        query = ZermeloService.addFilter(0, 'GROUPS', 'some', mockId1);
        expect(query.at(0).at(queryKey).at(groupsKey) instanceof jsedn.Vector).toEqual(true);
      });

      it('should add a (some ...) expression associated with the ":groups" key', function() {
        query = ZermeloService.addFilter(0, 'GROUPS', 'some', mockId1);
        var expression = query.at(0).at(queryKey).at(groupsKey).at(0);
        expect(expression instanceof jsedn.List).toEqual(true);
        expect(expression.at(0) instanceof jsedn.Symbol).toEqual(true);
        expect(expression.at(0).val).toEqual('some');
      });

      it('should add an EDN set to the (some ...) expression if not already there', function() {
        query = ZermeloService.addFilter(0, 'GROUPS', 'some', mockId1);
        var set = query.at(0).at(queryKey).at(groupsKey).at(0).at(1);
        expect(set instanceof jsedn.Set).toEqual(true);
        expect(set.val).toContain(jasmine.objectContaining({_obj: mockId1}));
      });

      it('should add group id to existing set if already there', function() {
        ZermeloService.addFilter(0, 'GROUPS', 'some', mockId1);

        query = ZermeloService.addFilter(0, 'GROUPS', 'some', mockId2);
        expect(query.at(0).at(queryKey).at(groupsKey).at(0).at(1).val).toContain(jasmine.objectContaining({_obj: mockId1}));
        expect(query.at(0).at(queryKey).at(groupsKey).at(0).at(1).val).toContain(jasmine.objectContaining({_obj: mockId2}));
      });

      it('should not effect users or skills already in the query', function() {
        ZermeloService.addFilter(0, 'SKILLS', 'some', mockId1, condition1);
        query = ZermeloService.addFilter(0, 'USERS', 'some', mockId2);
        var skillsBeforeAdd = query.at(0).at(queryKey).at(skillsKey);
        var usersBeforeAdd = query.at(0).at(queryKey).at(usersKey);

        query = ZermeloService.addFilter(0, 'GROUPS', 'some', mockId1);
        expect(query.at(0).at(queryKey).at(skillsKey)).toEqual(skillsBeforeAdd);
        expect(query.at(0).at(queryKey).at(usersKey)).toEqual(usersBeforeAdd);
      });

      it('should not effect existing "All" filters', function() {
        ZermeloService.addFilter(0, 'GROUPS', 'all', mockId1);

        query = ZermeloService.addFilter(0, 'GROUPS', 'some', mockId2);
        expect(query.at(0).at(queryKey).at(groupsKey).exists(allKey)).toEqual(true);
        expect(query.at(0).at(queryKey).at(groupsKey).at(0).at(1).val).toContain(jasmine.objectContaining({_obj: mockId1}));
        expect(query.at(0).at(queryKey).at(groupsKey).at(0).at(1).val).not.toContain(jasmine.objectContaining({_obj: mockId2}));
        expect(query.at(0).at(queryKey).at(groupsKey).exists(someKey)).toEqual(true);
        expect(query.at(0).at(queryKey).at(groupsKey).at(1).at(1).val).toContain(jasmine.objectContaining({_obj: mockId2}));
        expect(query.at(0).at(queryKey).at(groupsKey).at(1).at(1).val).not.toContain(jasmine.objectContaining({_obj: mockId1}));
      });

    });

    describe('adding a group to the set of "All" queries', function() {

      it('should add the :groups key if not already there', function() {
        query = ZermeloService.addFilter(0, 'GROUPS', 'all', mockId1);
        expect(query.at(0).at(queryKey).exists(groupsKey)).toEqual(true);
      });

      it('should associate the :groups key with a Vector', function() {
        query = ZermeloService.addFilter(0, 'GROUPS', 'all', mockId1);
        expect(query.at(0).at(queryKey).at(groupsKey) instanceof jsedn.Vector).toEqual(true);
      });

      it('should add an (all ...) expression associated with the ":groups" key', function() {
        query = ZermeloService.addFilter(0, 'GROUPS', 'all', mockId1);
        var expression = query.at(0).at(queryKey).at(groupsKey).at(0);
        expect(expression instanceof jsedn.List).toEqual(true);
        expect(expression.at(0) instanceof jsedn.Symbol).toEqual(true);
        expect(expression.at(0).val).toEqual('every');
      });

      it('should add an EDN set to the (all ...) expression if not already there', function() {
        query = ZermeloService.addFilter(0, 'GROUPS', 'all', mockId1);
        var set = query.at(0).at(queryKey).at(groupsKey).at(0).at(1);
        expect(set instanceof jsedn.Set).toEqual(true);
        expect(set.val).toContain(jasmine.objectContaining({_obj: mockId1}));
      });

      it('should add group id to existing set if already there', function() {
        query = ZermeloService.addFilter(0, 'GROUPS', 'all', mockId1);
        query = ZermeloService.addFilter(0, 'GROUPS', 'all', mockId2);
        expect(query.at(0).at(queryKey).at(groupsKey).at(0).at(1).val).toContain(jasmine.objectContaining({_obj: mockId1}));
        expect(query.at(0).at(queryKey).at(groupsKey).at(0).at(1).val).toContain(jasmine.objectContaining({_obj: mockId2}));
      });

      it('should not effect users or skills already in the query', function() {
        ZermeloService.addFilter(0, 'SKILLS', 'all', mockId1, condition1);
        query = ZermeloService.addFilter(0, 'USERS', 'some', mockId2);
        var skillsBeforeAdd = query.at(0).at(queryKey).at(skillsKey);
        var usersBeforeAdd = query.at(0).at(queryKey).at(usersKey);

        query = ZermeloService.addFilter(0, 'GROUPS', 'all', mockId1);
        expect(query.at(0).at(queryKey).at(skillsKey)).toEqual(skillsBeforeAdd);
        expect(query.at(0).at(queryKey).at(usersKey)).toEqual(usersBeforeAdd);
      });

      it('should not effect existing "All" filters', function() {
        ZermeloService.addFilter(0, 'GROUPS', 'some', mockId1);

        query = ZermeloService.addFilter(0, 'GROUPS', 'all', mockId2);
        expect(query.at(0).at(queryKey).at(groupsKey).exists(someKey)).toEqual(true);
        expect(query.at(0).at(queryKey).at(groupsKey).at(0).at(1).val).toContain(jasmine.objectContaining({_obj: mockId1}));
        expect(query.at(0).at(queryKey).at(groupsKey).at(0).at(1).val).not.toContain(jasmine.objectContaining({_obj: mockId2}));
        expect(query.at(0).at(queryKey).at(groupsKey).exists(allKey)).toEqual(true);
        expect(query.at(0).at(queryKey).at(groupsKey).at(1).at(1).val).toContain(jasmine.objectContaining({_obj: mockId2}));
        expect(query.at(0).at(queryKey).at(groupsKey).at(1).at(1).val).not.toContain(jasmine.objectContaining({_obj: mockId1}));
      });

    });

    describe('removing a group from the set of "Any" queries', function() {

      it('should no longer contain the group-id of the removed group in the query', function() {
        ZermeloService.addFilter(0, 'GROUPS', 'some', mockId1);
        ZermeloService.addFilter(0, 'GROUPS', 'some', mockId2);

        query = ZermeloService.removeFilter(0, 'GROUPS', 'some', mockId1);
        expect(query.at(0).at(queryKey).at(groupsKey).at(0).at(1).val).not.toContain(jasmine.objectContaining({_obj: mockId1}));
        expect(query.at(0).at(queryKey).at(groupsKey).at(0).at(1).val).toContain(jasmine.objectContaining({_obj: mockId2}));
      });

      it('should remove the :groups key if there are no group ids', function() {
        ZermeloService.addFilter(0, 'GROUPS', 'some', mockId1);

        query = ZermeloService.removeFilter(0, 'GROUPS', 'some', mockId1);
        expect(query.at(0).at(queryKey).exists(groupsKey)).toEqual(false);
      });

      it('should NOT remove the :groups key if there are more group ids', function() {
        ZermeloService.addFilter(0, 'GROUPS', 'some', mockId1);
        ZermeloService.addFilter(0, 'GROUPS', 'some', mockId2);

        query = ZermeloService.removeFilter(0, 'GROUPS', 'some', mockId1);
        expect(query.at(0).at(queryKey).exists(groupsKey)).toEqual(true);
      });

      it('should not effect users or skills already in the query', function() {
        ZermeloService.addFilter(0, 'SKILLS', 'some', mockId1, condition1);
        query = ZermeloService.addFilter(0, 'USERS', 'some', mockId2);
        var skillsBeforeRemove = query.at(0).at(queryKey).at(skillsKey);
        var usersBeforeRemove = query.at(0).at(queryKey).at(usersKey);

        ZermeloService.addFilter(0, 'GROUPS', 'some', mockId1);
        query = ZermeloService.removeFilter(0, 'GROUPS', 'some', mockId1);
        expect(query.at(0).at(queryKey).at(skillsKey)).toEqual(skillsBeforeRemove);
        expect(query.at(0).at(queryKey).at(usersKey)).toEqual(usersBeforeRemove);
      });

      it('should not effect the set of "All" queries', function() {
        query = ZermeloService.addFilter(0, 'GROUPS', 'all', mockId1);
        var groupsBeforeRemove = query.at(0).at(queryKey).at(groupsKey);

        ZermeloService.addFilter(0, 'GROUPS', 'some', mockId2);
        query = ZermeloService.removeFilter(0, 'GROUPS', 'some', mockId2);
        expect(query.at(0).at(queryKey).at(groupsKey)).toEqual(groupsBeforeRemove);
      });

    });

    describe('removing a group from the set of "All" queries', function() {

      it('should no longer contain the group-id of the removed group in the query', function() {
        ZermeloService.addFilter(0, 'GROUPS', 'all', mockId1);
        ZermeloService.addFilter(0, 'GROUPS', 'all', mockId2);

        query = ZermeloService.removeFilter(0, 'GROUPS', 'all', mockId1);
        expect(query.at(0).at(queryKey).at(groupsKey).at(0).at(1).val).not.toContain(jasmine.objectContaining({_obj: mockId1}));
        expect(query.at(0).at(queryKey).at(groupsKey).at(0).at(1).val).toContain(jasmine.objectContaining({_obj: mockId2}));
      });

      it('should remove the :groups key if there are no group ids', function() {
        ZermeloService.addFilter(0, 'GROUPS', 'all', mockId1);

        query = ZermeloService.removeFilter(0, 'GROUPS', 'all', mockId1);
        expect(query.at(0).at(queryKey).exists(groupsKey)).toEqual(false);
      });

      it('should NOT remove the :groups key if there are more group ids', function() {
        ZermeloService.addFilter(0, 'GROUPS', 'all', mockId1);
        ZermeloService.addFilter(0, 'GROUPS', 'all', mockId2);

        query = ZermeloService.removeFilter(0, 'GROUPS', 'all', mockId1);
        expect(query.at(0).at(queryKey).exists(groupsKey)).toEqual(true);
      });

      it('should not effect users or skills already in the query', function() {
        ZermeloService.addFilter(0, 'SKILLS', 'all', mockId1, condition1);
        query = ZermeloService.addFilter(0, 'USERS', 'all', mockId2);
        var skillsBeforeRemove = query.at(0).at(queryKey).at(skillsKey);
        var usersBeforeRemove = query.at(0).at(queryKey).at(usersKey);

        ZermeloService.addFilter(0, 'GROUPS', 'all', mockId1);
        query = ZermeloService.removeFilter(0, 'GROUPS', 'all', mockId1);
        expect(query.at(0).at(queryKey).at(skillsKey)).toEqual(skillsBeforeRemove);
        expect(query.at(0).at(queryKey).at(usersKey)).toEqual(usersBeforeRemove);
      });

      it('should not effect the set of "Any" queries', function() {
        query = ZermeloService.addFilter(0, 'GROUPS', 'some', mockId1);
        var groupsBeforeRemove = query.at(0).at(queryKey).at(groupsKey);

        ZermeloService.addFilter(0, 'GROUPS', 'all', mockId2);
        query = ZermeloService.removeFilter(0, 'GROUPS', 'all', mockId2);
        expect(query.at(0).at(queryKey).at(groupsKey)).toEqual(groupsBeforeRemove);
      });

    });

  });

  describe('Skill filters', function() {

    describe('adding a skill to the set of "Any" queries', function() {

      it('should add the :skills key if not already there', function() {
        query = ZermeloService.addFilter(0, 'SKILLS', 'some', mockId1, condition1);
        expect(query.at(0).at(queryKey).exists(skillsKey)).toEqual(true);
      });

      it('should associate the :skills key with a Vector', function() {
        query = ZermeloService.addFilter(0, 'SKILLS', 'some', mockId1, condition1);
        expect(query.at(0).at(queryKey).at(skillsKey) instanceof jsedn.Vector).toEqual(true);
      });

      it('should add a (some ...) expression associated with the ":skills" key', function() {
        query = ZermeloService.addFilter(0, 'SKILLS', 'some', mockId1, condition1);
        var expression = query.at(0).at(queryKey).at(skillsKey).at(0);
        expect(expression instanceof jsedn.List).toEqual(true);
        expect(expression.at(0) instanceof jsedn.Symbol).toEqual(true);
        expect(expression.at(0).val).toEqual('some');
      });

      it('should add an EDN map containing the skill id to the (some ...) expression if not already there', function() {
        query = ZermeloService.addFilter(0, 'SKILLS', 'some', mockId1, condition1);
        var map = query.at(0).at(queryKey).at(skillsKey).at(0).at(1);
        expect(map instanceof jsedn.Map).toEqual(true);
        expect(map.keys).toContain(jasmine.objectContaining({_obj: mockId1}));
      });

      it('should associate the skill id with a list containing a comparator symbol and number', function() {
        query = ZermeloService.addFilter(0, 'SKILLS', 'some', mockId1, condition1);
        var map = query.at(0).at(queryKey).at(skillsKey).at(0).at(1);
        expect(map.keys).toContain(jasmine.objectContaining({_obj: mockId1}));
        expect(map.vals[0] instanceof jsedn.List).toEqual(true);
        expect(map.vals[0].at(0)).toEqual(greaterKey);
        expect(map.vals[0].at(1)).toEqual(condition1[1]);
      });

      it('should add skill to existing EDN map if already there', function() {
        ZermeloService.addFilter(0, 'SKILLS', 'some', mockId1, condition1);
        query = ZermeloService.addFilter(0, 'SKILLS', 'some', mockId2, condition2);
        var map = query.at(0).at(queryKey).at(skillsKey).at(0).at(1);
        expect(map.keys).toContain(jasmine.objectContaining({_obj: mockId1}));
        expect(map.keys).toContain(jasmine.objectContaining({_obj: mockId2}));
        expect(map.vals[0].at(0)).toEqual(greaterKey);
        expect(map.vals[0].at(1)).toEqual(condition1[1]);
        expect(map.vals[1].at(0)).toEqual(greaterEqualKey);
        expect(map.vals[1].at(1)).toEqual(condition2[1]);
      });

      it('should not effect users or groups already in the query', function() {
        ZermeloService.addFilter(0, 'USERS', 'some', mockId1);
        query = ZermeloService.addFilter(0, 'GROUPS', 'some', mockId1);
        var usersBeforeAdd = query.at(0).at(queryKey).at(usersKey);
        var groupsBeforeAdd = query.at(0).at(queryKey).at(groupsKey);

        query = ZermeloService.addFilter(0, 'SKILLS', 'some', mockId1, condition1);
        expect(query.at(0).at(queryKey).at(groupsKey)).toEqual(groupsBeforeAdd);
        expect(query.at(0).at(queryKey).at(usersKey)).toEqual(usersBeforeAdd);
      });

      it('should not effect existing "All" filters', function() {
        ZermeloService.addFilter(0, 'SKILLS', 'all', mockId1, condition1);

        query = ZermeloService.addFilter(0, 'SKILLS', 'some', mockId2, condition2);
        expect(query.at(0).at(queryKey).at(skillsKey).exists(allKey)).toEqual(true);
        expect(query.at(0).at(queryKey).at(skillsKey).at(0).at(1).keys).toContain(jasmine.objectContaining({_obj: mockId1}));
        expect(query.at(0).at(queryKey).at(skillsKey).at(0).at(1).keys).not.toContain(jasmine.objectContaining({_obj: mockId2}));
        expect(query.at(0).at(queryKey).at(skillsKey).exists(someKey)).toEqual(true);
        expect(query.at(0).at(queryKey).at(skillsKey).at(1).at(1).keys).toContain(jasmine.objectContaining({_obj: mockId2}));
        expect(query.at(0).at(queryKey).at(skillsKey).at(1).at(1).keys).not.toContain(jasmine.objectContaining({_obj: mockId1}));
      });

    });

    describe('adding a skill to the set of "All" queries', function() {

      it('should add the :skills key if not already there', function() {
        query = ZermeloService.addFilter(0, 'SKILLS', 'all', mockId1, condition1);
        expect(query.at(0).at(queryKey).exists(skillsKey)).toEqual(true);
      });

      it('should associate the :skills key with a Vector', function() {
        query = ZermeloService.addFilter(0, 'SKILLS', 'all', mockId1, condition1);
        expect(query.at(0).at(queryKey).at(skillsKey) instanceof jsedn.Vector).toEqual(true);
      });

      it('should add an (all ...) expression associated with the ":skills" key', function() {
        query = ZermeloService.addFilter(0, 'SKILLS', 'all', mockId1, condition1);
        var expression = query.at(0).at(queryKey).at(skillsKey).at(0);
        expect(expression instanceof jsedn.List).toEqual(true);
        expect(expression.at(0) instanceof jsedn.Symbol).toEqual(true);
        expect(expression.at(0).val).toEqual('every');
      });

      it('should add an EDN map containing the skill id to the (all ...) expression if not already there', function() {
        query = ZermeloService.addFilter(0, 'SKILLS', 'all', mockId1, condition1);
        var map = query.at(0).at(queryKey).at(skillsKey).at(0).at(1);
        expect(map instanceof jsedn.Map).toEqual(true);
        expect(map.keys).toContain(jasmine.objectContaining({_obj: mockId1}));
      });

      it('should associate the skill id with a list containing a comparator symbol and number', function() {
        query = ZermeloService.addFilter(0, 'SKILLS', 'all', mockId1, condition1);
        var map = query.at(0).at(queryKey).at(skillsKey).at(0).at(1);
        expect(map.keys).toContain(jasmine.objectContaining({_obj: mockId1}));
        expect(map.vals[0] instanceof jsedn.List).toEqual(true);
        expect(map.vals[0].at(0)).toEqual(greaterKey);
        expect(map.vals[0].at(1)).toEqual(condition1[1]);
      });

      it('should add skill to existing EDN map if already there', function() {
        ZermeloService.addFilter(0, 'SKILLS', 'all', mockId1, condition1);
        query = ZermeloService.addFilter(0, 'SKILLS', 'all', mockId2, condition2);
        var map = query.at(0).at(queryKey).at(skillsKey).at(0).at(1);
        expect(map.keys).toContain(jasmine.objectContaining({_obj: mockId1}));
        expect(map.keys).toContain(jasmine.objectContaining({_obj: mockId2}));
        expect(map.vals[0].at(0)).toEqual(greaterKey);
        expect(map.vals[0].at(1)).toEqual(condition1[1]);
        expect(map.vals[1].at(0)).toEqual(greaterEqualKey);
        expect(map.vals[1].at(1)).toEqual(condition2[1]);
      });

      it('should not effect users or groups already in the query', function() {
        ZermeloService.addFilter(0, 'USERS', 'all', mockId1);
        query = ZermeloService.addFilter(0, 'GROUPS', 'all', mockId1);
        var usersBeforeAdd = query.at(0).at(queryKey).at(usersKey);
        var groupsBeforeAdd = query.at(0).at(queryKey).at(groupsKey);

        query = ZermeloService.addFilter(0, 'SKILLS', 'all', mockId1, condition1);
        expect(query.at(0).at(queryKey).at(groupsKey)).toEqual(groupsBeforeAdd);
        expect(query.at(0).at(queryKey).at(usersKey)).toEqual(usersBeforeAdd);
      });

      it('should not effect existing "Any" filters', function() {
        ZermeloService.addFilter(0, 'SKILLS', 'some', mockId1, condition1);

        query = ZermeloService.addFilter(0, 'SKILLS', 'all', mockId2, condition2);
        expect(query.at(0).at(queryKey).at(skillsKey).exists(someKey)).toEqual(true);
        expect(query.at(0).at(queryKey).at(skillsKey).at(0).at(1).keys).toContain(jasmine.objectContaining({_obj: mockId1}));
        expect(query.at(0).at(queryKey).at(skillsKey).at(0).at(1).keys).not.toContain(jasmine.objectContaining({_obj: mockId2}));
        expect(query.at(0).at(queryKey).at(skillsKey).exists(allKey)).toEqual(true);
        expect(query.at(0).at(queryKey).at(skillsKey).at(1).at(1).keys).toContain(jasmine.objectContaining({_obj: mockId2}));
        expect(query.at(0).at(queryKey).at(skillsKey).at(1).at(1).keys).not.toContain(jasmine.objectContaining({_obj: mockId1}));
      });

    });

    describe('removing a skill from the set of "Any" queries', function() {

      it('should no longer contain the skill-id of the removed skill in the query', function() {
        ZermeloService.addFilter(0, 'SKILLS', 'some', mockId1, condition1);
        ZermeloService.addFilter(0, 'SKILLS', 'some', mockId2, condition2);

        query = ZermeloService.removeFilter(0, 'SKILLS', 'some', mockId1);
        expect(query.at(0).at(queryKey).at(skillsKey).at(0).at(1).keys).not.toContain(jasmine.objectContaining({_obj: mockId1}));
        expect(query.at(0).at(queryKey).at(skillsKey).at(0).at(1).keys).toContain(jasmine.objectContaining({_obj: mockId2}));
      });

      it('should remove the :skills key if there are no skill ids', function() {
        ZermeloService.addFilter(0, 'SKILLS', 'some', mockId1, condition1);

        query = ZermeloService.removeFilter(0, 'SKILLS', 'some', mockId1);
        expect(query.at(0).at(queryKey).exists(skillsKey)).toEqual(false);
      });

      it('should NOT remove the :skills key if there are more skill ids', function() {
        ZermeloService.addFilter(0, 'SKILLS', 'some', mockId1, condition1);
        ZermeloService.addFilter(0, 'SKILLS', 'some', mockId2, condition2);

        query = ZermeloService.removeFilter(0, 'SKILLS', 'some', mockId1);
        expect(query.at(0).at(queryKey).exists(skillsKey)).toEqual(true);
      });

      it('should not effect users or groups already in the query', function() {
        ZermeloService.addFilter(0, 'GROUPS', 'some', mockId1);
        query = ZermeloService.addFilter(0, 'USERS', 'some', mockId2);
        var groupsBeforeRemove = query.at(0).at(queryKey).at(groupsKey);
        var usersBeforeRemove = query.at(0).at(queryKey).at(usersKey);

        ZermeloService.addFilter(0, 'SKILLS', 'some', mockId1, condition1);
        query = ZermeloService.removeFilter(0, 'SKILLS', 'some', mockId1);
        expect(query.at(0).at(queryKey).at(groupsKey)).toEqual(groupsBeforeRemove);
        expect(query.at(0).at(queryKey).at(usersKey)).toEqual(usersBeforeRemove);
      });

      it('should not effect the set of "All" queries', function() {
        query = ZermeloService.addFilter(0, 'SKILLS', 'all', mockId1, condition1);
        var skillsBeforeRemove = query.at(0).at(queryKey).at(skillsKey);

        ZermeloService.addFilter(0, 'SKILLS', 'some', mockId2, condition2);
        query = ZermeloService.removeFilter(0, 'SKILLS', 'some', mockId2);
        expect(query.at(0).at(queryKey).at(skillsKey)).toEqual(skillsBeforeRemove);
      });

    });

    describe('removing a skill from the set of "All" queries', function() {

      it('should no longer contain the skill-id of the removed skill in the query', function() {
        ZermeloService.addFilter(0, 'SKILLS', 'all', mockId1, condition1);
        ZermeloService.addFilter(0, 'SKILLS', 'all', mockId2, condition2);

        query = ZermeloService.removeFilter(0, 'SKILLS', 'all', mockId1);
        expect(query.at(0).at(queryKey).at(skillsKey).at(0).at(1).keys).not.toContain(jasmine.objectContaining({_obj: mockId1}));
        expect(query.at(0).at(queryKey).at(skillsKey).at(0).at(1).keys).toContain(jasmine.objectContaining({_obj: mockId2}));
      });

      it('should remove the :skills key if there are no skill ids', function() {
        ZermeloService.addFilter(0, 'SKILLS', 'all', mockId1, condition1);

        query = ZermeloService.removeFilter(0, 'SKILLS', 'all', mockId1);
        expect(query.at(0).at(queryKey).exists(skillsKey)).toEqual(false);
      });

      it('should NOT remove the :skills key if there are more skill ids', function() {
        ZermeloService.addFilter(0, 'SKILLS', 'all', mockId1, condition1);
        ZermeloService.addFilter(0, 'SKILLS', 'all', mockId2, condition2);

        query = ZermeloService.removeFilter(0, 'SKILLS', 'all', mockId1);
        expect(query.at(0).at(queryKey).exists(skillsKey)).toEqual(true);
      });

      it('should not effect users or groups already in the query', function() {
        ZermeloService.addFilter(0, 'GROUPS', 'all', mockId1);
        query = ZermeloService.addFilter(0, 'USERS', 'all', mockId2);
        var groupsBeforeRemove = query.at(0).at(queryKey).at(groupsKey);
        var usersBeforeRemove = query.at(0).at(queryKey).at(usersKey);

        ZermeloService.addFilter(0, 'SKILLS', 'all', mockId1, condition1);
        query = ZermeloService.removeFilter(0, 'SKILLS', 'all', mockId1);
        expect(query.at(0).at(queryKey).at(groupsKey)).toEqual(groupsBeforeRemove);
        expect(query.at(0).at(queryKey).at(usersKey)).toEqual(usersBeforeRemove);
      });

      it('should not effect the set of "Any" queries', function() {
        query = ZermeloService.addFilter(0, 'SKILLS', 'some', mockId1, condition1);
        var skillsBeforeRemove = query.at(0).at(queryKey).at(skillsKey);

        ZermeloService.addFilter(0, 'SKILLS', 'all', mockId2, condition2);
        query = ZermeloService.removeFilter(0, 'SKILLS', 'all', mockId2);
        expect(query.at(0).at(queryKey).at(skillsKey)).toEqual(skillsBeforeRemove);
      });

    });

  });

  describe('Query levels', function() {

    beforeEach(function() {
      query = ZermeloService.addQueryLevel();
    });

    describe('adding a query level', function() {

      it('should add a backoff rule to the end of the existing list of rules', function() {
        expect(query.val.length).toEqual(2);
      });

      it('should create a backoff rule with ":after-seconds-in-queue" set to one more second than the previous level', function() {
        expect(query.at(1).at(asiqKey)).toEqual(query.at(0).at(asiqKey) + 1);
      });

    });

    describe('removing a query level', function() {

      it('should remove a backoff rule from the list of rules', function() {
        ZermeloService.removeQueryLevel(1);
        expect(query.val.length).toEqual(1);
      });

      it('should specifically remove the query level specified', function() {
        ZermeloService.addQueryLevel();
        ZermeloService.addQueryLevel();
        query = ZermeloService.removeQueryLevel(2);
        expect(query.at(2).at(asiqKey)).not.toEqual(2);
      });

    });

    describe('Updating a query level', function() {

      it('should update the correct query level with a new ":after-seconds-in-queue" value', function() {
        ZermeloService.addQueryLevel();
        ZermeloService.updateQueryLevel(1, 10);
        expect(query.at(0).at(asiqKey)).toEqual(0);
        expect(query.at(1).at(asiqKey)).toEqual(10);
        expect(query.at(2).at(asiqKey)).toEqual(2);
      });

      it('should update the correct query level with user, group, and skill changes', function() {
        ZermeloService.addFilter(0, 'USERS', 'some', mockId1);
        ZermeloService.addQueryLevel();
        ZermeloService.addFilter(1, 'GROUPS', 'some', mockId1);
        ZermeloService.addQueryLevel();
        ZermeloService.addFilter(2, 'SKILLS', 'some', mockId1, condition1);

        expect(query.at(0).at(queryKey).exists(usersKey)).toEqual(true);
        expect(query.at(1).at(queryKey).exists(usersKey)).toEqual(false);
        expect(query.at(2).at(queryKey).exists(usersKey)).toEqual(false);
        expect(query.at(0).at(queryKey).exists(groupsKey)).toEqual(false);
        expect(query.at(1).at(queryKey).exists(groupsKey)).toEqual(true);
        expect(query.at(2).at(queryKey).exists(groupsKey)).toEqual(false);
        expect(query.at(0).at(queryKey).exists(skillsKey)).toEqual(false);
        expect(query.at(1).at(queryKey).exists(skillsKey)).toEqual(false);
        expect(query.at(2).at(queryKey).exists(skillsKey)).toEqual(true);
        ZermeloService.removeFilter(1, 'GROUPS', 'some', mockId1);
        expect(query.at(1).at(queryKey).exists(groupsKey)).toEqual(false);
      });

    });

  });

});
