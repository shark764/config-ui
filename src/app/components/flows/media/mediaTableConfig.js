'use strict';

angular.module('liveopsConfigPanel')
  .service('mediaTableConfig', ['mediaTypes', '$translate', 'UserPermissions', '$rootScope', function(mediaTypes, $translate, UserPermissions, $rootScope) {
    var defaultConfig = {
      'fields': [{
        'header': {
          'display': $translate.instant('value.name')
        },
        'name': '$original.name'
      }, {
        'header': {
          'display': $translate.instant('value.source')
        },
        'name': 'mediaSourceName'
      }, {
        'header': {
          'display': $translate.instant('value.type'),
          'valuePath': 'value',
          'displayPath': 'display',
          'options': mediaTypes
        },
        'name': '$original.type',
        'id': 'type-column-dropdown',
        'lookup': '$original:type',
        'filter': 'selectedOptions',
        'transclude': true
      }, {
        'header': {
          'display': $translate.instant('value.properties')
        },
        'name': '$original.properties'
      }],
      'searchOn': ['$original.source', '$original.name'],
      'orderBy': '$original.name',
      'title': $translate.instant('media.table.title'),
      'sref': 'content.flows.media',
      'showBulkActions': false,
      'showCreate': function() {
        return UserPermissions.hasPermission('MANAGE_ALL_MEDIA');
      },
      'helpLink': $rootScope.helpURL + '/Help/Content/Managing%20Flows/Media/Adding%20Media.htm',
      'helpLinkLanguages': $rootScope.helpURL + '/Help/Content/Resources/Supported_Languages.htm',
      'helpLinkVoices': $rootScope.helpURL + '/Help/Content/Resources/Supported_Languages.htm'
    };

    $rootScope.$on( "updateHelpURL", function () {
    	defaultConfig.helpLink           = $rootScope.helpURL + '/Help/Content/Managing%20Flows/Media/Adding%20Media.htm';
    	defaultConfig.helpLinkLanguages  = $rootScope.helpURL + '/Help/Content/Resources/Supported_Languages.htm';
    	defaultConfig.helpLinkVoices     = $rootScope.helpURL + '/Help/Content/Resources/Supported_Languages.htm';
    });

    return defaultConfig;

  }]);
