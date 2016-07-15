'use strict';

angular.module('liveopsConfigPanel')
    .controller('listEditorController', ['$scope', '$timeout', '$translate', '_', 'Disposition', 'Reason', 'Session', function($scope, $timeout, $translate, _, Disposition, Reason, Session) {

      // Originally written for disposition lists, then realized the same controls were needed for reason lists....so the variable names are dispo centric
      $scope.init = function() {
        $scope.dropdown = -1;

        if ($scope.type === 'dispositions') {
          $scope.possibleDispos = Disposition.query({
            tenantId: Session.tenant.tenantId
          });
          $scope.possibleDispos.$promise.then(function(dispos) {
            $scope.possibleDispos = dispos.filter(function(possibleDispo) {
              var found = false;
              $scope.dispositionList.forEach(function(dispo) {
                if (dispo.dispositionId === possibleDispo.id) {
                  found = true;
                }
              });
              return !found;
            }).sort(function(a, b) {
              var A = a.name.toLowerCase();
              var B = b.name.toLowerCase();
              if (A < B) return -1;
              if (A > B) return 1;
              return 0;
            });
          });
        } else {
          $scope.possibleDispos = Reason.query({
            tenantId: Session.tenant.tenantId
          });
          $scope.possibleDispos.$promise.then(function(reasons) {
            $scope.possibleDispos = reasons.filter(function(possibleReason) {
              var found = false;
              $scope.dispositionList.forEach(function(reason) {
                if (reason.reasonId === possibleReason.id) {
                  found = true;
                }
              });
              return !found;
            }).sort(function(a, b) {
              var A = a.name.toLowerCase();
              var B = b.name.toLowerCase();
              if (A < B) return -1;
              if (A > B) return 1;
              return 0;
            });;
          });
        }

      };

      $scope.toggleDropdown = function(index) {
        if ($scope.dropdown === -1) {
          $scope.dropdown = index;
          return;
        }
        $scope.dropdown = -1;
      };

      $scope.highlightText = function(event) {
        event.target.select();
      };

      $scope.addCategory = function() {
        var idx;
        var newCategory = {name: 'Enter a category name', type:'category'};
        $scope.dispositionList.push(newCategory);
        $scope.selectedDispo = _.last($scope.dispositionList);
        $scope.dropdown = -1;
        $scope.detailsForm.$setDirty();
        idx = $scope.dispositionList.indexOf(newCategory);
        $timeout(function() {
          document.getElementById('category-' + idx).focus();
        }, 0);
        $scope.$watch(function() {
          return newCategory.name;
        }, function(newVal, oldVal) {
          $scope.dispositionList.forEach(function(dispo) {
            if (angular.isDefined(dispo.hierarchy) && dispo.hierarchy.includes(oldVal)) {
              var index = dispo.hierarchy.indexOf(oldVal);
              dispo.hierarchy[index] = newVal;
            }
          });
        });
      };

      $scope.addDispo = function() {
        $scope.dispositionList.push({
          name: $translate.instant($scope.type + '.details.select'),
          hierarchy: []
        });
        $scope.selectedDispo = _.last($scope.dispositionList);
        $scope.detailsForm.$setDirty();
      };

      $scope.demote = function() {
        if(angular.isDefined($scope.selectedDispo) && angular.isDefined($scope.selectedDispo.hierarchy) && $scope.selectedDispo.hierarchy.length === 0) {
          var index = $scope.dispositionList.indexOf($scope.selectedDispo);
          for (var i = index; i >= 0; i--) {
            if ($scope.dispositionList[i].type === 'category') {
              $scope.selectedDispo.hierarchy.push($scope.dispositionList[i].name);
              break;
            }
          }
          $scope.dropdown = -1;
          $scope.detailsForm.$setDirty();
        }
      };

      $scope.promote = function() {
        // IF the disposition we're promoting has other 'siblings', we'll want to move the selectedDispo to after them
        var originalIndex = $scope.dispositionList.indexOf($scope.selectedDispo);
        var nextIndex = originalIndex + 1;
        if (angular.isDefined($scope.dispositionList[nextIndex].hierarchy) && $scope.dispositionList[nextIndex].hierarchy[0] === $scope.selectedDispo.hierarchy[0]) {
          for (var i = nextIndex; i < $scope.dispositionList.length; i++) {
            if (!angular.isDefined($scope.dispositionList[i].hierarchy) || $scope.dispositionList[i].hierarchy[0] !== $scope.selectedDispo.hierarchy[0]) {
              nextIndex = i;
              break;
            }
          }
          $scope.dispositionList.splice(nextIndex, 0, $scope.selectedDispo);
          $scope.dispositionList.splice(originalIndex, 1);
        }

        $scope.selectedDispo.hierarchy.pop();
        $scope.dropdown = -1;
        $scope.detailsForm.$setDirty();
      };

      $scope.selectDisposition = function(index) {
        $scope.selectedDispo = $scope.dispositionList[index];
        $scope.dropdown = -1;
      };

      $scope.selectNewDispo = function(dropdownIndex) {
        var listIndex = $scope.dispositionList.indexOf($scope.selectedDispo);

        if ($scope.selectedDispo.name.slice(0, 8) !== 'Select a') {
          $scope.possibleDispos.push($scope.selectedDispo);
        }

        $scope.dispositionList[listIndex] = $scope.possibleDispos[dropdownIndex];
        $scope.dispositionList[listIndex][$scope.type.slice(0, -1) + 'Id'] = $scope.dispositionList[listIndex].id;
        $scope.dispositionList[listIndex].sortOrder = listIndex;
        $scope.dispositionList[listIndex].hierarchy = $scope.selectedDispo.hierarchy;

        delete $scope.dispositionList[listIndex].created;
        delete $scope.dispositionList[listIndex].createdBy;
        delete $scope.dispositionList[listIndex].updated;
        delete $scope.dispositionList[listIndex].updatedBy;
        delete $scope.dispositionList[listIndex].id;

        $scope.possibleDispos.splice(dropdownIndex, 1);

        $scope.possibleDispos.sort(function(a, b) {
          var A = a.name.toLowerCase();
          var B = b.name.toLowerCase();
          if (A < B) return -1;
          if (A > B) return 1;
          return 0;
        });

        $scope.selectedDispo = $scope.dispositionList[listIndex];
        $scope.dropdown = -1;
        $scope.detailsForm.$setDirty();
      };

      $scope.moveDown = function () {

        // If no item is selected, do nothing
        if (angular.isDefined($scope.selectedDispo)) {
          var originalIndex = $scope.dispositionList.indexOf($scope.selectedDispo);
          var nextIndex = originalIndex + 1;

          // If already at the bottom of the list, do nothing.
          if (nextIndex === $scope.dispositionList.length) return;

          if (angular.isDefined($scope.selectedDispo.hierarchy)) {
            // SELECTED ITEM IS AN ITEM
            if ($scope.dispositionList[nextIndex].hierarchy) {
              // if next item is item, just swap them, unless the hierarchies are different, in which case do nothing, we are at the bottom of the sublist
              if ($scope.dispositionList[nextIndex].hierarchy.length === $scope.selectedDispo.hierarchy.length) {
                $scope.dispositionList.splice(nextIndex + 1, 0, $scope.selectedDispo);
                $scope.dispositionList.splice(originalIndex, 1);
              }
            } else {
              // if next item is category, move to after the last children (either next category or first differing hierarchy)
              // UNLESS THIS IS PART OF ANOTHER SUBLIST
              if ($scope.selectedDispo.hierarchy.length > 0) {
                return;
              }
              //edge case :(
              if (nextIndex + 1 === $scope.dispositionList.length) {
                nextIndex++;
              }
              for (var i = nextIndex + 1; i < $scope.dispositionList.length; i++) {
                if (angular.isDefined($scope.dispositionList[i].type) || $scope.selectedDispo.hierarchy[0] === $scope.dispositionList[i].hierarchy[0]) {
                  nextIndex = i;
                  break;
                }
                // if the last item is a sublist item, then we need to force the splice to happen at the end of the disposition list
                if (i + 1 === $scope.dispositionList.length) {
                  nextIndex = i + 1;
                }
              }
              $scope.dispositionList.splice(nextIndex, 0, $scope.selectedDispo);
              $scope.dispositionList.splice(originalIndex, 1);
            }
          } else {
            // SELECTED ITEM IS A CATEGORY
            // gather children into a unit and treat them as a single item
            var children = [$scope.selectedDispo];
            for (var i = originalIndex + 1; i < $scope.dispositionList.length; i++) {
              nextIndex = i;
              if (angular.isDefined($scope.dispositionList[i].hierarchy) && $scope.dispositionList[i].hierarchy[0] === $scope.selectedDispo.name) {
                children.push($scope.dispositionList[i]);
              } else {
                break;
              }
            }

            if ($scope.dispositionList[nextIndex].type) {
              for (var i = nextIndex + 1; i < $scope.dispositionList.length; i++) {
                if (!angular.isDefined($scope.dispositionList[i].hierarchy) || !$scope.dispositionList[i].hierarchy.length) {
                  break;
                }
                nextIndex = i;
              }
            }

            children.forEach(function(item) {
              nextIndex++;
              $scope.dispositionList.splice(nextIndex, 0, item);
            });
            $scope.dispositionList.splice(originalIndex, children.length);
          }

          $scope.detailsForm.$setDirty();
          $scope.dropdown = -1;
        }
      };

      $scope.moveUp = function() {
        // If no item is selected, do nothing
        if (angular.isDefined($scope.selectedDispo)) {
          var originalIndex = $scope.dispositionList.indexOf($scope.selectedDispo);
          var nextIndex = originalIndex - 1;

          // If already at the top of the list, do nothing.
          if (nextIndex === -1) return;

          if (angular.isDefined($scope.selectedDispo.hierarchy)) {
            // SELECTED ITEM IS AN ITEM
            if ($scope.selectedDispo.hierarchy.length > 0 && angular.isDefined($scope.dispositionList[nextIndex].type)) return;
            if (angular.isDefined($scope.dispositionList[nextIndex].hierarchy) && $scope.dispositionList[nextIndex].hierarchy[0] !== $scope.selectedDispo.hierarchy[0]) {
              for (var i = nextIndex - 1; i >= 0; i--) {
                if (angular.isDefined($scope.dispositionList[i].type)) {
                  nextIndex = i;
                  break;
                }
              }
            }
            $scope.dispositionList.splice(originalIndex, 1);
            $scope.dispositionList.splice(nextIndex, 0, $scope.selectedDispo);

          } else {
            // SELECTED ITEM IS A CATEGORY
            // gather children into a unit and treat them as a single item
            var children = [$scope.selectedDispo];
            for (var i = originalIndex + 1; i < $scope.dispositionList.length; i++) {
              if (angular.isDefined($scope.dispositionList[i].hierarchy) && $scope.dispositionList[i].hierarchy[0] === $scope.selectedDispo.name) {
                children.push($scope.dispositionList[i]);
              } else break;
            }

            // item above me has a hierarchy, so its part of a different sublist
            if (angular.isDefined($scope.dispositionList[nextIndex].hierarchy) && $scope.dispositionList[nextIndex].hierarchy.length) {
              for (var i = nextIndex - 1; i >= 0; i--) {
                if(angular.isDefined($scope.dispositionList[i].type)) {
                  nextIndex = i;
                  break;
                }
              }
            }

            children.forEach(function(item) {
              $scope.dispositionList.splice(nextIndex, 0, item);
              nextIndex++;
            });
            $scope.dispositionList.splice(originalIndex + children.length, children.length);
          }

          $scope.detailsForm.$setDirty();
          $scope.dropdown = -1;
        }
      };

      $scope.remove = function() {
        if (angular.isDefined($scope.selectedDispo)) {
          if(angular.isDefined($scope.selectedDispo.type)) {
            var idx = $scope.dispositionList.indexOf($scope.selectedDispo);
            for (var i = idx + 1; i < $scope.dispositionList.length; i++) {
              if (angular.isDefined($scope.dispositionList[i].type)) {
                break;
              }
              if (angular.isDefined($scope.dispositionList[i].hierarchy) && $scope.dispositionList[i].hierarchy.length === 1) {
                $scope.dispositionList[i].hierarchy.pop();
              }
            }
          }
          _.pull($scope.dispositionList, $scope.selectedDispo);
        }
        $scope.detailsForm.$setDirty();
        $scope.dropdown = -1;
      };

      $scope.dispoCheck = function(disposition) {
        return disposition.name === this.name;
      };

      // Have to do this in a timeout or dispositionList will be undefined
      $timeout($scope.init);

      $scope.$on('table:resource:selected', function() {
        $timeout($scope.init);
      });

      $scope.$on('table:resource:create', function() {
        $timeout($scope.init);
      });

    }]);
