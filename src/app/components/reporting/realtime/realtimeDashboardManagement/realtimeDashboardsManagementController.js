'use strict';

angular.module('liveopsConfigPanel')
  .controller('RealtimeDashboardsManagementController', ['$scope', '$state', '$document', '$compile', 'Session', 'RealtimeDashboard', 'dashboards', 'realtimeDashboardsManagementTableConfig', 'RealtimeDashboardVersion', 'loEvents', '$q',
    function ($scope, $state, $document, $compile, Session, RealtimeDashboard, dashboards, realtimeDashboardsManagementTableConfig, RealtimeDashboardVersion, loEvents, $q) {

      $scope.tableConfig = realtimeDashboardsManagementTableConfig;

      $scope.fetchDashboards = function () {

        var customDashboards = RealtimeDashboard.cachedQuery({
         tenantId: Session.tenant.tenantId
        });

        _.remove(customDashboards, function (customDashboard) {
         return customDashboard.tenantId !== Session.tenant.tenantId;
        });

        return customDashboards;
      };

      $scope.create = function() {
        var newScope = $scope.$new();

        newScope.modalBody = 'app/components/reporting/realtime/realtimeDashboardManagement/newDashboard.modal.html';
        newScope.title = 'New Dashboard';
        newScope.dashboard = {
          name: 'Untitled Dashboard'
        };

        newScope.cancelCallback = function() {
          $document.find('modal').remove();
        };

        newScope.okCallback = function(newDashboard) {
          var newDashboardCopy = new RealtimeDashboard({
            tenantId: Session.tenant.tenantId,
            name: newDashboard.name
          });

          return newDashboardCopy.save(function(dashboard){
            $document.find('modal').remove();
            $state.go('content.realtime-dashboards-management-editor', {
              dashboardId: dashboard.id
            });
          });
        };

        var element = $compile('<modal></modal>')(newScope);
        $document.find('html > body').append(element);

      };

      $scope.saveDashboard = function(){
        return $scope.selectedDashboard.save().then(function(dashboard){
          return dashboard;
        });
      };

      $scope.openDashboard = function(selectedDashboardId){
        $state.go('content.realtime-dashboards-management-editor', {
          dashboardId: selectedDashboardId
        });
      };

      $scope.updateActive = function(){
        var active = $scope.selectedDashboard.active ? !$scope.selectedDashboard.active : true;

        var dashboardCopy = new RealtimeDashboard({
          id: $scope.selectedDashboard.id,
          tenantId: $scope.selectedDashboard.tenantId,
          active: active
        });

        return dashboardCopy.save().then(function(result){
          $scope.selectedDashboard.$original.active = result.active;
        }, function(errorResponse){
          return $q.reject(errorResponse.data.error.attribute.active);
        });
      };

      $scope.$on(loEvents.tableControls.itemCreate, function () {
        $scope.create();
      });

      $scope.$on(loEvents.tableControls.itemSelected, function(e, args) {
        $scope.selectedDashboard = args;
      });

      $scope.tableConfig = realtimeDashboardsManagementTableConfig;

      $scope.submit = function(){
        return $scope.selectedDashboard.save();
      };
    }
  ]);
