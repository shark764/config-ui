'use strict';

angular.module('liveopsConfigPanel')
  .controller('contactsController', [
    '$scope', '$rootScope', '$translate', '$moment', '$q', 'Session', 'Contacts', 'contactsTableConfig', 'loEvents', 'Modal','Alert',
    function ($scope, $rootScope, $translate, $moment, $q, Session, Contacts, contactsTableConfig, loEvents, Modal, Alert) {

      var con = this;

      var contact1 = new Contacts({
        id:'ea5e90e0-c3ae-11e5-9596-c1ae7ae4ed37',
        createdBy:'ea5e90e0-c3ae-11e5-9596-c1ae7ae4ed37sure',
        createdOn:'Feb 25, 2016 12:13:35 PM',
        $original: new Contacts({
          id:'ea5e90e0-c3ae-11e5-9596-c1ae7ae4ed37',
          createdBy:' Ryan LiveopsGmail',
          createdOn:'Feb 25, 2016 12:13:35 PM',
          name:'Doron Orenstein',
          phoneNumber:'+15125550000',
          state: 'Tx',
          country: 'USA',
          reqCallTime: '09:30 AM',
          timezone: 'America/Chicago',
          expiration: '08-04-2016',
          startDate: '07-04-2016'
        })
      });

      var contact2 = new Contacts({
        id:'ea5e90e0-c3ae-11e5-9596-c1ae7ae4ed37',
        $original: new Contacts({
          id:'ea5e90e0-c3ae-11e5-9596-c1ae7ae4ed37',
          name:'Kirby Craft',
          phoneNumber:'+15125551111',
          state: 'Tx',
          country: 'USA',
          reqCallTime: '10:30 AM',
          timezone: 'America/Chicago',
          expiration: '07/05/2016'
        })
      });

      var contact3 = new Contacts({
        id:'ea5e90e0-c3ae-11e5-9596-c1ae7ae4ed37',
        $original: new Contacts({
          id:'ea5e90e0-c3ae-11e5-9596-c1ae7ae4ed37',
          name:'Josh Stevens',
          phoneNumber:'+15125552222',
          state: 'Tx',
          country: 'USA',
          reqCallTime: '11:30 AM',
          timezone: 'America/Chicago',
          expiration: '07/05/2016'
        })
      });


      con.deleteContact = function(selectedContact){

        return Modal.showConfirm(
          {
            message: $translate.instant('queue.query.builder.remove.filter.confirm'),
            okCallback: function () {

              con.contacts.splice(con.contacts.indexOf(selectedContact), 1);
            }
          }
        );
      };

      con.submitContact = function(selectedContact){
        console.log('submit');
      };



      con.contacts = [contact1, contact2, contact3];

      con.tableConfig = contactsTableConfig;

    }
  ]);
