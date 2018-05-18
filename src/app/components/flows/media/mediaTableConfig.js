'use strict';

angular.module('liveopsConfigPanel')
  .service('mediaTableConfig', ['mediaTypes', '$translate', 'UserPermissions', 'CustomDomain', function(mediaTypes, $translate, UserPermissions, CustomDomain) {

    var CustomDomainSvc = new CustomDomain();

    return {
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
      'helpLink': CustomDomainSvc.getHelpURL('/Help/Content/Managing%20Flows/Media/Adding%20Media.htm'),
      'helpLinkLanguages': CustomDomainSvc.getHelpURL('/Help/Content/Resources/Supported_Languages.htm'),
      'helpLinkVoices': CustomDomainSvc.getHelpURL('/Help/Content/Resources/Supported_Languages.htm'),
      'sref': 'content.flows.media',
      'showBulkActions': false,
      'showCreate': function() {
        return UserPermissions.hasPermission('MANAGE_ALL_MEDIA');
      }
    };
  }]);
