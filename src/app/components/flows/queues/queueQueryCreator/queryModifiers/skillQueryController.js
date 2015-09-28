'use strict';

angular.module('liveopsConfigPanel')
  .controller('skillQueryController', ['$scope', '$q', 'Session', 'Skill', 'jsedn',
    function ($scope, $q, Session, Skill, jsedn) {
      var self = this;

      $scope.keyword = jsedn.kw(':skills');
      $scope.operatorSymbol = jsedn.sym($scope.operator);

      this.operatorMap = {
        gt: '>',
        lt: '<',
        equal: '='
      };

      $scope.filterSkills = function(item, text) {
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


      this.parseOperands = function () {
        var andList;
        if (!$scope.parentMap ||
          !$scope.parentMap.exists($scope.keyword) ||
          (andList = $scope.parentMap.at($scope.keyword)).val.length <= 1) {
          return $q.when();
        }

        var operationList;
        for (var andListIndex = 1; andListIndex < andList.val.length; andListIndex++) {
          if (andList.val[andListIndex].val.length > 1 &&
            andList.val[andListIndex].val[0] === $scope.operatorSymbol) {
            operationList = andList.val[andListIndex];
            break;
          }
        }

        if (!operationList) {
          return $q.when();
        }

        var operands = [];
        operands.$promise = $scope.fetchSkills().$promise.then(function(options) {
          for (var operationListIndex = 1; operationListIndex < operationList.val.length; operationListIndex++) {
            var skillMap = operationList.val[operationListIndex];

            var skillKeyword = skillMap.keys[0];
            skillKeyword.id = skillKeyword.val.substring(1, skillKeyword.length);

            var skillExpression = skillMap.vals[0];

            for (var optionIndex = 0; optionIndex < options.length; optionIndex++) {
              if (skillKeyword.id === options[optionIndex].id) {
                if (options[optionIndex].hasProficiency) {
                  var skillOperator = skillExpression.at(0);
                  var skillOperand = skillExpression.at(1);

                  skillKeyword.display = [options[optionIndex].name, skillOperator, skillOperand].join(' ');
                } else {
                  skillKeyword.display = options[optionIndex].name;
                }

                operands.push(skillKeyword);
                break;
              }
            }
          }

          return operands;
        });

        return operands;
      };

      $scope.fetchSkills = function () {
        return Skill.cachedQuery({
          tenantId: Session.tenant.tenantId
        });
      };

      $scope.add = function (item) {
        var andList;
        if ($scope.parentMap.exists($scope.keyword) &&
          (andList = $scope.parentMap.at($scope.keyword)).val.length > 1) {

          var operationList;
          for (var andListIndex = 1; andListIndex < andList.val.length; andListIndex++) {
            if (andList.val[andListIndex].val.length > 1 &&
              andList.val[andListIndex].val[0] === $scope.operatorSymbol) {
              operationList = andList.val[andListIndex];
              break;
            }
          }

          if (!operationList || operationList.length <= 1) {
            if (item.hasProficiency) {
              var proficiencyOperator = jsedn.sym(self.operatorMap[item.proficiencyOperator]);
              var proficiencyList = new jsedn.List([proficiencyOperator, item.proficiency]);
              var skillProficiencyMap = new jsedn.Map([jsedn.kw(':' + item.id), proficiencyList]);
            } else {
              var skillProficiencyMap = new jsedn.Map([jsedn.kw(':' + item.id), true]);
            }

            var operationList = new jsedn.List([$scope.operatorSymbol, skillProficiencyMap]);

            andList.val.push(operationList);
            return;
          }

          for (var operationListIndex = 1; operationListIndex < operationList.val.length; operationListIndex++) {
            var skillMap = operationList.val[operationListIndex];

            if (skillMap.exists(jsedn.kw(':' + item.id))) {
              return;
            }
          }

          if (item.hasProficiency) {
            var proficiencyOperator = jsedn.sym(self.operatorMap[item.proficiencyOperator]);
            var proficiencyList = new jsedn.List([proficiencyOperator, item.proficiency]);
            operationList.val.push(new jsedn.Map([jsedn.kw(':' + item.id), proficiencyList]));
          } else {
            operationList.val.push(new jsedn.Map([jsedn.kw(':' + item.id), true]));
          }
        } else {
          if (item.hasProficiency) {
            var proficiencyOperator = jsedn.sym(self.operatorMap[item.proficiencyOperator]);
            var proficiencyList = new jsedn.List([proficiencyOperator, item.proficiency]);
            var skillProficiencyMap = new jsedn.Map([jsedn.kw(':' + item.id), proficiencyList]);
          } else {
            var skillProficiencyMap = new jsedn.Map([jsedn.kw(':' + item.id), true]);
          }

          var operationList = new jsedn.List([$scope.operatorSymbol, skillProficiencyMap]);
          var andList = new jsedn.List([jsedn.sym('and'), operationList]);

          $scope.parentMap.set(jsedn.kw($scope.keyword), andList);
        }

        $scope.selected = null;
      };

      $scope.remove = function (operand) {
        var andList;
        if ($scope.parentMap.exists($scope.keyword) &&
          (andList = $scope.parentMap.at($scope.keyword)).val.length > 1) {

          var operationList;
          for (var andListIndex = 1; andListIndex < andList.val.length; andListIndex++) {
            if (andList.val[andListIndex].val.length > 1 &&
              andList.val[andListIndex].val[0] === $scope.operatorSymbol) {
              operationList = andList.val[andListIndex];
              break;
            }
          }

          if (!operationList) {
            return;
          }

          for (var operationListIndex = 1; operationListIndex < operationList.val.length; operationListIndex++) {
            var skillMap = operationList.val[operationListIndex];

            if (skillMap.exists(jsedn.kw(':' + operand.id))) {
              operationList.val.splice(operationListIndex, 1);

              if (operationList.val.length <= 1) {
                $scope.parentMap.remove($scope.keyword);
              }
            }
          }
        }
      };
    }
  ]);
