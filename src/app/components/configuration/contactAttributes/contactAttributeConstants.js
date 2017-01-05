
'use strict';

angular.module('liveopsConfigPanel')
  .factory('attributeTypes', ['$translate', function($translate) {
    return [
      {
        label: $translate.instant('value.text'),
        value: 'text'
      },
      {
        label: $translate.instant('details.phoneNumber'),
        value: 'phone'
      },
      {
        label: $translate.instant('value.email'),
        value: 'email'
      },
      {
        label: $translate.instant('value.boolean'),
        value: 'boolean'
      },
      {
        label: $translate.instant('value.link'),
        value: 'link'
      },
      {
        label: $translate.instant('value.number'),
        value: 'number'
      }
    ];
  }])
  .factory('localeNames', ['$translate', function($translate) {
    return [
      {
        label: $translate.instant('locale.en-GB'),
        value: 'en-GB'
      },
      {
        label: $translate.instant('locale.en-US'),
        value: 'en-US'
      },
      {
        label: $translate.instant('locale.fr-CA'),
        value: 'fr-CA'
      },
      {
        label: $translate.instant('locale.fr-FR'),
        value: 'fr-FR'
      },
      {
        label: $translate.instant('locale.de-DE'),
        value: 'de-DE'
      },
      {
        label: $translate.instant('locale.pl-PL'),
        value: 'pl-PL'
      },
      {
        label: $translate.instant('locale.pt-BR'),
        value: 'pt-BR'
      },
      {
        label: $translate.instant('locale.es-ES'),
        value: 'es-ES'
      }
    ];
  }]);
