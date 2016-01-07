'use strict';

angular.module('liveopsConfigPanel')
  .service('recordingsTableConfig', ['$translate', 'UserPermissions', 'helpDocsHostname',
    function ($translate, UserPermissions, helpDocsHostname) {
      return {
        'fields': [{
          'name': 'play',
          'transclude': true
        }, {
          'header': {
            'display': $translate.instant('value.name')
          },
          'name': '$original.name'
        }, {
          'header': {
            'display': $translate.instant('recordings.table.datetime')
          },
          'name': '$interaction.startTime'
        }, {
          'header': {
            'display': $translate.instant('recordings.table.flag')
          },
          'name': '$original.reviewNeeded'
        }, {
          'header': {
            'display': $translate.instant('recordings.table.note')
          },
          'name': '$original.reviewReason'
        }, {
          'header': {
            'display': $translate.instant('recordings.table.resources')
          },
          'name': 'resources',
          'resolve': function(recording) {
            var names = [];
            for(var participantIndex = 0; participantIndex < recording.participants.length; participantIndex++) {
              var participant = recording.participants[participantIndex];
              if(participant.type === 'resource') {
                names.push('test name');
                // names.push(participant.name);
              }
            }
            return names.join();
          }
        }, {
          'header': {
            'display': $translate.instant('recordings.table.emails')
          },
          'resolve': function(recording) {
            var names = [];
            for(var participantIndex = 0; participantIndex < recording.participants.length; participantIndex++) {
              var participant = recording.participants[participantIndex];
              if(participant.type === 'resource') {
                names.push('test@liveops.com');
                // names.push(participant.email);
              }
            }
            return names.join();
          }
        }, {
          'header': {
            'display': $translate.instant('recordings.table.extensions')
          },
          'resolve': function(recording) {
            var names = [];
            for(var participantIndex = 0; participantIndex < recording.participants.length; participantIndex++) {
              var participant = recording.participants[participantIndex];
              names.push(participant.extension);
            }
            return names.join();
          }
        }, {
          'header': {
            'display': $translate.instant('recordings.table.flow')
          },
          'name': '$interaction.flowId'
        }, {
          'header': {
            'display': $translate.instant('recordings.table.callerani')
          },
          'name': '$interaction.customer'
        }],
        'showSearch': false,
        'orderBy': '$original.name',
        'title': $translate.instant('recordings.table.title'),
        'sref': 'content.recordings.recording',
        'showBulkActions': UserPermissions.hasPermission('MANAGE_ALL_RECORDINGS'),
        'showCreate': false //,
          //'helpLink' : helpDocsHostname + '/Content/Managing%20Flows/Add_media.htm'
      };
    }
  ]);