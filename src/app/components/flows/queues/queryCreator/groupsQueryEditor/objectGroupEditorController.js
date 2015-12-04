(function () {
  'use strict';

  angular.module('liveopsConfigPanel')
    .controller('ObjectGroupEditorController', GroupsQueryCreatorController);

    function GroupsQueryCreatorController($scope, $translate, Session) {
      var vm = this;

      vm.objectGroup = $scope.objectGroup;
      vm.key = $scope.key;
      vm.placeholderText = $translate.instant('queue.query.builder.' + vm.key + '.placeholder');

      vm.items = $scope.modelType.cachedQuery({
          tenantId: Session.tenant.tenantId
      });
    };

})();
