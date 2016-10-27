'use strict';

angular.module('liveopsConfigPanel')
  .directive('loMediaDetails', ['$rootScope', '$location', '$translate', '$timeout', '$state', '$q', 'Alert', 'Media', 'mediaTypes', 'Session', 'apiHostname', 'Upload',
    function ($rootScope, $location, $translate, $timeout, $state, $q, Alert, Media, mediaTypes, Session, apiHostname, Upload) {
      return {
        restrict: 'AE',
        controller: function ($scope) {
          $scope.bypassReset = false;
          var MediaSvc = new Media();

          // get the list of media types, with an optional argument of excludeArr,
          // which is a list of string values for media types to leave out of this
          // list, which is showing up as a dropdown in the media panels
          $scope.getMediaTypes = function (excludeArr) {
            if (excludeArr) {
              return _.filter(mediaTypes, function (val) {
                return excludeArr.indexOf(val.value) === -1;
              });
            } else {
              return mediaTypes;
            }
          }

          // clears out URL params so that we don't lose the
          // right panel if we're creating a brand new media list
          function removeUrlParams() {
            if (!$scope.selectedMedia.id) {
              $location.url($location.path());
            }
          }

          function resetMediaTableSourceNames (form) {
            // If we're not saving from the first media panel, then
            // reset the media names in the media page table
            if (form.$name === 'forms.mediaForm') {
              var allMedia = Media.cachedQuery({
                tenantId: Session.tenant.tenantId
              });

              $q.when(allMedia.$promise).then(function (response) {
                $scope.medias = response;
                MediaSvc.getListSourceName($scope.medias);
              });
            }
          };

          function saveMediaList(model, form, addNew) {
            // create an array of the media item ids
            var mediaSrcIdArr = _.map(model.source, function (item) {
              return item.id;
            });

            // copy the 2nd media panel's data object to a temp variable
            var mediaObjArr = model.source;

            // set the source to be the array of ID's we just created
            model.source = mediaSrcIdArr;

            saveMedia(model, addNew, mediaObjArr, form);
          };

          function saveMedia(model, saveNew, responseData, form) {
            // delete this property off the selectedMedia scope, since
            // the secondScope property is only being used for temporary storage
            // of the 2nd media panel's data, and will break the API if submitted
            if (model.hasOwnProperty('secondScope')) {
              delete model.secondScope;
            }

            // this is a specific condition to give us the URL of an audio file
            if (responseData && responseData.hasOwnProperty('data')) {
              model.source = responseData.data.result.url;
            }

            return model.save({
              restoreBackup: false
            }, function (response) {
              Alert.success($translate.instant('value.saveSuccess'));
              $scope.duplicateError = false;
            }, function (err) {
              Alert.error($translate.instant('value.saveFail'));
              if (err.data.error.attribute.name) {
                $scope.duplicateError = true;
                $scope.duplicateErrorMessage = err.data.error.attribute.name.capitalize();
                Alert.error($translate.instant('media.details.duplicate.error'));
                model.name = null;
              }
            }).then(function (savedMedia) {
              // update the user-friendly media list item names in the table
              resetMediaTableSourceNames(form);

              $scope.bypassReset = true;
              if (model.type === 'list') {
                // now that we've saved the media object with its source as an array,
                // copy the array of objects back into the model.source so as to properly
                // poplate the markup on the page
                model.source = responseData;
              }
              if (saveNew === true) {
                // create a new media item in the place of the one we just created
                $scope.$emit('resource:details:create:Media', savedMedia);
                removeUrlParams();
              } else {
                $timeout(function () {
                  if (!$scope.showSecondPanel && $state.current.name === 'content.flows.media') {
                    $scope.forms.mediaForm.$setPristine();
                  }
                  $scope.closeAddlPanel(false, form, true);
                });
              }
            });
          }

          this.submit = function (model, form, addNew) {
            // putting in defaults in case the media panel is used in
            // other parts of the application where submit function
            // does not have the model and form arguments
            var model = model || $scope.selectedMedia;
            var form = form || $scope.forms.mediaForm;

            if (model.type === 'list') {
              // special behavior for saving media lists
              saveMediaList(model, form, addNew);
              return;
            }

            if (form.audiosourcefile.$dirty) {
              // first clear out any properties that may have been left over if the user
              // had previously selected another media type before saving
              model.properties = {};

              return Upload.upload({
                headers: {
                  'Content-Type': 'multipart/form-data'
                },
                url: apiHostname + '/v1/tenants/' + Session.tenant.tenantId + '/media/upload',
                method: 'POST',
                file: model.$sourceAudioFile
              }).then(function (response) {
                saveMedia(model, addNew, response, form)
              });
            } else {
              saveMedia(model, addNew, null, form);
            }
          };

          this.onSelect = function (form) {
            // adding conditional so that we replace the audiosourcefile value on
            // the appropriate form
            if (form.$name !== 'forms.mediaForm') {
              $scope.$emit('deleteAudio');
            } else {
              delete $scope.selectedMedia.source;
            }

            form.audiosourcefile.$setDirty();
          };

          $scope.closeAddlPanel = function (saveNew, form, isSaving) {
            // if this is the second media panel which appears when a media list
            // is being created, close and wipe out the data from the second panel
            if ($scope.selectedMedia && $scope.selectedMedia.secondScope) {
              $scope.selectedMedia.secondScope = null;
              $scope.forms.mediaFormAddl.$setPristine();
              $scope.showSecondPanel = false;
              removeUrlParams();
            } else {
              // otherwise, if we are NOT on the media page and aren't looking to
              // create a new media item in the first media panel, close that first
              // media panel
              if (!saveNew && $state.current.name !== 'content.flows.media') {
                $scope.selectedMedia = null;
              }
            }

            // here's where we provide the rest of the application what it needs in order
            // to properly set any visible forms
            $rootScope.$emit('closeAddlPanel', {
              data: {
                stateName: $state.current.name,
                isSaving: isSaving || false,
                formName: form ? form.$name : null
              }
            });
          };

          // the following two watches prevent the audiosourcefile from getting placed
          // inside a media item where it doesn't belong
          $scope.$watch('selectedMedia.source', function (source) {
            if (source) {
              delete $scope.selectedMedia.$sourceAudioFile;
              if ($scope.forms.mediaForm.audiosourcefile) {
                $scope.forms.mediaForm.audiosourcefile.$setPristine();
                $scope.forms.mediaForm.audiosourcefile.$setUntouched();
              }
            }
          });

          $scope.$watch('selectedMedia.secondScope.source', function (source) {
            if (source) {
              delete $scope.selectedMedia.secondScope.$sourceAudioFile;
              if ($scope.forms.mediaFormAddl.audiosourcefile) {
                $scope.forms.mediaFormAddl.audiosourcefile.$setPristine();
                $scope.forms.mediaFormAddl.audiosourcefile.$setUntouched();
              }
            }
          });
        },
        link: function ($scope, elem, attrs, controller) {
          if (attrs.name) {
            $scope[attrs.name] = controller;
          }
        }
      };
    }
  ]);
