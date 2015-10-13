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
        var andList,
            groupSet;
        
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
      };

      $scope.add = function (item) {
        var andList,
          groupProficiencyMap,
          operationList;
        
        $scope.typeaheadItem = null;
          
        //if root "and" exists and is followed up with something we dub thee andList
        if ($scope.parentMap.exists($scope.keyword) &&
          (andList = $scope.parentMap.at($scope.keyword)).val.length > 1) {
            
          //look in andList for the scope's operator (and/or) and dub thee operationList
          for (var andListIndex = 1; andListIndex < andList.val.length; andListIndex++) {
            if (andList.val[andListIndex].val.length > 1 &&
              andList.val[andListIndex].val[0] === $scope.operatorSymbol) {
              operationList = andList.val[andListIndex];
              break;
            }
          }
          
          //if the operationList doesn't exist or is followed up by nothing
          if (!operationList || operationList.length <= 1) {
            groupProficiencyMap = new jsedn.Map([jsedn.sym('#uuid "' + item.id + '"'), true]);
            operationList = new jsedn.List([$scope.operatorSymbol, groupProficiencyMap]);

            andList.val.push(operationList);
            $scope.selected = null;
            return;
          }
          
          //check if the group id has already been added
          for (var operationListIndex = 1; operationListIndex < operationList.val.length; operationListIndex++) {
            var groupMap = operationList.val[operationListIndex];

            if (groupMap.exists(jsedn.sym('#uuid "' + item.id + '"'))) {
              return;
            }
          }

          groupProficiencyMap = new jsedn.Map([jsedn.sym('#uuid "' + item.id + '"'), true]);
          operationList.val.push(groupProficiencyMap);
        } else {
          groupProficiencyMap = new jsedn.Map([jsedn.sym('#uuid "' + item.id + '"'), true]);

          operationList = new jsedn.List([$scope.operatorSymbol, groupProficiencyMap]);
          andList = new jsedn.List([jsedn.sym('and'), operationList]);

          $scope.parentMap.set(jsedn.kw($scope.keyword), andList);
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
