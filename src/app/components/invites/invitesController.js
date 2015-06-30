'use strict';

angular.module('liveopsConfigPanel')
  .controller('InvitesController', ['$scope', 'Session', 'Invite', 'InviteAccept', 'Tenant', 'AuthService', 'Alert',
    function ($scope, Session, Invite, InviteAccept, Tenant, AuthService, Alert) {


      $scope.tenants = Tenant.query({regionId : Session.activeRegionId}, function () {
        if($scope.tenants.length > 0){
          $scope.init();
          $scope.fetchInvites();
        }
      });

      $scope.$watch('Session.tenant.tenantId', function () {
        $scope.fetchInvites();
      });

      $scope.fetchInvites = function(){
        $scope.invites = Invite.query({tenantId : Session.tenant.tenantId});
      };

      $scope.init = function(){
        $scope.newInvite = new Invite();
        $scope.newInvite.roleId = '10f15d80-0052-11e5-b68b-fb65b1fe22e1'; //TEMPORARY until roles are implemented
        $scope.newInvite.tenantId = $scope.tenants[0].id;
      };

      $scope.save = function(){
        var prevTenant = $scope.newInvite.tenantId;

        $scope.newInvite.save(function(){
          $scope.init();
          $scope.newInvite.tenantId = prevTenant;
          $scope.fetchInvites();
        }, function () {
          Alert.error('Failed to create invite');
        });
      };

      $scope.accept = function(invite) {
        new InviteAccept.get({tenantId: invite.tenantId, userId: invite.userId, token: invite.invitationToken}, $scope.fetchInvites);
      };

      $scope.remove = function(invite){
        invite.$delete({tenantId: invite.tenantId, userId: invite.userId, token: invite.invitationToken}, function(){
          Alert.success('Succesfully removed invitation');
          $scope.fetchInvites();
        }, function () {
          Alert.error('Failed to remove invitation');
        });
      };

      $scope.resend = function(invite){
        //Using the Invite service here so it doesn't send all params on create.
        invite = Invite.save({verb: 'resend', tenantId: invite.tenantId}, {userId: invite.userId, token: invite.invitationToken}, function (){
          Alert.success('Successfully resent invitation');
          $scope.fetchInvites();
        }, function () {
          Alert.error('Failed to resend invitation');
        });
      };
  }]);
