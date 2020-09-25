'use strict'

angular.module('liveopsConfigPanel')
    .controller('languagePickerController', ['$rootScope', '$scope', '$translate', 'languages',
        function($rootScope, $scope, $translate, languages){
            $scope.selectedOption = languages.find(function(option){
                return option.value === window.localStorage.getItem('locale');
            });
            $scope.langs = languages;
            $scope.showSelector = false;
            $scope.showOptions = false;

            $scope.toggleSelector = function(){
                $scope.showSelector = !$scope.showSelector;
            };

            $scope.toggleOptions= function(){
                $scope.showOptions = !$scope.showOptions;
            };

            $scope.selectLanguage = function(language) {
                $scope.selectedOption = languages.find(function(option){
                    return option.value === language;   
                });
                $translate.use(language);
                $scope.showOptions = false;
                $scope.showSelector = false;
                window.localStorage.setItem('locale', language);
            }
        }])