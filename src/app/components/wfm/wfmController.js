'use strict';

angular.module('liveopsConfigPanel')
  .controller('wfmController', ['$scope', '$sce', '$stateParams', 'wfmUrl',
    function ($scope, $sce, $stateParams, wfmUrl) {
        $scope.wfmHostname = $sce.trustAsResourceUrl(wfmUrl + '#/' + $stateParams.link);
    }
  ]);
