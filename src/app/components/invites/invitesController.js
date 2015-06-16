'use strict';

angular.module('liveopsConfigPanel')
  .controller('InvitesController', ['$scope', 'Session', 'Invite', 'InviteAccept', 'Tenant', 'AuthService', 'toastr',
    function ($scope, Session, Invite, InviteAccept, Tenant, AuthService, toastr) {

      $scope.fetchInvites = function(){
        $scope.invites = Invite.query({tenantId : $scope.newInvite.tenantId});
      };

      $scope.init = function(){
        $scope.newInvite = new Invite();
        $scope.newInvite.roleId = '10f15d80-0052-11e5-b68b-fb65b1fe22e1'; //TEMPORARY until roles are implemented
      };

      $scope.init();

      $scope.tenants = Tenant.query({regionId : Session.activeRegionId}, function () {
        if($scope.tenants.length > 0){
          $scope.newInvite.tenantId = $scope.tenants[0].id;
          $scope.fetchInvites();
        }
      });

      $scope.$watch('newInvite.tenantId', function () {
        if($scope.newInvite.tenantId){
          $scope.fetchInvites();
        }
      });

      $scope.save = function(){
        var prevTenant = $scope.newInvite.tenantId;

        $scope.newInvite.save({tenantId : $scope.newInvite.tenantId}, function(){
          $scope.init();
          $scope.newInvite.tenantId = prevTenant;
          $scope.fetchInvites();
        }, function () {
          toastr.error('Failed to create invite');
        });
      };

      $scope.remove = function(invite){
        invite.$delete({tenantId: invite.tenantId, userId: invite.userId, token: invite.invitationToken}, function(){
          toastr.success('Succesfully removed invitation');
          $scope.fetchInvites();
        }, function () {
          toastr.error('Failed to remove invitation');
        });
      };

      $scope.resend = function(invite){
        //Using the Invite service here so it doesn't send all params on create.
        invite = Invite.save({verb: 'resend', tenantId: invite.tenantId}, {userId: invite.userId, token: invite.invitationToken}, function (){
          toastr.success('Successfully resent invitation');
          $scope.fetchInvites();
        }, function () {
          toastr.error('Failed to resend invitation');
        });
      };

      //TEMPORARY
      $scope.accept = function(invite){
        InviteAccept.get({tenantId: invite.tenantId, userId: invite.userId, token: invite.invitationToken}, function () {
          toastr.success('Successfully accepted invitation');

          $scope.fetchInvites();

          if(invite.email === Session.user.email){
            AuthService.refreshTenants();
          }
        }, function () {
          toastr.error('Failed to accept invitation');
        });
      };
  }]);
