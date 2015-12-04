(function () {
  'use strict';

  angular.module('liveopsConfigPanel')
    .controller('ObjectGroupEditorController', GroupsQueryCreatorController);

    function GroupsQueryCreatorController($scope, $translate, Session, Skill, Group) {
      var vm = this;

      vm.objectGroup = $scope.objectGroup;
      vm.key = $scope.key;
      vm.placeholderText = $translate.instant('queue.query.builder.' + vm.key + '.placeholder');
      vm.readonly = $scope.readonly;
      
      vm.modelType = vm.key === ':skills' ? Skill : Group;

      vm.items = vm.modelType.cachedQuery({
          tenantId: Session.tenant.tenantId
      });
    };

})();
