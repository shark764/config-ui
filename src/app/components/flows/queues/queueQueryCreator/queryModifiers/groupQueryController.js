'use strict';

angular.module('liveopsConfigPanel')
  .controller('groupQueryController', ['$scope', '$q', 'Session', 'Group', 'jsedn',
    function($scope, $q, Session, Group, jsedn) {
      $scope.keyword = jsedn.kw(':groups');
      $scope.operatorSymbol = jsedn.sym($scope.operator);

      $scope.fetchGroups = function() {
        return Group.cachedQuery({
          tenantId: Session.tenant.tenantId
        });
      };

      $scope.filterGroups = function(item) {
        if(!$scope.operands) {
          return;
        }

        for(var operandIndex = 0; operandIndex < $scope.operands.length; operandIndex++) {
          var operand = $scope.operands[operandIndex];
          if(operand.id === item.id) {
            return false;
          }
        }
        return true;
      };

      this.parseOperands = function() {
        var andList, operationList, groupSet;
        if (!$scope.parentMap ||
          !$scope.parentMap.exists($scope.keyword) ||
          (andList = $scope.parentMap.at($scope.keyword)).val.length <= 1) {
          return $q.when();
        }

        for (var andListIndex = 1; andListIndex < andList.val.length; andListIndex++) {
          if (andList.val[andListIndex].val.length > 1 &&
            andList.val[andListIndex].val[0] === $scope.operatorSymbol) {
            groupSet = andList.val[andListIndex].val[1];
          }
        }

        if (!groupSet) {
          return $q.when();
        }

        var operands = [];
        $scope.fetchGroups().$promise.then(function(options) {
          for (var groupSetIndex = 0; groupSetIndex < groupSet.val.length; groupSetIndex++) {
            for (var optionIndex = 0; optionIndex < options.length; optionIndex++) {
              if (groupSet.val[groupSetIndex] === options[optionIndex].id) {
                operands.push(options[optionIndex]);
              }
            }
          }

          return operands;
        });

        return operands;
      }

      $scope.add = function(item) {
        if ($scope.parentMap.exists($scope.keyword) &&
          (andList = $scope.parentMap.at($scope.keyword)).val.length > 1) {

          var groupSet;
          for (var andListIndex = 1; andListIndex < andList.val.length; andListIndex++) {
            if (andList.val[andListIndex].val.length &&
              andList.val[andListIndex].val[0] === $scope.operatorSymbol) {
              groupSet = andList.val[andListIndex].val[1];
            }
          }

          if (groupSet) {
            for (var groupSetIndex = 0; groupSetIndex < groupSet.val.length; groupSetIndex++) {
              if (groupSet.val[groupSetIndex] === item.id) {
                return;
              }
            }

            groupSet.val.push(item.id);
          } else {
            var groupSet = new jsedn.Set([item.id]);
            var operationList = new jsedn.List([$scope.operatorSymbol, groupSet]);
            andList.val.push(operationList);
          }
        } else {
          var groupSet = new jsedn.Set([item.id]);
          var operationList = new jsedn.List([$scope.operatorSymbol, groupSet]);
          var andList = new jsedn.List([jsedn.sym('and'), operationList]);

          $scope.parentMap.set($scope.keyword, andList);
        }

        $scope.selected = null;
      };

      $scope.remove = function(item) {
        var andList;
        if ($scope.parentMap.exists($scope.keyword) &&
          (andList = $scope.parentMap.at($scope.keyword)).val.length > 1) {

          var groupSet;
          for (var andListIndex = 1; andListIndex < andList.val.length; andListIndex++) {
            if (andList.val[andListIndex].val.length &&
              andList.val[andListIndex].val[0] === $scope.operatorSymbol) {
              groupSet = andList.val[andListIndex].val[1];

              groupSet.val.removeItem(item.id);

              if (groupSet.val.length === 0) {
                andList.val.splice(andListIndex, 1);

                if (andList.val.length <= 1) {
                  $scope.parentMap.remove($scope.keyword);
                }
              }
            }
          }
        }
      };
    }
  ]);
