'use strict';

angular.module('liveopsConfigPanel')
  .directive('contactLayout', ['$timeout', 'loEvents', 'ContactAttribute', 'Session', '$templateRequest', '$compile',
    function ($timeout, loEvents, ContactAttribute, Session, $templateRequest, $compile) {
      return {
        restrict: 'E',
        scope: {
          model: '=',
          form: '='
        },
        link: function(scope, element) {

          scope.sortableListsOptions = {
            cursor: 'move'
          };

          scope.sortableAttributesOptions = {
            placeholder: 'attr-placeholder',
            connectWith: '.connectedSortable',
            cursor: 'move'
          };

          scope.fetchAttributes = function() {
            return ContactAttribute.cachedQuery({
              tenantId: Session.tenant.tenantId
            });
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


          scope.$watch('model', function(model, oldModel) {
            // don't set the form dirty from the changes that happen when the model first loads
            if (oldModel === undefined || !oldModel.length) {
              return;
            }
            if (typeof oldModel[0].attributes[0] !== 'string') {
              scope.form.$setDirty();
            }
          }, true);

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
              return scope.fetchAttributes().$promise.then(function(allAttributes) {
                scope.model.forEach(function(category) {
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
