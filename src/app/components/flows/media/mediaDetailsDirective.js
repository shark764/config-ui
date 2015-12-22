'use strict';

angular.module('liveopsConfigPanel')
  .directive('loMediaDetails', ['mediaTypes', 'Session', 'apiHostname', 'Upload',
    function(mediaTypes, Session, apiHostname, Upload) {
      return {
        restrict: 'E',
        controller: function($scope) {
          $scope.mediaTypes = mediaTypes;

          this.onSelect = function() {
            delete $scope.selectedMedia.source;
            $scope.forms.mediaForm.audiosourcefile.$setDirty();
          };

          this.submit = function() {
            if ($scope.forms.mediaForm.audiosourcefile.$dirty) {
              var upload = Upload.upload({
                headers: {
                  'Content-Type': 'multipart/form-data'
                },
                url: apiHostname + '/v1/tenants/' + Session.tenant.tenantId + '/media/upload',
                method: 'POST',
                file: $scope.selectedMedia.$sourceAudioFile
              });

              upload.then(function(response) {
                $scope.selectedMedia.source = response.data.result.url;
                return $scope.selectedMedia.save();
              });

              return upload;
            } else {
              return $scope.selectedMedia.save();
            }
          };

          $scope.$watch('selectedMedia.source', function(source) {
            if (source) {
              delete $scope.selectedMedia.$sourceAudioFile;
              $scope.forms.mediaForm.audiosourcefile.$setPristine();
              $scope.forms.mediaForm.audiosourcefile.$setUntouched();
            }
          });
        },
        link: function($scope, elem, attrs, controller) {
          if (attrs.name) {
            $scope[attrs.name] = controller;
          }
        }
      };
    }
  ]);
