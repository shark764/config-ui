'use strict';

angular.module('liveopsConfigPanel')
  .controller('ReportsController', ['$scope', '$state',
    function($scope, $state) {
      var optionsDashboard = {  
        iframeSrc: "https://sde.birst.com/SSO.aspx?BirstSSOToken=" + $scope.token 
        + "&birst.module=newDashboards&birst.exportZoom=2&&amp;birst.embedded=true&birst.hideDashboardNavigation=false&"
        + "birst.hideDashboardPrompts=false&birst.dashboard=My%20Dashboard&birst.page=My%20Page" 
      } ; 
      BirstConfig.create("BirstDash", optionsDashboard); 
    }
  ]);
