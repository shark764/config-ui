'use strict';

angular.module('liveopsConfigPanel')
  .controller('skillQueryController', ['$scope', '$q', 'Session', 'Skill', 'jsedn',
    function ($scope, $q, Session, Skill, jsedn) {
      var self = this;

      this.keyword = jsedn.kw(':skills');
      this.operatorSymbol = jsedn.sym($scope.operator);

      this.operatorMap = {
        gt: '>',
        gte: '>=',
        lt: '<',
        lte: '<=',
        equal: '='
      };

      this.uuidTag = new jsedn.Tag('uuid');
      
      this.tagUuid = function tagUuid(uuid) {
        return new jsedn.Tagged(self.uuidTag, uuid);
      };

      var generateProficiencyMap = function generateProficiencyMap(operand) {
        var skillProficiencyMap,
          proficiencyList,
          proficiencyOperator;

        if (operand.hasProficiency) {
          proficiencyOperator = jsedn.sym(self.operatorMap[operand.proficiencyOperator]);
          proficiencyList = new jsedn.List([proficiencyOperator, operand.proficiency]);
          skillProficiencyMap = new jsedn.Map([self.tagUuid(operand.id), proficiencyList]);
        } else {
          proficiencyOperator = jsedn.sym(self.operatorMap.gte);
          proficiencyList = new jsedn.List([proficiencyOperator, 1]);
          skillProficiencyMap = new jsedn.Map([self.tagUuid(operand.id), proficiencyList]);
        }

        return skillProficiencyMap;
      };

      this.fetchSkills = function () {
        return Skill.cachedQuery({
          tenantId: Session.tenant.tenantId
        });
      };

      this.filterSkills = function () {
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

        operands.$promise = self.fetchSkills().$promise.then(function (options) {
          for (var operationListIndex = 1; operationListIndex < operationList.val.length; operationListIndex++) {
            var skillMap = operationList.val[operationListIndex];

            var skillIdTag = skillMap.keys[0];
            
            if(angular.isString(skillIdTag)) {
              skillMap.keys[0] = skillIdTag = self.tagUuid(skillIdTag);
            }
            
            skillIdTag.id = skillIdTag.obj();

            var skillExpression = skillMap.vals[0];

            for (var optionIndex = 0; optionIndex < options.length; optionIndex++) {
              if (skillIdTag.id === options[optionIndex].id) {
                if (options[optionIndex].hasProficiency) {
                  var skillOperator = skillExpression.at(0);
                  var skillOperand = skillExpression.at(1);

                  skillIdTag.display = [options[optionIndex].name, skillOperator, skillOperand].join(' ');
                } else {
                  skillIdTag.display = options[optionIndex].name;
                }

                operands.push(skillIdTag);
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
          skillProficiencyMap,
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
            skillProficiencyMap = generateProficiencyMap(operand);
            operationList = new jsedn.List([self.operatorSymbol, skillProficiencyMap]);

            andList.val.push(operationList);
            $scope.selected = null;
            return;
          }

          //check if the skill id has already been added
          for (var operationListIndex = 1; operationListIndex < operationList.val.length; operationListIndex++) {
            var skillMap = operationList.val[operationListIndex];

            if (skillMap.exists(self.tagUuid(operand.id))) {
              return;
            }
          }

          skillProficiencyMap = generateProficiencyMap(operand);
          operationList.val.push(skillProficiencyMap);
        } else {
          skillProficiencyMap = generateProficiencyMap(operand);

          operationList = new jsedn.List([self.operatorSymbol, skillProficiencyMap]);
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

          //look in operationList for the skill operand being removed
          for (var operationListIndex = 1; operationListIndex < operationList.val.length; operationListIndex++) {
            var skillMap = operationList.val[operationListIndex];
            
            for(var skillMapKey in skillMap.keys) {
              var skillIdTag = skillMap.keys[skillMapKey];
              if(skillIdTag.obj() === operand.id) {
                operationList.val.splice(operationListIndex, 1);

                if (operationList.val.length <= 1) {
                  $scope.parentMap.remove(self.keyword);
                }
                
                return;
              }
            }
          }
        }
      };
    }
  ]);
