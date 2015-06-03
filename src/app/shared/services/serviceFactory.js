'use strict';

angular.module('liveopsConfigPanel')
  .factory('AuthenticatedServiceFactory', ['$resource', 'apiHostname', 'Session', 'AuthInterceptor',
    function ($resource, apiHostname, Session, AuthInterceptor) {
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