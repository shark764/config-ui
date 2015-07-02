'use strict';

angular.module('liveopsConfigPanel')
  .service('flowTableConfig', [function () {
      return {
        'fields': [{
          'header': 'Name',
          'name': 'name'
        }, {
          'header': 'Description',
          'name': 'description'
        }, {
          'header': 'Active Version',
          'name': 'activeVersion',
          'templateUrl': 'app/components/flows/flowManagement/flowVersionName.html'
        }],
        'searchOn' : ['name'],
        'orderBy' : ['name'],
        'title' : 'Flow Management'
      };
    }]
  );
