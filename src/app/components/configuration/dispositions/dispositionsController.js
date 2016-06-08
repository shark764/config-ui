'use strict';

angular.module('liveopsConfigPanel')
  .controller('dispositionsController', ['dispositionsTableConfig', 'Disposition', 'Session', function(dispositionsTableConfig, Disposition, Session) {
    var vm = this;
    vm.tableConfig = dispositionsTableConfig;
    vm.reasons = Disposition.cachedQuery({
      tenantId: Session.tenant.tenantId
    });

  }]);
