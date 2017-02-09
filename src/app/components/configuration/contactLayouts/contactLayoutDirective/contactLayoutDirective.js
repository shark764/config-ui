'use strict';

angular.module('liveopsConfigPanel')
  .directive('contactLayout', ['$timeout', 'loEvents', 'ContactAttribute', 'Session', '$templateRequest', '$compile', 'UserPermissions',
    function ($timeout, loEvents, ContactAttribute, Session, $templateRequest, $compile, UserPermissions) {
      return {
        restrict: 'E',
        scope: {
          model: '=',
          form: '=',
          attributes: '='
        },
        link: function(scope, element) {

          scope.requiredAttributes = function() {
            // Attributes are strings when first receieved from the API and immediately
            // on submit. Don't flash the error message when the attributes are strings.
            if (scope.model[0] && typeof scope.model[0].attributes[0] === 'string') {
              return;
            }

            return scope.attributes.filter(function(attr) {
              return attr.mandatory;
            }).filter(function(attr) {
              var notFound = true;
              if (scope.model) {
                scope.model.forEach(function(category) {
                  if (Array.isArray(category.attributes)) {
                    category.attributes.forEach(function(existingAttribute) {
                      if (existingAttribute && existingAttribute.id === attr.id) {
                        notFound = false;
                      }
                    });
                  }
                });
              }
              return notFound;
            }).map(function(attr) {
              return attr.objectName;
            }).join(', ');
          };

          scope.sortableListsOptions = {
            cursor: 'move',
            disabled: !UserPermissions.hasPermissionInList(['CONTACTS_LAYOUTS_UPDATE'])
          };

          scope.sortableAttributesOptions = {
            placeholder: 'attr-placeholder',
            connectWith: '.connectedSortable',
            cursor: 'move',
            disabled: !UserPermissions.hasPermissionInList(['CONTACTS_LAYOUTS_UPDATE'])
          };

          scope.addCategory = function() {
            scope.model.push({
              label: {
                'en-US': ''
              },
              attributes: []
            });
          };

          scope.removeCategory = function(listIdx) {
            scope.model.splice(listIdx, 1);
          };


          scope.onSelect = function(list) {
            return function(item, idx) {
              if (item !== null) {
                list.attributes[idx] = item;
              }
            };
          };

          scope.addAttribute = function(listIdx) {
            scope.model[listIdx].attributes.push(null);
          };

          scope.removeAttribute = function(list, idx) {
            list.attributes.splice(idx, 1);
          };

          scope.hasMandatoryAttributes = function(list) {
            return list.attributes.filter(function(attribute) {
              if (attribute) {
                return attribute.mandatory;
              }
            }).length;
          };

          scope.$watch('model', function(model, oldModel) {
            // don't set the form dirty from the changes that happen when the model first loads
            if (oldModel === undefined || !oldModel.length) {
              return;
            }
            if (typeof oldModel[0].attributes[0] !== 'string') {
              scope.form.$setDirty();
            }
          }, true);

          scope.$watch(scope.requiredAttributes, function(newVal) {
            if (newVal) {
              scope.form.$setValidity('missingAttributes', !newVal.length);
            }
          });

          scope.$on(loEvents.tableControls.itemSelected, waitBeforeInit);
          scope.$on(loEvents.tableControls.itemCreate, waitBeforeInit);
          scope.$on(loEvents.resource.updated, waitBeforeInit);

          compileTemplate(false);
          init(scope.model);

          function waitBeforeInit() {
            scope.loading = true;
            $timeout(function() {
              init();
              compileTemplate(true);
            }, 0);
          }

          function compileTemplate(watch) {
            $templateRequest('app/components/configuration/contactLayouts/contactLayoutDirective/contactLayout.html').then(function (html) {
              // execute slightly different code if we're compiling based on a $watch
              var template;
              if (watch) {
                var htmlTemp = html;
                template = angular.element(htmlTemp);
              } else {
                template = angular.element(html);
                element.append(template);
              }

              $compile(template)(scope);
              scope.form.$setPristine();
            });
          }

          function init() {
            if (scope.model) {
              return scope.attributes.$promise.then(function(allAttributes) {
                scope.model.forEach(function(category) {
                  if (category.attributes.$$state) {
                    category.attributes = category.attributes.$$state.value;
                    return;
                  }
                  category.attributes.forEach(function(attribute, idx) {
                    category.attributes[idx] = allAttributes.filter(function(attr) {
                      return attr.id === attribute;
                    })[0];
                  });
                });
                scope.loading = false;
              });
            }
          }
        }
      };
    }
  ]);
