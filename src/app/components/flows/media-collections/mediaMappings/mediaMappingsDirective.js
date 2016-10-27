'use strict';

angular.module('liveopsConfigPanel')
  .directive('mediaMappings', ['$timeout', 'Media', 'Session',
    function ($timeout, Media, Session) {
      return {
        restrict: 'E',
        scope: {
          form: '=',
          collection: '=',
          bypassMultipicker: '='
        },
        templateUrl: 'app/components/flows/media-collections/mediaMappings/mediaMappings.html',
        link: function (scope, element) {
          scope.fetchMedias = function () {
            return Media.cachedQuery({
              tenantId: Session.tenant.tenantId
            });
          };

          // this was the least painful way to keep track of the media panel being
          // open or closed, otherwise I'd have to add even more emits and twisted
          // logic to keep track of everything
          var mediaPanel = document.getElementById('media-pane');
          var observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
              if (angular.element(mutation.target).hasClass('ng-hide') !== true) {
                scope.mediaPaneOpen = true;
                scope.bypassMultipicker = false;
              } else {
                scope.mediaPaneOpen = false;
              };
              scope.$apply();
            });
          });

          observer.observe(mediaPanel, {
            attributes: true,
            characterData: true
          });

          scope.addMapping = function () {
            if (scope.bypassMultipicker !== true) {
              if (scope.collection.mediaMap) {
                scope.collection.mediaMap.push({});
              } else {
                scope.collection.mediaMap = [{}];
              }
            }
          };

          scope.removeMapping = function (index) {
            if (scope.collection.mediaMap[index].lookup === scope.collection.defaultMediaKey) {
              scope.collection.defaultMediaKey = null;
            }

            scope.collection.mediaMap.splice(index, 1);
            if (scope.collection.mediaMap.length === 0) {
              delete scope.collection.mediaMap;
              delete scope.collection.defaultMediaKey;
            }

            scope.form.mediaMap.$setDirty();
            scope.form.mediaMap.$setTouched();
          };

          scope.resetDefaultMediaKey = function () {
            scope.collection.defaultMediaKey = null;
            scope.form.defaultMediaKey.$setDirty();
            scope.form.defaultMediaKey.$setTouched();
          };

          scope.onSelect = function (mediaMap) {
            return function (media) {
              if (media) {
                mediaMap.id = media.id;

                scope.form.mediaMap.$setDirty();
                scope.form.mediaMap.$setTouched();
              }
            };
          };

          scope.initMapping = function (mediaMap) {
            if (!mediaMap.id) {
              return;
            }

            return scope.fetchMedias().$promise.then(function (medias) {
              for (var mediaIndex in medias) {
                if (mediaMap.id === medias[mediaIndex].id) {
                  mediaMap.$media = medias[mediaIndex];
                  break;
                }
              }
              $timeout(function () {
                scope.form.$setPristine();
              });
            });
          };
        }
      };
    }
  ]);
