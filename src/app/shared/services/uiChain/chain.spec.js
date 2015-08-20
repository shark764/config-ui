'use strict';

describe('Chain service', function () {
  var Chain,
    $cacheFactory;

  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.mock.content'));

  beforeEach(inject(['Chain', '$cacheFactory',
    function (_Chain, _$cacheFactory) {
      Chain = _Chain;
      $cacheFactory = _$cacheFactory;
    }
  ]));

  describe('ON Chain.get', function () {
    it('should return an empty object on first get', function () {
      Chain.get('user:save');
      var chain = $cacheFactory.get('chains').get('user:save');
      expect(chain).toEqual(jasmine.any(Object));
    });

    it('should cache the items I push to it', function () {
      Chain.get('user:save').hook('link1', function(){});

      var chain = $cacheFactory.get('chains').get('user:save');
      expect(chain.hasOwnProperty('link1')).toBeTruthy();
    });

    it('should not create a new chain once already got', function () {
      Chain.get('user:save').hook('link1', function(){});
      Chain.get('user:save');

      var chain = $cacheFactory.get('chains').get('user:save');
      expect(chain.hasOwnProperty('link1')).toBeTruthy();
    });
  });

  describe('ON Chain.prototype.hook', function () {
    it('should push callback onto the chain', function() {
      var chain = Chain.get('chain1');
      chain.hook('link1', null, 100);

      var chainCache = $cacheFactory.get('chains').get('chain1');

      expect(chainCache.hasOwnProperty('link1')).toBeTruthy();
      expect(chainCache.link1.id).toEqual('link1');
      expect(chainCache.link1.priority).toEqual(100);
    });

    it('should push multiple callback onto the chain', function() {
      var chain = Chain.get('chain1');
      chain.hook('link1', null, 100);
      chain.hook('link2', null, 50);

      var chainCache = $cacheFactory.get('chains').get('chain1');

      expect(chainCache.hasOwnProperty('link1')).toBeTruthy();
      expect(chainCache.link1.id).toEqual('link1');
      expect(chainCache.link1.priority).toEqual(100);

      expect(chainCache.hasOwnProperty('link2')).toBeTruthy();
      expect(chainCache.link2.id).toEqual('link2');
      expect(chainCache.link2.priority).toEqual(50);
    });
  });

  describe('ON Chain.prototype.execute', function () {
    var $q,
      $timeout;

    beforeEach(inject(['$q', '$timeout', function(_$q, _$timeout) {
      $q = _$q;
      $timeout = _$timeout;
    }]));

    it('should execute single callback', function() {
      var spy = jasmine.createSpy('first callback');

      var chain = Chain.get('chain1');
      chain.hook('link1', spy, 100);

      chain.execute();

      expect(spy).toHaveBeenCalled();
    });

    it('should throw error if first callback is not a function', function() {
      var chain = Chain.get('chain1');
      chain.hook('link1', null, 100);

      var error;
      try {
        chain.execute();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
    });

    it('should throw error if any callback is not a function or object', function() {
      var chain = Chain.get('chain1');
      chain.hook('link1', function() {
        return $q.when();
      }, 1);

      chain.hook('link2', null, 2);

      var error;
      try {
        chain.execute();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
    });

    describe('WHEN first link is resolved', function() {
      var promiseCallback;
      beforeEach(function() {
        promiseCallback = function() {
          var deferred = $q.defer();

          $timeout(function() {
            deferred.resolve();
          });

          return deferred.promise;
        };
      });

      it('should execute second link callback', function() {
        var spy = jasmine.createSpy('second callback');

        var chain = Chain.get('chain1');
        chain.hook('link1', promiseCallback, 1);
        chain.hook('link2', spy, 2);

        chain.execute();

        $timeout.flush();

        expect(spy).toHaveBeenCalled();
      });

      it('should execute second links success', function() {
        var spySuccess = jasmine.createSpy('success callback');
        var spyFail = jasmine.createSpy('fail callback');

        var chain = Chain.get('chain1');
        chain.hook('link1', promiseCallback, 1);

        chain.hook('link2', {
          success: spySuccess,
          fail: spyFail
        }, 2);

        chain.execute();

        $timeout.flush();

        expect(spySuccess).toHaveBeenCalled();
        expect(spyFail).not.toHaveBeenCalled();
      });
    });

    describe('WHEN first link is rejected', function() {
      var promiseCallback;
      beforeEach(function() {
        promiseCallback = function() {
          var deferred = $q.defer();

          $timeout(function() {
            deferred.reject();
          });

          return deferred.promise;
        };
      });

      it('should not execute second callback if first callback is rejected', function() {
        var spy = jasmine.createSpy('second callback');

        var chain = Chain.get('chain1');
        chain.hook('link1', promiseCallback, 1);
        chain.hook('link2', spy, 2);

        chain.execute();

        $timeout.flush();

        expect(spy).not.toHaveBeenCalled();
      });

      it('should execute second links fail', function() {
        var spySuccess = jasmine.createSpy('success callback');
        var spyFail = jasmine.createSpy('fail callback');

        var chain = Chain.get('chain1');
        chain.hook('link1', promiseCallback, 1);

        chain.hook('link2', {
          success: spySuccess,
          failure: spyFail
        }, 2);

        chain.execute();

        $timeout.flush();

        expect(spySuccess).not.toHaveBeenCalled();
        expect(spyFail).toHaveBeenCalled();
      });
    });
  });
});
