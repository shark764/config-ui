'use strict';

angular.module('liveopsConfigPanel')
  .controller('ContentController', ['$scope', 'Region',
    function ($scope, Region) {

      $scope.regions = Region.query({}, function () {
        $scope.Session.activeRegionId = $scope.regions[0].id;
      });

    }
  ]);
