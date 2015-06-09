'use strict';

angular.module('liveopsConfigPanel')
  .controller('InvitesController', ['$scope', 'Session', 'Invite', 'InviteAccept',
    function ($scope, Session, Invite, InviteAccept) {
      $scope.fetchInvites = function(){
        $scope.invites = Invite.query({tenantId : Session.tenant.id});
      };
      
      $scope.init = function(){
        $scope.newInvite = new Invite();
        $scope.newInvite.roleId = '10f15d80-0052-11e5-b68b-fb65b1fe22e1'; //TEMPORARY until roles are implemented
      };
      
      $scope.init();
      $scope.fetchInvites();
      
      $scope.$watch(function(){return Session.tenant.id;}, function () {
        $scope.fetchInvites();
      });
      
      $scope.save = function(){
        $scope.newInvite.save({tenantId : Session.tenant.id}, function(data){
          $scope.invites.push(data.invitation);
          $scope.init();
          $scope.inviteCreateForm.$setUntouched();
        });
      };
      
      $scope.remove = function(invite){
        invite.$delete({tenantId: invite.tenantId, userId: invite.userId, token: invite.invitationToken}, function(){
          $scope.invites.removeItem(invite);
        });
      };
      
      $scope.resend = function(invite){
        //Using the Invite service here so it doesn't send all params on create.
        invite = Invite.save({verb: 'resend', tenantId: invite.tenantId}, {userId: invite.userId, token: invite.invitationToken});
      };
      
      //TEMPORARY
      $scope.accept = function(invite){
        InviteAccept.get({tenantId: invite.tenantId, userId: invite.userId, token: invite.invitationToken});
      };
  }]);
