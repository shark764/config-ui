'use strict';

//TODO: add to config-shared
angular.module('liveopsConfigPanel')
  .directive('loAudioControl', [function() {
    return {
      restrict: 'AE',
      controller: function() {
        var vm = this;
        
        vm.play = function() {
          vm.audioElement.play();
        };
        
        vm.pause = function() {
          vm.audioElement.pause();
        };
        
        vm.forward = function(seconds) {
          if(!angular.isNumber(seconds)) {
            seconds = 5;
          }
          vm.audioElement.currentTime = vm.audioElement.currentTime + seconds;
        };
        
        vm.rewind = function(seconds) {
          if(!angular.isNumber(seconds)) {
            seconds = 5;
          }
          vm.audioElement.currentTime = vm.audioElement.currentTime - seconds;
        };
      },
      link: function($scope, elem, attr, ctrl) {
        ctrl.audioElement = elem[0];
        if(attr.name) {
          $scope[attr.name] = ctrl;
        }
      }
    };
  }]);