'use strict';

angular.module('liveopsConfigPanel')
  .service('BulkAction', ['$q',
    function ($q) {
      var BulkAction = function () {
        this.checked = false;
      };

      BulkAction.prototype.reset = function () {
        this.checked = false;
      };
      
      BulkAction.prototype.reset = function() {
        this.checked = false;
      };

      BulkAction.prototype.apply = function () {};

      BulkAction.prototype.execute = function (items) {
        var promises = [];
        var self = this;
        angular.forEach(items, function (item) {
          promises.push($q.when(self.apply(item)));
        });

        return $q.all(promises);
      };

      BulkAction.prototype.canExecute = function () {
        return true;
      };

      return BulkAction;
    }
  ]);
