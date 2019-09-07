'use strict';

angular.module('liveopsConfigPanel')
    .controller('keysController2', ['$scope', '$sce', 'config2Url',
        function ($scope, $sce, config2Url) {
            if (location.hash.includes('alpha')) {
                $scope.apiKeysTemplateHostName = $sce.trustAsResourceUrl(config2Url + '/#/configuration/apiKeys?alpha');
            } else {
                $scope.apiKeysTemplateHostName = $sce.trustAsResourceUrl(config2Url + '/#/configuration/apiKeys');
            }
        }
    ]);