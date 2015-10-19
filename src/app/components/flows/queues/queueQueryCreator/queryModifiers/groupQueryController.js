'use strict';

angular.module('liveopsConfigPanel')
  .controller('groupQueryController', ['$scope', '$q', 'Session', 'Group', 'jsedn',
    function ($scope, $q, Session, Group, jsedn) {
      var self = this;

      this.keyword = jsedn.kw(':groups');
      this.operatorSymbol = jsedn.sym($scope.operator);
      
      this.uuidTag = new jsedn.Tag('uuid');
      
      this.tagUuid = function tagUuid(uuid) {
        return new jsedn.Tagged(self.uuidTag, uuid);
      };
      
      this.fetchGroups = function () {
        return Group.cachedQuery({
          tenantId: Session.tenant.tenantId
        });
      };
      
      this.filterGroups = function (group) {
        if (!$scope.operands) {
          return;
        }

        for (var operandIndex = 0; operandIndex < $scope.operands.length; operandIndex++) {
          var operand = $scope.operands[operandIndex];
          if (group.id === operand.id) {
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

            var groupIdTag = groupMap.keys[0];
            
            if(angular.isString(groupIdTag)) {
              groupMap.keys[0] = groupIdTag = self.tagUuid(groupIdTag);
            }
            
            groupIdTag.id = groupIdTag.obj();
            
            for (var optionIndex = 0; optionIndex < options.length; optionIndex++) {
              if (groupIdTag.id === options[optionIndex].id) {
                groupIdTag.display = options[optionIndex].name;
                operands.push(groupIdTag);
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
            groupProficiencyMap = new jsedn.Map([self.tagUuid(operand.id), true]);
            
            operationList = new jsedn.List([self.operatorSymbol, groupProficiencyMap]);

            andList.val.push(operationList);
            $scope.selected = null;
            return;
          }

          //check if the group id has already been added
          for (var operationListIndex = 1; operationListIndex < operationList.val.length; operationListIndex++) {
            var groupMap = operationList.val[operationListIndex];

            if (groupMap.exists(self.tagUuid(operand.id))) {
              return;
            }
          }

          groupProficiencyMap = new jsedn.Map([self.tagUuid(operand.id), true]);
          operationList.val.push(groupProficiencyMap);
        } else {
          //else create the entire tree
          groupProficiencyMap = new jsedn.Map([self.tagUuid(operand.id), true]);

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
            
            for(var groupMapKey in groupMap.keys) {
              var groupIdTag = groupMap.keys[groupMapKey];
              if(groupIdTag.obj() === operand.id) {
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
