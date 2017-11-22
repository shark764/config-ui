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
    'angular-jwt'
  ])
  .config(['$translateProvider', 'toastrConfig', '$qProvider', '$locationProvider',
    function($translateProvider, toastrConfig, qProvider, $locationProvider) {
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
        .useLocalStorage()
        .preferredLanguage('en');

      qProvider.errorOnUnhandledRejections(false);

      $locationProvider.hashPrefix('');
    }
  ])
  .run(['queryCache', '$rootScope', '$state', '$stateParams', '$animate', 'Branding', 'AuthService', 'Session', '$location', '$window', function(queryCache, $rootScope, $state, $stateParams, $animate, Branding, AuthService, Session, $location, $window) {
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

    $rootScope.$on('$stateChangeStart', function(e, toState) {
      // determine which login screen to show and to return to upon logout
      AuthService.setSsoMode(toState.name, $location);

      if (toState.name === 'login' || toState.name === 'forgot-password' || toState.name === 'invite-accept') {

        if ($location.absUrl().indexOf(mitelUrl) !== -1) {
          Branding.set(mockBrandingData);
        } else {
          Branding.set({});
        }

        // if it's an SSO login, look for specific keys in URL params
        // and if those keys exist, immediately log in via IDP
        if ($location.absUrl().indexOf('username') !== -1) {
          AuthService.idpLogin(AuthService.generateAuthParams('username'));
        } else if ($location.absUrl().indexOf('tenantId') !== -1) {
          AuthService.idpLogin(AuthService.generateAuthParams('tenantId'));
        }
      }
    });
    $rootScope.$on('$stateChangeSuccess', function(ev, toState, toParams, from, fromParams) {
      Session.setLastPageVisited({
        stateName: from.name,
        paramsObj: fromParams
      });

      queryCache.removeAll();
      $rootScope.title = $state.current.title + ' | ' + $rootScope.productName;
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
    $animate.enabled(false);
  }]);
