'use strict';

angular.module('liveopsConfigPanel', [
    'liveopsConfigPanel.config',
    'liveopsConfigPanel.shared',
    'liveopsConfigPanel.permissions',
    'liveopsConfigPanel.flags',
    'ui.router',
    'ngResource',
    'pascalprecht.translate',
    'ngCookies',
    'ngMessages',
    'ngSanitize',
    'toastr',
    'ngLodash',
    'teljs',
    'realtime-dashboards',
    'moment-picker',
    'ngMaterial',
    'ngFileUpload',
    'dndLists',
    'angular-momentjs',
    'agent-toolbar',
    'ui.sortable',
    'ui.codemirror',
    'ngAnimate',
    'color.picker',
    'textAngular',
    'infinite-scroll',
    'angular-jwt',
    'angularUtils.directives.dirPagination'
  ])
  .config(['$translateProvider', 'toastrConfig', '$qProvider', '$locationProvider', 'languages',
    function($translateProvider, toastrConfig, qProvider, $locationProvider, languages) {
      angular.extend(toastrConfig, {
        closeButton: true,
        timeout: 10000,
        maxOpened: 3,
        positionClass: 'toast-top-right',
        preventOpenDuplicates: true,
        newestOnTop: true
      });

      $translateProvider
        .useSanitizeValueStrategy('escaped')
        .uniformLanguageTag('bcp47')
        .fallbackLanguage('en-US')
        .determinePreferredLanguage(function() {
          var browserLang = location.hash.indexOf('alpha') > -1 ?
            window.localStorage.getItem('locale') || 
              languages.reduce(function(list, lang) { return list.concat(lang.value); }, [])
                .find(function(val) {
                  return val === window.navigator.language || val.split('-')[0] === window.navigator.language.split('-')[0];
                }) ||
              'en-US' : // In the last step should be a function determining the region and returning the language key based on that(en-US or en-GB)
              'en-US'; // If it's not alpha we always return english

          // Set on the local storage the selected language
          if (location.hash.includes('alpha') && (!window.localStorage.getItem('locale') || window.localStorage.getItem('locale') === '')) {
            window.localStorage.setItem('locale', browserLang);
          }  

          return browserLang;

        });

      qProvider.errorOnUnhandledRejections(false);

      $locationProvider.hashPrefix('');
    }
  ])
  .run(['queryCache', '$rootScope', '$state', '$stateParams', '$animate', 'Branding', 'CustomDomain', 'AuthService', 'Session', '$location', '$window', '$timeout', '$translate', 'Alert', function(queryCache, $rootScope, $state, $stateParams, $animate, Branding, CustomDomain, AuthService, Session, $location, $window, $timeout, $translate, Alert) {
    var debugTimeout;

    /*global localStorage: false */
    $window.addEventListener('beforeunload', function() {
      Session.setLastPageVisited({
        stateName: $state.current.name,
        paramsObj: $state.params
      });
      // the only way to make sure that we don't lose track of the session when a page
      // reloads without "sso" in the url, because without the "sso" in the URL,
      // Session.isSso automatically gets set to false
      localStorage.setItem('IS_SSO_OVERRIDE', Session.isSso);
    });

    // --- Mitel Temp Info ---
    // Needed to style the login and forgot password pages
    // We do not have access to the branding data until logged in
    // This is temporary data until we have further api support
    var mitelUrl = 'mitel';

    var mockBrandingData = {
      active: true,
      favicon: 'assets/images/mitelFavicon.ico',
      logo: 'assets/images/mitelLogoWhite.png',
      styles: {
        productName: 'Mitel',
        accentColor: '#FF7300',
        accentHoverColor: '#E3F3FF',
        navbar: '#15325F',
        navbarText: '#FFFFFF',
        primaryColor: '#00A1F4'
      }
    };

    var locationSearch = {};

    $rootScope.$on('$stateChangeStart', function(e, toState, stateParams) {
      // save non sso deep link location.search so we can add it back after transition is done

      locationSearch =  _.mapKeys($location.search(), function (v, k) {
        return k.toLowerCase();
      });

      if (toState.name !== 'login' && toState.name !== 'invite-accept' && toState.name !== 'reset-password') {
        if (locationSearch.username !== undefined) {
          delete locationSearch.username;
        }
        if (locationSearch.tenantid !== undefined) {
          delete locationSearch.tenantid;
        }
        if (locationSearch.idp !== undefined) {
          delete locationSearch.idp;
        }
        if (locationSearch.token !== undefined) {
          delete locationSearch.token;
        }
      }
      if (stateParams && stateParams.sso !== undefined) {
        locationSearch.sso = stateParams.sso;
      }

      $timeout.cancel(debugTimeout);

      // determine which login screen to show and to return to upon logout
      AuthService.setSsoMode(toState.name, $location);

      if (toState.name === 'login' || toState.name === 'forgot-password' || toState.name === 'invite-accept' || toState.name === 'legal' || toState.name === 'reset-password') {

        if ($location.absUrl().indexOf(mitelUrl) !== -1) {
          Branding.set(mockBrandingData);
        } else {
          Branding.set({});
        }

        // for dev & qe purposes, adding &tokendebug=[number of seconds]
        // to the login url, you will trigger the token expiration behavoir
        // after the number of seconds specified in the parameter value
        if ($location.absUrl().indexOf('tokendebug') !== -1) {
          var urlParams = $location.search();
          // this mode will have to manually removed from localStorage
          // using browser dev tools
          localStorage.setItem('TOKEN-EXPIRATION-DEBUG', urlParams.tokendebug);
        }

        // if it's an SSO login, look for specific keys in URL params
        // and if those keys exist, immediately log in via IDP
        if ((locationSearch.username || locationSearch.tenantid) && !locationSearch.token) {
          AuthService.idpLogin(AuthService.generateAuthParams(locationSearch));
        }
      } else if (localStorage.getItem('TOKEN-EXPIRATION-DEBUG')) {
        debugTimeout = $timeout(function() {
          // random bad API call we're using to throw a 400 error for debugging
          Branding.get({
            tenantId: '6c84fb90-12c4-11e1-840d-7b25c5ee775a'
          });
        }, localStorage.getItem('TOKEN-EXPIRATION-DEBUG') * 1000);
      }

      // when the current config2 form is dirty, show confirmation modal & don't navigate to a different page:
      if ($rootScope.isConfig2FormDirty) {
        Alert.confirm($translate.instant('unsavedchanges.nav.warning'),
          function() {
            $rootScope.isConfig2FormDirty = false;
          },
          function() {
            e.preventDefault();
          }
        );
      }

    });
    $rootScope.$on('$stateChangeSuccess', function(ev, toState, toParams, from, fromParams) {
      // restore all saved query string parameters back to $location.search
      $location.search(locationSearch);

      Session.setLastPageVisited({
        stateName: from.name,
        paramsObj: fromParams
      });

      queryCache.removeAll();
      $rootScope.title = ($state.current.titleMessageId ? 
        $translate.instant($state.current.titleMessageId) : 
        $state.current.title ) + ' | ' + $rootScope.productName;
      AuthService.setSsoMode(toState.name, $location);
    });
    $rootScope.$on('$stateChangeError', function() {
      console.error('State change error!');
      console.log(arguments);
    });
    $rootScope.$on('$stateNotFound', function() {
      console.error('State not found!');
      console.log(arguments);
    });
    $rootScope.$on('$translateChangeSuccess', function() {
      $rootScope.title = ($state.current.titleMessageId ? 
        $translate.instant($state.current.titleMessageId) : 
        $state.current.title ) + ' | ' + $rootScope.productName;
    })
    $animate.enabled(false);
  }]);
