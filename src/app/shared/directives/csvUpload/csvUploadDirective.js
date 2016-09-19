'use strict';

angular.module('liveopsConfigPanel')
  .directive('csvUpload', ['$timeout', '$state', '$translate', '$q', '$interval', '$document', '$compile', '$window', 'Alert', 'Session', 'Upload', 'apiHostname', 'Modal', 'CampaignCallListJobs', 'DncListJobs',
    function ($timeout, $state, $translate, $q, $interval, $document, $compile, $window, Alert, Session, Upload, apiHostname, Modal, CampaignCallListJobs, DncListJobs) {
      return {
        restrict: 'E',
        templateUrl: function (elem, attrs) {
          return attrs.templateUrl;
        },
        scope: {
          selectedRow: '=',
          downloadPath: '@',
          jobServiceName: '@'
        },
        link: function ($scope, elem, attr, ctrl) {
          var uploadStatus;
          var intervals = [];

          $scope.downloadCsv = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            var apiHostNameNoProtocol = apiHostname.slice(8);
            var userPw = window.atob(Session.token);
            userPw = userPw.split(':');
            userPw[0] = encodeURIComponent(userPw[0]);
            userPw[1] = encodeURIComponent(userPw[1]);
            userPw = userPw.join(':');
            $window.open('https://' +
              userPw + '@' +
              apiHostNameNoProtocol +
              '/v1/tenants/' +
              Session.tenant.tenantId +
              $scope.downloadPath, "_self");
          };


          $scope.displayData = function (val) {
            if (val || val === 0) {
              return true;
            }
          };

          function getJobId(uploadJobId) {
            var jobId;
            var jobList;

            // reset the UI to hide any error feedback
            $scope.selectedRow.latestJobData = {};
            $scope.uploadStatus = false;

            switch ($scope.jobServiceName) {
              case 'campaigns':
                jobList = CampaignCallListJobs.cachedGet({
                  tenantId: Session.tenant.tenantId,
                  campaignId: $scope.selectedRow.id
                });
                break;
              case 'dncLists':
                jobList = DncListJobs.cachedGet({
                  tenantId: Session.tenant.tenantId,
                  dncListId: $scope.selectedRow.id
                });
                break;
            };

            jobList.$promise.then(function (response) {
              $scope.loading = true;
              $scope.newlyUploaded = false;

              $scope.selectedRow.hasList = hasOne(jobList.jobs);
              if ($scope.selectedRow.hasList) {
                // if we're grabbing data directly after an upload, then
                // we need to let the polling function to display the upload
                // success or failure pop up
                if (uploadJobId) {
                  jobId = uploadJobId;
                  $scope.newlyUploaded = true;
                } else {
                  jobId = jobList.jobs[0];
                  $scope.newlyUploaded = false;
                }

                pollForUploadData(jobList, jobId);
              }
            });
          };

          function stopPolling() {
            angular.forEach(intervals, function (value, key) {
              $interval.cancel(intervals[key]);
            });

          };

          function hasOne(arr) {
            if (angular.isDefined(arr)) {
              if (arr.length > 0) {
                return true;
              } else {
                return false;
              }
            }
          };

          // function to handle API responses coming back in Clojure syntax
          function convertClojureToJs(str) {
            if (str) {
              if (str.indexOf(': {') !== -1) {
                return str.split(': {')[0];
              } else {
                return str;
              }
            } else {
                return $translate.instant('value.saveFail');
            };
          }

          function getJobData(jobId) {
            var deferredVal = $q.defer();
            switch ($scope.jobServiceName) {
              case 'campaigns':
                deferredVal.jobDataPromise = CampaignCallListJobs.cachedGet({
                  tenantId: Session.tenant.tenantId,
                  campaignId: $scope.selectedRow.id,
                  jobId: jobId
                });
                break;
              case 'dncLists':
                deferredVal.jobDataPromise = DncListJobs.cachedGet({
                  tenantId: Session.tenant.tenantId,
                  dncListId: $scope.selectedRow.id,
                  jobId: jobId
                });
                break;
            };

            return deferredVal.jobDataPromise;
          };

          function handleErrors(data, previousJobId) {
            // setting currentErrorMsg because we're going to quite possibly
            // grabbing the upload data from a past upload, but we want the
            // error message from THIS upload
            var currentErrorMsg = data.message;
            if (previousJobId) {
              // grab the complete data from the previous successful upload
              // and reset the UI to display those stats while also
              // displaying the error popup if this is error is happening
              // upon the initial upload of the file
              var prevJobData = getJobData(previousJobId);
              prevJobData.$promise.then(function (prevDataResponse) {
                $scope.selectedRow.latestJobData = prevDataResponse;
                if ($scope.newlyUploaded) {
                  Alert.error(convertClojureToJs(currentErrorMsg));
                }
                $q.when($scope.selectedRow.latestJobData).then(function () {
                  $scope.selectedRow.uploadStats = true;
                });
              });
            } else {
              // if we have no previous successful upload stats to fall back upon,
              // then just check if this is a new upload and if so display the error popup
              if ($scope.newlyUploaded) {
                Alert.error(convertClojureToJs(currentErrorMsg));
              };
              $scope.selectedRow.uploadStats = true;
            };
          };

          function pollForUploadData(jobList, jobId) {
            uploadStatus = $interval(function () {
              $scope.selectedRow.latestJobData = {};
              var lastJobData = getJobData(jobId);

              // get the complete data from the jobId
              if (lastJobData) {
                lastJobData.$promise.then(function (response) {
                  $scope.selectedRow.latestJobData = response;
                  if (response.status === 'error' || response.result === null || response.status === 'completed') {
                    if (response.status === 'error' || response.result === null) {
                      // if there was an error AND we have had a successful upload
                      // in the past, use the getPrevJobId() function to grab the
                      // data from the most recent successful upload
                      var prevId = getPrevJobId(jobList.jobs);
                      $q.when(prevId, function (prevIdResponse) {
                        handleErrors(response, prevIdResponse);
                      });
                    } else {
                      if ($scope.newlyUploaded) {
                        Alert.success($translate.instant('value.uploadProcessedSuccessfully'));
                      };
                      // possibly redundant code since we're about to stop the polling after
                      // this conditional statement, but this is more of a fail safe
                      stopPolling();
                      $scope.selectedRow.uploadStats = true;
                    };
                    // now that we have a final response, either success or error, stop polling
                    // and update the ui accordingly
                    stopPolling();
                    return;
                  } else {
                    // if the upload status is not either 'completed' or 'error',
                    // then it means it's still running, which means we need to keep polling
                    $scope.selectedRow.uploadStats = false;
                  };
                  // possibly redundant code, more of a fail safe
                  stopPolling();
                  $scope.selectedRow.uploadStats = true;
                  return;
                });

              }
            }, 1750);

            intervals.push(uploadStatus);
          };

          function getPrevJobId(list) {

            // grab the most upload data...
            var data = getJobData(list[0]);
            // the goal here it to return the most recent
            // *successful* upload stats
            if (data) {
              return data.$promise.then(function (response) {
                // check to see if that upload was successful, and if so
                // return that job ID
                if (_.find(response, {'status': 'completed'})) {
                  return response.jobId;
                } else {
                  // if it turns out this upload was not successful, then
                  // remove this job from the array and move on to the next one
                  // until we've gone through all of the jobs
                  if (list.length >= 1) {
                    list.shift();
                    return getPrevJobId(list);
                  } else {
                    return null;
                  };
                };
              });
            };

          };

          $scope.importFile = function (fileData) {
            var jobId;
            var importUrlPath;

            switch($scope.jobServiceName) {
              case 'campaigns':
                importUrlPath = '/campaigns/' + $scope.selectedRow.id + '/call-list';
                break;
              case 'dncLists':
                importUrlPath = '/dnclists/' + $scope.selectedRow.id + '/upload';
                break;
            }

            if (fileData) {
              $scope.selectedRow.uploadStats = false;
              var upload = Upload.upload({
                headers: {
                  'Content-Type': 'multipart/form-data'
                },
                url: apiHostname + '/v1/tenants/' + Session.tenant.tenantId + importUrlPath,
                method: 'POST',
                file: fileData
              });

              upload.then(function (response) {
                $scope.selectedRow.hasList = true;
                jobId = response.data.result.jobId;
                getJobId(jobId);
                Alert.success($translate.instant('value.uploadSuccess'));
              }, function (err) {
                Alert.error($translate.instant('value.uploadFail'));
              });

              return upload;
            };
          };

          $scope.openStatsModal = function () {
            var newScope = $scope.$new();
            newScope.modalBody = 'app/shared/directives/csvUpload/stats.modal.html';
            newScope.title = 'Stats';

            newScope.cancelCallback = function () {
              $scope.showDispoDNC = false;
              $document.find('modal').remove();
            };

            var element = $compile('<modal></modal>')(newScope);
            $document.find('html > body').append(element);
          };

          // kill the search for jobs if we've left the page
          $scope.$on('$stateChangeStart', function () {
            stopPolling();
          });

          $scope.$watch('selectedRow', function(newRowData) {
            // get the jobs and download lists...
            // unless, of course, it's a new campaign and neither exist
            $q.when(newRowData, function (response) {
              stopPolling();

              if (newRowData && angular.isFunction($scope.selectedRow.isNew)) {
                if (!$scope.selectedRow.isNew()) {
                  $scope.selectedRow.uploadStats = false;
                  $scope.downloadPath = $scope.downloadPath;
                  $scope.jobServiceName = $scope.jobServiceName;
                  getJobId();
                };
              };
            });
          });
        }
      };
    }
  ]);
