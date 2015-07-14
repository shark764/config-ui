"use strict";

/**
  Based on Zach Snow's blog post entitled AngularJS: Faster ng-include

  http://zachsnow.com/#!/blog/2014/angularjs-faster-ng-include/
**/

angular.module('liveopsConfigPanel')
  .directive('compiledInclude', [
  '$compile',
  '$templateCache',
  '$http',
  '$q',
  function($compile, $templateCache, $http, $q) {
    return {
      restrict: 'A',
      priority: 400,
      compile: function(){
        // In an ideal world, if we could hard-code the template URLs, we could
        // do all of the below in this compile function. Unfortunately, Since
        // we do not know what template will be needed, we have to rely on the
        // pre-link function (the return value of this)

        return function($scope, element, attrs){
          var templateName = attrs.compiledInclude,
              template = $templateCache.get(templateName);

          if(!template){

            // If we have no template, lets go fetch it. When we do, store it in cache.
            // This can cause multiple queries for the same template, but once one puts in
            // the cache, all future calls will be able to retrieve it from cache.
            template = $http.get(templateName, {cache: $templateCache}).then(function (result){
              $templateCache.put(templateName, result.data);
              return result.data;
            });
          }

          // Since we don't know if we're waiting for a promise or just have the value,
          // use $q.when to handle both cases
          $q.when(template).then(function (templateHtml) {
            element.html(templateHtml);
            $compile(element.contents())($scope);
          });
        };
      }
    };
  }
  ]);
