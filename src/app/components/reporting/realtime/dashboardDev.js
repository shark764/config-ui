(function(){
  'use strict';
  angular.module('liveopsConfigPanel.config').constant('dashboardDev',

  {
    'id':'dev-dashboard',
    'name':'Dev Dashboard',
    'widgets':[
      {
        'id':'3b35a7b3-c18c-4123-94d9-ecdb651e59b8',
        'type':'statistic',
        'query':{
          'api':'realtime-statistics',
          'endpoint':'queue-duration',
          'responseKey':'avg',
          'latestResult':'12',
          'parameters':{
            'queue':'f1dc57a7-e267-4b0c-9dfd-b1b99ee8e521',
            'start':'-5h',
            'end':'-0h'
          }
        },
        'presentation':{
          'header':{
            'show':true,
            'text':'Avg. Queue Duration'
          },
          'value':{
            'format':'time'
          },
          'footer':{
            'show':false,
            'text':''
          },
        },
        'sizeX':4,
        'sizeY':3,
        'col':0,
        'row':0
      },
      {
        'id':'3b35a7b3-c18c-4123-94d9-ecdb651e59b9',
        'type':'statistic',
        'query':{
          'api':'realtime-statistics',
          'endpoint':'interaction-hold-duration',
          'responseKey':'avg',
          'latestResult':'2m22s',
          'parameters':{}
        },
        'presentation':{
          'header':{
            'show':true,
            'text':'Avg. Hold Duration'
          },
          'value':{
            'format':'time'
          },
          'footer':{
            'show':true,
            'text':'Per Interaction'
          },
        },
        'sizeX':4,
        'sizeY':3,
        'col':0,
        'row':0
      }
    ]
  }

);
  
})();
