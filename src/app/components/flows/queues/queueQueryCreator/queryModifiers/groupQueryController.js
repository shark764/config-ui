'use strict';

angular.module('liveopsConfigPanel')
  .controller('groupQueryController', ['$scope', '$q', 'Session', 'Group', 'jsedn',
    function ($scope, $q, Session, Group, jsedn) {
      var self = this;

      this.keyword = jsedn.kw(':groups');
      this.operatorSymbol = jsedn.sym($scope.operator);

      this.uuidSymbolRegex = /#uuid \"([\w-]+)\"/g;
      
      var parseIdSymbol = function parseIdSymbol(idSymbol) {
        return self.uuidSymbolRegex.exec(idSymbol)[1];
      };
      
      var generateIdSymbol = function generateIdSymbol(operand) {
        return jsedn.sym('#uuid "' + operand.id + '"');
      };
      
      this.fetchGroups = function () {
        return Group.cachedQuery({
          tenantId: Session.tenant.tenantId
        });
      };
      
      this.filterGroups = function (operand) {
        if (!$scope.operands) {
          return;
        }

        for (var operandIndex = 0; operandIndex < $scope.operands.length; operandIndex++) {
          var operand = $scope.operands[operandIndex];
          if (operand.id === operand.id) {
            return false;
          }
        }
        return true;
      };


      this.parseOperands = function () {
        var andList,
          operands = [];

        if (!$scope.parentMap ||
          !$scope.parentMap.exists(self.keyword) ||
          (andList = $scope.parentMap.at(self.keyword)).val.length <= 1) {
          return operands;
        }

        var operationList;
        for (var andListIndex = 1; andListIndex < andList.val.length; andListIndex++) {
          if (andList.val[andListIndex].val.length > 1 &&
            andList.val[andListIndex].val[0] === self.operatorSymbol) {
            operationList = andList.val[andListIndex];
            break;
          }
        }

        if (!operationList) {
          return operands;
        }

        operands.$promise = self.fetchGroups().$promise.then(function (options) {
          for (var operationListIndex = 1; operationListIndex < operationList.val.length; operationListIndex++) {
            var groupMap = operationList.val[operationListIndex];

            var groupIdSymbol = groupMap.keys[0];
            groupIdSymbol.id = parseIdSymbol(groupIdSymbol);
            
            var groupExpression = groupMap.vals[0];

            for (var optionIndex = 0; optionIndex < options.length; optionIndex++) {
              if (groupIdSymbol.id === options[optionIndex].id) {
                if (options[optionIndex].hasProficiency) {
                  var groupOperator = groupExpression.at(0);
                  var groupOperand = groupExpression.at(1);

                  groupIdSymbol.display = [options[optionIndex].name, groupOperator, groupOperand].join(' ');
                } else {
                  groupIdSymbol.display = options[optionIndex].name;
                }

                operands.push(groupIdSymbol);
                break;
              }
            }
          }

          return operands;
        });

        return operands;
      };

      this.add = function (operand) {
        var andList,
          groupProficiencyMap,
          operationList;
        
        $scope.typeaheadItem = null;
        
        //if root "and" exists and is followed up with something we dub thee andList
        if ($scope.parentMap.exists(self.keyword) &&
          (andList = $scope.parentMap.at(self.keyword)).val.length > 1) {

          //look in andList for the scope's operator (and/or) and dub thee operationList
          for (var andListIndex = 1; andListIndex < andList.val.length; andListIndex++) {
            if (andList.val[andListIndex].val.length > 1 &&
              andList.val[andListIndex].val[0] === self.operatorSymbol) {
              operationList = andList.val[andListIndex];
              break;
            }
          }

          //if the operationList doesn't exist or is followed up by nothing
          if (!operationList || operationList.length <= 1) {
            groupProficiencyMap = new jsedn.Map([generateIdSymbol(operand), true]);
            operationList = new jsedn.List([self.operatorSymbol, groupProficiencyMap]);

            andList.val.push(operationList);
            $scope.selected = null;
            return;
          }

          //check if the group id has already been added
          for (var operationListIndex = 1; operationListIndex < operationList.val.length; operationListIndex++) {
            var groupMap = operationList.val[operationListIndex];

            if (groupMap.exists(generateIdSymbol(operand))) {
              return;
            }
          }

          groupProficiencyMap = new jsedn.Map([generateIdSymbol(operand), true]);
          operationList.val.push(groupProficiencyMap);
        } else {
          groupProficiencyMap = new jsedn.Map([generateIdSymbol(operand), true]);

          operationList = new jsedn.List([self.operatorSymbol, groupProficiencyMap]);
          andList = new jsedn.List([jsedn.sym('and'), operationList]);

          $scope.parentMap.set(jsedn.kw(self.keyword), andList);
        }

        $scope.selected = null;
      };

      this.remove = function (operand) {
        var andList;

        //if root "and" exists and is followed up with something we dub thee andList
        if ($scope.parentMap.exists(self.keyword) &&
          (andList = $scope.parentMap.at(self.keyword)).val.length > 1) {

          var operationList;

          //look in andList for the scope's operator (and/or) and dub thee operationList
          for (var andListIndex = 1; andListIndex < andList.val.length; andListIndex++) {
            if (andList.val[andListIndex].val.length > 1 &&
              andList.val[andListIndex].val[0] === self.operatorSymbol) {
              operationList = andList.val[andListIndex];
              break;
            }
          }

          if (!operationList) {
            return;
          }

          //look in operationList for the group operand being removed
          for (var operationListIndex = 1; operationListIndex < operationList.val.length; operationListIndex++) {
            var groupMap = operationList.val[operationListIndex];

            if (groupMap.exists(generateIdSymbol(operand))) {
              operationList.val.splice(operationListIndex, 1);

              if (operationList.val.length <= 1) {
                $scope.parentMap.remove(self.keyword);
              }
              return;
            }
          }
        }
      };
    }
  ]);
