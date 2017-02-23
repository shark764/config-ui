'use strict';

angular.module('liveopsConfigPanel')
  .controller('CapacityRuleBuilderController', ['$scope', 'capacityRuleChannels', 'jsedn', 'lodash',
    function($scope, capacityRuleChannels, jsedn, lodash) {

      $scope.channels = capacityRuleChannels;

      function findChannel(value){
        return lodash.findWhere($scope.channels, {value: value});
      }

      $scope.voiceRule = {
        count: 1,
        channels: []
      };

      $scope.rules = [];

      $scope.addRule = function(channel, index){
        var newRule =  {
          count: 0,
          channels: [channel]
        };
        $scope.rules.splice(index, 0, newRule);

        return true;
      };

      $scope.removeChannel = function(rule, channel){
        rule.channels = _.without(rule.channels, channel);

        if(rule.channels.length === 0){
          $scope.rules = _.without($scope.rules, rule);
        }
      };

      $scope.addChannel = function(rule, channel, index, event){
        event.stopPropagation();
        if(lodash.findWhere(rule.channels, {value: channel.value})){
          return false;
        }
        else{
          rule.channels.splice(index, 0, channel);
          return true;
        }
      };

      //Load a capacity rule
      if($scope.ngModel){
        jsedn.parse($scope.ngModel).each(function(val, key){
          var rule = {
            count: val,
            channels: []
          };

          var derp = key.jsEncode();
          derp.forEach(function(channel){
            rule.channels.push(findChannel(channel));
          });

          if(rule.channels[0] && rule.channels[0].value === ':voice'){
            $scope.voiceRule = rule;
          }
          else{
            $scope.rules.push(rule);
          }
        });
      }

      function buildRule(newVal, oldVal){
        if(newVal === oldVal){return;}

        var rules = _.union([$scope.voiceRule], $scope.rules),
            retval = new jsedn.Map();

        rules.forEach(function(rule){
          if(rule.count === 0 || rule.channels.length === 0){
            return;
          }

          var keys = new jsedn.Vector(_.map(rule.channels, function(channel){
            return jsedn.kw(channel.value);
          }));

          retval.set(keys, rule.count);
        });

        $scope.ngModel = retval.ednEncode();
      }


      $scope.$watch('rules', buildRule, true);
      $scope.$watch('voiceRule', buildRule, true);

      //Print out ruleset String
      $scope.getRuleSetString = function(){
        var rules = _.union([$scope.voiceRule], $scope.rules);
        return _.compact(_.map(rules, function(rule){
          if(rule.count === 0 || rule.channels.length === 0){
            return;
          }

          return lodash.pluck(rule.channels, 'name').join(', ') + ': ' + rule.count;
        })).join(($scope.quantifier === 'all' ? ' & ' : ' | '));
      };
    }
  ]);
