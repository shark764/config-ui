'use strict';

angular.module('liveopsConfigPanel').controller('DashboardController', ['$rootScope', '$scope', 'realtimeDashboards', 'Queue', 'Session', '$q', '$filter', '$stateParams',
  function($rootScope, $scope, realtimeDashboards, Queue, Session, $q, $filter, $stateParams) {
    var vm = this;

    $scope.dashboard = $filter('filter')(realtimeDashboards, {id: $stateParams.id})[0];

    vm.populateSourceSwitchers = function() {
      var queueIndex = 0;
      var promises = [];

      angular.forEach($scope.dashboard.widgets, function(widget) {
        if (widget.type === 'sourceSwitcher' && angular.isDefined(widget.config.sourceType)) {
          //TODO: refactor and support multiple source types
          if (widget.config.sourceType === 'queue') {
            var query = Queue.cachedQuery({
              tenantId: Session.tenant.tenantId
            });

            query.$promise.then(function(items) {
              //Filter out disabled queues, and sort based on display name
              var filtered = $filter('filter')(items, {
                active: true
              });
              filtered.sort(function(queue1, queue2) {
                if (queue1.getDisplay().toLowerCase() > queue2.getDisplay().toLowerCase()) {
                  return 1;
                }

                if (queue1.getDisplay().toLowerCase() < queue2.getDisplay().toLowerCase()) {
                  return -1;
                }

                return 0;
              });

              //replace array but keep same object so bindings don't break
              widget.config.items.length = 0;
              widget.config.items.push.apply(widget.config.items, filtered);

              //Select the next queue automatically, so two groups don't show the same queue
              widget.config.selectedItem = widget.config.items[queueIndex];
              queueIndex++;
            });

            promises.push(query.$promise);
          }
        }
      });

      $q.all(promises).then(function() {
        $rootScope.$broadcast('async-refresh-dashboard');
      });
    };

    vm.populateSourceSwitchers();
  }
]);
