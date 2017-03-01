'use strict';

angular.module('liveopsConfigPanel')
    .controller('listEditorController', ['$scope', '$timeout', '$translate', '_', 'Disposition', 'Reason', 'Session', function($scope, $timeout, $translate, _, Disposition, Reason, Session) {

      // $scope.dispositionList is used all over this controller, here is the shorthand reference
      var list, i;

      // Originally written for disposition lists, then realized the same controls were needed for reason lists....so the variable names are dispo centric
      $scope.init = function() {
        $scope.dropdown = -1;
        list = $scope.dispositionList;

        if ($scope.type === 'dispositions') {
          $scope.possibleDispos = Disposition.query({
            tenantId: Session.tenant.tenantId
          });
          $scope.possibleDispos.$promise.then(function(dispos) {
            $scope.possibleDispos = dispos.filter(function(possibleDispo) {
              var found = false;
              if ($scope.dispositionList) {
                $scope.dispositionList.forEach(function(dispo) {
                  if (dispo.dispositionId === possibleDispo.id || dispo.reasonId === possibleDispo.id) {
                    found = true;
                  }
                });
              }

              return !found;
            }).sort(function(a, b) {
              var A = a.name.toLowerCase();
              var B = b.name.toLowerCase();
              if (A < B) {
                return -1;
              }
              if (A > B) {
                return 1;
              }
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
              if ($scope.dispositionList) {
                $scope.dispositionList.forEach(function(reason) {
                  if (reason.reasonId === possibleReason.id) {
                    found = true;
                  }
                });
              }

              return !found;
            }).sort(function(a, b) {
              var A = a.name.toLowerCase();
              var B = b.name.toLowerCase();
              if (A < B) {
                return -1;
              }
              if (A > B) {
                return 1;
              }
              return 0;
            });
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
        // category is given a random id, so that track by dispo.id doesn't break on categories
        var idx;
        var newCategory = {name: 'Enter a category name', type:'category', id: Math.random()};
        list.push(newCategory);
        $scope.selectedDispo = _.last(list);
        $scope.dropdown = -1;
        $scope.detailsForm.$setDirty();
        idx = list.indexOf(newCategory);
        $timeout(function() {
          document.getElementById('category-' + idx).focus();
        }, 0);
        $scope.$watch(function() {
          return newCategory.name;
        }, function(newVal, oldVal) {
          list.forEach(function(dispo) {
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
          var index = list.indexOf($scope.selectedDispo);
          for (var i = index; i >= 0; i--) {
            if (list[i].type === 'category') {
              $scope.selectedDispo.hierarchy.push(list[i].name);

              // splice item into list right below last hierarchy item, or else run the risk of having non demoted items between our item and the header
              for (var j = i + 1; j < list.length; j++) {
                if ((angular.isDefined(list[j].hierarchy) && list[j].hierarchy.length === 0) || list[j].type === 'category' || list[j] === $scope.selectedDispo) {
                  list.splice(j, 0, $scope.selectedDispo);
                  list.splice(index+1, 1);
                  $scope.dropdown = -1;
                  $scope.detailsForm.$setDirty();
                  return;
                }
              }
            }
          }
          $scope.dropdown = -1;
          $scope.detailsForm.$setDirty();
        }
      };

      $scope.promote = function() {
        // IF the disposition we're promoting has other 'siblings', we'll want to move the selectedDispo to after them
        var originalIndex = list.indexOf($scope.selectedDispo);
        var nextIndex = originalIndex + 1;
        if (angular.isDefined(list[nextIndex]) && (angular.isDefined(list[nextIndex].hierarchy) && list[nextIndex].hierarchy[0] === $scope.selectedDispo.hierarchy[0])) {
          for (var i = nextIndex; i < list.length; i++) {
            if (angular.isDefined(list[i].hierarchy) && list[i].hierarchy[0] === $scope.selectedDispo.hierarchy[0]) {
              nextIndex = i;
            } else {
              break;
            }
          }
          list.splice(nextIndex + 1, 0, $scope.selectedDispo);
          list.splice(originalIndex, 1);
        }

        $scope.selectedDispo.hierarchy.pop();
        $scope.dropdown = -1;
        $scope.detailsForm.$setDirty();
      };

      $scope.selectDisposition = function(index) {
        $scope.selectedDispo = $scope.dispositionList[index];
        $scope.dropdown = -1;
      };

      $scope.dispoTracker = function(dispo) {
        if (angular.isDefined(dispo.id)) {
          return dispo.id;
        } else if (angular.isDefined(dispo.reasonId)) {
          return dispo.reasonId;
        } else {
          return null;
        }
      };

      $scope.selectNewDispo = function(dropdownId) {
        var listIndex = list.indexOf($scope.selectedDispo);
        var dropdownIndex = _.findIndex($scope.possibleDispos, function(item) {
          return item.id === dropdownId || item.reasonId === dropdownId;
        });

        if ($scope.selectedDispo.name.slice(0, 8) !== 'Select a') {
          $scope.possibleDispos.push($scope.selectedDispo);
        }

        list[listIndex] = $scope.possibleDispos[dropdownIndex];

        if (angular.isDefined(list[listIndex].id)) {
          list[listIndex][$scope.type.slice(0, -1) + 'Id'] = list[listIndex].id;
        }
        list[listIndex].sortOrder = listIndex;
        list[listIndex].hierarchy = $scope.selectedDispo.hierarchy;

        delete list[listIndex].created;
        delete list[listIndex].createdBy;
        delete list[listIndex].updated;
        delete list[listIndex].updatedBy;
        delete list[listIndex].id;

        $scope.possibleDispos.splice(dropdownIndex, 1);

        $scope.possibleDispos.sort(function(a, b) {
          var A = a.name.toLowerCase();
          var B = b.name.toLowerCase();
          if (A < B) {
            return -1;
          }
          if (A > B) {
            return 1;
          }
          return 0;
        });

        $scope.selectedDispo = list[listIndex];
        $scope.dropdown = -1;
        $scope.detailsForm.$setDirty();
      };

      $scope.moveDown = function () {
        // If no item is selected, do nothing
        if (angular.isDefined($scope.selectedDispo)) {
          var originalIndex = list.indexOf($scope.selectedDispo);
          var nextIndex = originalIndex + 1;

          // If already at the bottom of the list, do nothing.
          if (nextIndex === list.length) {
            return;
          }

          if (angular.isDefined($scope.selectedDispo.hierarchy)) {
            // SELECTED ITEM IS AN ITEM
            if (list[nextIndex].hierarchy) {
              // if next item is item, just swap them, unless the hierarchies are different, in which case do nothing, we are at the bottom of the sublist
              if (list[nextIndex].hierarchy.length === $scope.selectedDispo.hierarchy.length) {
                list.splice(nextIndex + 1, 0, $scope.selectedDispo);
                list.splice(originalIndex, 1);
              }
            } else {
              // if next item is category, move to after the last children (either next category or first differing hierarchy)
              // UNLESS THIS IS PART OF ANOTHER SUBLIST
              if ($scope.selectedDispo.hierarchy.length > 0) {
                return;
              }
              //edge case :(
              if (nextIndex + 1 === list.length) {
                nextIndex++;
              }
              for (i = nextIndex + 1; i < list.length; i++) {
                if (angular.isDefined(list[i].type) || $scope.selectedDispo.hierarchy[0] === list[i].hierarchy[0]) {
                  nextIndex = i;
                  break;
                }
                // if the last item is a sublist item, then we need to force the splice to happen at the end of the disposition list
                if (i + 1 === list.length) {
                  nextIndex = i + 1;
                }
              }
              list.splice(nextIndex, 0, $scope.selectedDispo);
              list.splice(originalIndex, 1);
            }
          } else {
            // SELECTED ITEM IS A CATEGORY
            // gather children into a unit and treat them as a single item
            var children = [$scope.selectedDispo];
            for (i = originalIndex + 1; i < list.length; i++) {
              nextIndex = i;
              if (angular.isDefined(list[i].hierarchy) && list[i].hierarchy[0] === $scope.selectedDispo.name) {
                children.push(list[i]);
              } else {
                break;
              }
            }

            if (list[nextIndex].type) {
              for (i = nextIndex + 1; i < list.length; i++) {
                if (!angular.isDefined(list[i].hierarchy) || !list[i].hierarchy.length) {
                  break;
                }
                nextIndex = i;
              }
            }

            children.forEach(function(item) {
              nextIndex++;
              list.splice(nextIndex, 0, item);
            });
            list.splice(originalIndex, children.length);
          }

          $scope.detailsForm.$setDirty();
          $scope.dropdown = -1;
        }
      };

      $scope.moveUp = function() {
        // If no item is selected, do nothing
        if (angular.isDefined($scope.selectedDispo)) {
          var originalIndex = list.indexOf($scope.selectedDispo);
          var nextIndex = originalIndex - 1;

          // If already at the top of the list, do nothing.
          if (nextIndex === -1) {
            return;
          }

          if (angular.isDefined($scope.selectedDispo.hierarchy)) {
            // SELECTED ITEM IS AN ITEM
            if ($scope.selectedDispo.hierarchy.length > 0 && angular.isDefined(list[nextIndex].type)) {
              return;
            }
            if (angular.isDefined(list[nextIndex].hierarchy) && list[nextIndex].hierarchy[0] !== $scope.selectedDispo.hierarchy[0]) {
              for (i = nextIndex - 1; i >= 0; i--) {
                if (angular.isDefined(list[i].type)) {
                  nextIndex = i;
                  break;
                }
              }
            }
            list.splice(originalIndex, 1);
            list.splice(nextIndex, 0, $scope.selectedDispo);

          } else {
            // SELECTED ITEM IS A CATEGORY
            // gather children into a unit and treat them as a single item
            var children = [$scope.selectedDispo];
            for (i = originalIndex + 1; i < list.length; i++) {
              if (angular.isDefined(list[i].hierarchy) && list[i].hierarchy[0] === $scope.selectedDispo.name) {
                children.push(list[i]);
              } else {
                break;
              }
            }

            // item above me has a hierarchy, so its part of a different sublist
            if (angular.isDefined(list[nextIndex].hierarchy) && list[nextIndex].hierarchy.length) {
              for (i = nextIndex - 1; i >= 0; i--) {
                if(angular.isDefined(list[i].type)) {
                  nextIndex = i;
                  break;
                }
              }
            }

            children.forEach(function(item) {
              list.splice(nextIndex, 0, item);
              nextIndex++;
            });
            list.splice(originalIndex + children.length, children.length);
          }

          $scope.detailsForm.$setDirty();
          $scope.dropdown = -1;
        }
      };

      $scope.remove = function() {
        if (angular.isDefined($scope.selectedDispo)) {
          if(angular.isDefined($scope.selectedDispo.type)) {
            var idx = list.indexOf($scope.selectedDispo);
            for (var i = idx + 1; i < list.length; i++) {
              if (angular.isDefined(list[i].type)) {
                break;
              }
              if (angular.isDefined(list[i].hierarchy) && list[i].hierarchy.length === 1) {
                list[i].hierarchy.pop();
              }
            }
          }

          if ($scope.selectedDispo.name.slice(0, 8) !== 'Select a') {
            $scope.possibleDispos.push($scope.selectedDispo);
          }

          $scope.possibleDispos.sort(function(a, b) {
            var A = a.name.toLowerCase();
            var B = b.name.toLowerCase();
            if (A < B) {
              return -1;
            }
            if (A > B) {
              return 1;
            }
            return 0;
          });

          _.pull(list, $scope.selectedDispo);
        }
        $scope.detailsForm.$setDirty();
        $scope.dropdown = -1;
      };

      $scope.dispoCheck = function(disposition) {
        return disposition.name === this.name;
      };

      $scope.emptyListMessage = function() {
        var type = $scope.type.slice(0, -1);
        return $translate.instant('list.details.emptyList', {listTypeCapitalize: type.capitalize(), listType: type});
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
