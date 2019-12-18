'use strict';

angular.module('liveopsConfigPanel')
  .directive('mediaLists', ['$timeout', '$templateRequest', '$compile', '$translate', '$rootScope', 'loEvents', 'Media', 'Session',
    function ($timeout, $templateRequest, $compile, $translate, $rootScope, loEvents, Media, Session) {
      return {
        restrict: 'E',
        scope: {
          list: '=',
          form: '=',
          media: '=',
          bypassReset: '='
        },
        link: function (scope, element) {
          var selectedId;

          compileTemplate(false);

          function compileTemplate(watch) {
            $templateRequest('app/components/flows/media/mediaLists/mediaLists.html').then(function (html) {
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
              $timeout(function () {
                // make sure that a form exists, and if it does, that we
                // haven't opted to bypass the resetting of the form,
                // which is useful when saving from another panel
                if (scope.form && scope.bypassReset !== true) {
                  scope.form.$setPristine();
                  scope.form.$setUntouched();
                  scope.bypassReset = false;
                }
              });
            });
          }

          // Test if sources list is undefined or isn't a valid object
          if (!scope.list.source || typeof scope.list.source !== 'object') {
            scope.addBtnEnabled = false;
            scope.list.source = [''];
          } else {
            scope.addBtnEnabled = true;
          }

          function setAddBtn(mediaList, removal) {
            if (mediaList.length > 0) {
              _.forEach(mediaList, function (val) {
                if (angular.isUndefined(val) || _.isEmpty(val) && mediaList.length > 0) {
                  scope.addBtnEnabled = false;
                } else {
                  scope.addBtnEnabled = true;
                }
              });
            } else {
              if (removal) {
                delete scope.list.source;
                scope.addBtnEnabled = true;
              }
            }
          }

          scope.fetchMedias = function () {
            return Media.cachedQuery({
              tenantId: Session.tenant.tenantId
            });
          };

          function listMedias() {
            if (scope.list.source) {
              scope.list.source.forEach(function (listItem, idx, list) {
                if (typeof listItem === 'string') {
                  list[idx] = scope.media.filter(function (item) {
                    return item.id === listItem;
                  })[0];
                }
              });
            }
          }

          scope.addListItem = function () {
            if (scope.addBtnEnabled) {
              if (scope.list.source) {
                scope.list.source.push({});
                scope.addBtnEnabled = false;
              } else {
                scope.list.source = [{}];
              }
            } else {
              return false;
            }
          };

          scope.removeMediaItem = function (index) {
            // to prevent bugs, prevent removal of item while 2nd panel is open
            if (scope.list.secondScope && scope.list.secondScope.hasOwnProperty('type') === true) {
              return;
            }

            var tempList = scope.list;
            scope.list.source.splice(index, 1);
            _.forEach(tempList.source, function (val, key) {
              if (val === undefined || _.isEmpty(val) && tempList.source.length > 0) {
                if (key === (tempList.source.length - 1)) {
                  scope.list.source.splice(key, 1);
                } else {
                  delete scope.list.source[key];
                }
              }
            });

            setAddBtn(scope.list.source, true);
            scope.form.source.$setDirty();
          };

          scope.onSelect = function (mediaList) {
            return function (media, index) {

              // if a selection has been made, add the media id to the media list
              if (angular.isDefined(media) && media !== null) {
                scope.list.source[index] = media.id;
                // now give us the entire list of available media items
                listMedias();

                if (scope.form.source) {
                  scope.form.source.$setDirty();
                  scope.form.source.$setTouched();
                }
              }
              setAddBtn(scope.list.source);
            };
          };

          $rootScope.$on('closeAddlPanel', function () {
            setAddBtn(scope.list.source);
          });

          scope.$on('multipickerClicked', function (clickData) {
            if (clickData.targetScope.selectedItem) {
              // we need to capture this just to tell the onItemSelect
              // function not to change the add button status if nothing
              // was selected during the course of that function's execution
              selectedId = clickData.targetScope.selectedItem.id;
            }
          });

          scope.initMediaList = function (mediaList) {
            return scope.fetchMedias().$promise.then(function (medias) {
              // here is where we set the array that will supply the multibox with
              // an array of medias EXCLUDING media lists
              scope.mediaListObjs = _.filter(medias, function (media) {
                return media.type !== 'list';
              });

              for (var mediaIndex in medias) {
                if (mediaList.id === medias[mediaIndex].id) {
                  mediaList.$media = medias[mediaIndex];
                  break;
                }
              }

              listMedias();
            });
          };

          scope.$on(loEvents.tableControls.itemSelected, function () {
            compileTemplate(true);
          });
        }
      };
    }
  ]);
