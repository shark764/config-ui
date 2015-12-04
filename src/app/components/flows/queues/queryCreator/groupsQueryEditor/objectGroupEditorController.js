(function () {
  'use strict';

  angular.module('liveopsConfigPanel')
    .controller('ObjectGroupEditorController', GroupsQueryCreatorController);

    function GroupsQueryCreatorController($scope, $translate) {
      var vm = this;

      vm.objectGroup = $scope.objectGroup;
      vm.items = $scope.modelType.cachedQuery();
      vm.key = $scope.key;
      vm.placeholderText = $translate.instant('queue.query.builder.' + vm.key + '.placeholder');
    };

})();
