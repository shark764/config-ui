'use strict';

angular.module('liveopsConfigPanel')
  .factory('ServiceFactory', ['$resource', 'apiHostname', 'Session',
    function ($resource, apiHostname, Session) {
      return {
        create: function (endpoint, setCreatedBy, setUpdatedBy) {
          setUpdatedBy = typeof setUpdatedBy !== 'undefined' ? setUpdatedBy : true;
          setCreatedBy = typeof setCreatedBy !== 'undefined' ? setCreatedBy : true;

          return $resource(apiHostname + endpoint, {}, {
            query: {
              method: 'GET',
            },
            update: {
              method: 'PUT',
              transformRequest: function (body) {
                if (setUpdatedBy) {
                  body.updatedBy = Session.id;
                }
              
                return JSON.stringify(body);
              }
            },
            save: {
              method: 'POST',
              transformRequest: function (body) {
                if (setCreatedBy) {
                  body.createdBy = Session.id;
                }
              
                return JSON.stringify(body);
              }
            }
          });
        }
      };
    }
  ]);