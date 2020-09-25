'use strict';

angular.module('liveopsConfigPanel.config', [])

.constant('preferenceKey', 'LIVEOPS-PREFERENCE-KEY')

.constant('sessionKey', 'LIVEOPS-SESSION-KEY')

.constant('uuidcacheKey', 'LIVEOPS-CACHE-KEY')

.constant('legalLinkCX', 'https://legal.cxengagelabs.net/cxengage-legal/index.html')

.constant('legalLinkMitel', 'https://legal.cxengagelabs.net/mitel-legal/index.html')

.constant('_', _)

.factory('validationPatterns', function () {
  return {
    sip: new RegExp(/[s|S]{1}[i|I]{1}[p|P]{1}:.*/)
  };
})

.constant('userInviteStatuses', [
  'invited',
  'pending',
  'expired'
])

.constant('cxEngageAuthStatesTenant',
  {
    tenantDefault: null,
    enabled: 'enabled',
    disabled: 'disabled',
    denied: 'denied'
  }
)

.constant('cxEngageAuthStatesUser',
  {
    tenantDefault: null,
    enabled: false,
    disabled: true,
    denied: 'denied'
  }
)

.constant('bulkEditUserAuth', 'BULK_EDIT_USER_AUTH')

.factory('cxEngageAuthOptions', ['$translate', 'cxEngageAuthStatesUser', 'cxEngageAuthStatesTenant', 'bulkEditUserAuth',
  function($translate, cxEngageAuthStatesUser, cxEngageAuthStatesTenant, bulkEditUserAuth) {
    return function(tenantDefaultVal) {
      var defaultValName;
      var cxAuthOptionList = [];
      // if there is a tenant default CxEngage Enabled status, then use the
      // User statuses for CxEngage enable/disable, otherwise use tenant options
      var cxAuthAvailableOptions = angular.isDefined(tenantDefaultVal)
        ? cxEngageAuthStatesUser
        : cxEngageAuthStatesTenant;

      cxAuthOptionList.push({
        value: cxAuthAvailableOptions.enabled,
        display: $translate.instant('value.enabled')
      },
      {
        value: cxAuthAvailableOptions.disabled,
        display: $translate.instant('value.disabled')
      });

      // If we have a default CxStatus value, get the string
      // representation for the tenant's default CxEngage auth status
      if (angular.isDefined(tenantDefaultVal)) {
        // first off, if it's denied, then all we need to offer is
        // the "Denied" option in the dropdown
        if (tenantDefaultVal === cxEngageAuthStatesUser.denied) {
          return [{
            value: cxAuthAvailableOptions.denied,
            display: $translate.instant('value.denied')
          }];
        }

        // now, to assign a user-facing string value for the enabled or
        // disabled tenant default value
        switch(tenantDefaultVal) {
          case cxAuthAvailableOptions.enabled:
            defaultValName = ': ' + $translate.instant('value.enabled');
            break;
          case cxAuthAvailableOptions.disabled:
            defaultValName = ': ' + $translate.instant('value.disabled');
            break;
          case bulkEditUserAuth:
            defaultValName = '';
            break;
          default:
            defaultValName = '';
        }

        // ...now we make this the first item in the dropdown
        cxAuthOptionList.unshift({
          value: cxAuthAvailableOptions.tenantDefault,
          display: $translate.instant('user.details.tenantDefault') + defaultValName
        });
      } else {
      // If we are on the Tenants page, then add the "denied" option to the drowpdown
        cxAuthOptionList.push({
          value: cxAuthAvailableOptions.denied,
          display: $translate.instant('value.denied')
        });
      }

      return cxAuthOptionList;
    };
  }
])

.factory('userStatuses', function() {
  return function() {
    return [{
      'display': 'Disabled',
      'value': 'disabled'
    }, {
      'display': 'Enabled',
      'value': 'accepted'
    }];
  };
})

.factory('userPlatformStatuses', function() {
  return function() {
    return [{
      'display': 'Pending Invite',
      'value': 'pending'
    }, {
      'display': 'Invited',
      'value': 'invited'
    }, {
      'display': 'Expired Invitation',
      'value': 'expired'
    }, {
      'display': 'Enabled',
      'value': 'enabled'
    }, {
      'display': 'Disabled',
      'value': 'disabled'
    }, {
      'display': 'SSO Only',
      'value': 'sso-only'
    }];
  };
})

//Using displayKeys to fix TITAN2-6886: select boxes not repainting after translate filter runs
.factory('statuses', ['$translate', function($translate) {
  return function() {
    return [{
      'display': $translate.instant('value.disabled'),
      'displayKey': 'value.disabled',
      'value': false
    }, {
      'display': $translate.instant('value.enabled'),
      'displayKey': 'value.enabled',
      'value': true
    }];
  };
}])

.factory('ynStatuses', function() {
  return function() {
    return [{
      'display': 'No',
      'displayKey': 'value.no',
      'value': false
    }, {
      'display': 'Yes',
      'displayKey': 'value.yes',
      'value': true
    }];
  };
})

.factory('tenantStatuses', function() {
  return function() {
    return [{
      'display': 'Disabled',
      'value': 'disabled'
    }, {
      'display': 'Expired Invitation',
      'value': 'expired'
    }, {
      'display': 'Pending Invitation',
      'value': 'pending'
    }, {
      'display': 'Accepted',
      'value': 'accepted'
    }, {
      'display': 'Pending Acceptance',
      'value': 'invited'
    }];
  };
})

  .constant('userStates', [{
    'display': 'Busy',
    'value': 'busy'
  }, {
    'display': 'Ready',
    'value': 'ready'
  }, {
    'display': 'Not Ready',
    'value': 'notready'
  }, {
    'display': 'Allocated',
    'value': 'allocated'
  }, {
    'display': 'Offline',
    'value': 'offline'
  }])

  .constant('userRoles', [{
    'value': 'admin',
    'display': 'Admin'
  }, {
    'value': 'user',
    'display': 'User'
  }, {
    'value': 'other',
    'display': 'Other'
  }])

  .constant('campaignChannelTypes', [
    'voice',
    'sms'
  ])

  .constant('capacityRuleChannels', [
    {
      name:'Voice',
      value: ':voice'
    },
    {
      name:'SMS',
      value: ':sms'
    },
    {
      name:'Email',
      value: ':email'
    },
    {
      name:'Messaging',
      value: ':messaging'
    },
    {
      name: 'Work Item',
      value: ':work-item'
    }
  ])

  .constant('regionCodes', [
    {name: 'Afghanistan', code: 'AF'},
    {name: 'Åland Islands', code: 'AX'},
    {name: 'Albania', code: 'AL'},
    {name: 'Algeria', code: 'DZ'},
    {name: 'American Samoa', code: 'AS'},
    {name: 'AndorrA', code: 'AD'},
    {name: 'Angola', code: 'AO'},
    {name: 'Anguilla', code: 'AI'},
    {name: 'Antarctica', code: 'AQ'},
    {name: 'Antigua and Barbuda', code: 'AG'},
    {name: 'Argentina', code: 'AR'},
    {name: 'Armenia', code: 'AM'},
    {name: 'Aruba', code: 'AW'},
    {name: 'Australia', code: 'AU'},
    {name: 'Austria', code: 'AT'},
    {name: 'Azerbaijan', code: 'AZ'},
    {name: 'Bahamas', code: 'BS'},
    {name: 'Bahrain', code: 'BH'},
    {name: 'Bangladesh', code: 'BD'},
    {name: 'Barbados', code: 'BB'},
    {name: 'Belarus', code: 'BY'},
    {name: 'Belgium', code: 'BE'},
    {name: 'Belize', code: 'BZ'},
    {name: 'Benin', code: 'BJ'},
    {name: 'Bermuda', code: 'BM'},
    {name: 'Bhutan', code: 'BT'},
    {name: 'Bolivia', code: 'BO'},
    {name: 'Bonaire, Sint Eustatius and Saba', code: 'BQ'},
    {name: 'Bosnia and Herzegovina', code: 'BA'},
    {name: 'Botswana', code: 'BW'},
    {name: 'Bouvet Island', code: 'BV'},
    {name: 'Brazil', code: 'BR'},
    {name: 'British Indian Ocean Territory', code: 'IO'},
    {name: 'Brunei Darussalam', code: 'BN'},
    {name: 'Bulgaria', code: 'BG'},
    {name: 'Burkina Faso', code: 'BF'},
    {name: 'Burundi', code: 'BI'},
    {name: 'Cambodia', code: 'KH'},
    {name: 'Cameroon', code: 'CM'},
    {name: 'Canada', code: 'CA'},
    {name: 'Cape Verde', code: 'CV'},
    {name: 'Cayman Islands', code: 'KY'},
    {name: 'Central African Republic', code: 'CF'},
    {name: 'Chad', code: 'TD'},
    {name: 'Chile', code: 'CL'},
    {name: 'China', code: 'CN'},
    {name: 'Christmas Island', code: 'CX'},
    {name: 'Cocos (Keeling) Islands', code: 'CC'},
    {name: 'Colombia', code: 'CO'},
    {name: 'Comoros', code: 'KM'},
    {name: 'Congo', code: 'CG'},
    {name: 'Congo, The Democratic Republic of the', code: 'CD'},
    {name: 'Cook Islands', code: 'CK'},
    {name: 'Costa Rica', code: 'CR'},
    {name: 'Cote D\'Ivoire', code: 'CI'},
    {name: 'Croatia', code: 'HR'},
    {name: 'Cuba', code: 'CU'},
    {name: 'Curaçao', code: 'CW'},
    {name: 'Cyprus', code: 'CY'},
    {name: 'Czech Republic', code: 'CZ'},
    {name: 'Denmark', code: 'DK'},
    {name: 'Djibouti', code: 'DJ'},
    {name: 'Dominica', code: 'DM'},
    {name: 'Dominican Republic', code: 'DO'},
    {name: 'Ecuador', code: 'EC'},
    {name: 'Egypt', code: 'EG'},
    {name: 'El Salvador', code: 'SV'},
    {name: 'Equatorial Guinea', code: 'GQ'},
    {name: 'Eritrea', code: 'ER'},
    {name: 'Estonia', code: 'EE'},
    {name: 'Ethiopia', code: 'ET'},
    {name: 'Falkland Islands (Malvinas)', code: 'FK'},
    {name: 'Faroe Islands', code: 'FO'},
    {name: 'Fiji', code: 'FJ'},
    {name: 'Finland', code: 'FI'},
    {name: 'France', code: 'FR'},
    {name: 'French Guiana', code: 'GF'},
    {name: 'French Polynesia', code: 'PF'},
    {name: 'French Southern Territories', code: 'TF'},
    {name: 'Gabon', code: 'GA'},
    {name: 'Gambia', code: 'GM'},
    {name: 'Georgia', code: 'GE'},
    {name: 'Germany', code: 'DE'},
    {name: 'Ghana', code: 'GH'},
    {name: 'Gibraltar', code: 'GI'},
    {name: 'Greece', code: 'GR'},
    {name: 'Greenland', code: 'GL'},
    {name: 'Grenada', code: 'GD'},
    {name: 'Guadeloupe', code: 'GP'},
    {name: 'Guam', code: 'GU'},
    {name: 'Guatemala', code: 'GT'},
    {name: 'Guernsey', code: 'GG'},
    {name: 'Guinea', code: 'GN'},
    {name: 'Guinea-Bissau', code: 'GW'},
    {name: 'Guyana', code: 'GY'},
    {name: 'Haiti', code: 'HT'},
    {name: 'Heard Island and Mcdonald Islands', code: 'HM'},
    {name: 'Holy See (Vatican City State)', code: 'VA'},
    {name: 'Honduras', code: 'HN'},
    {name: 'Hong Kong', code: 'HK'},
    {name: 'Hungary', code: 'HU'},
    {name: 'Iceland', code: 'IS'},
    {name: 'India', code: 'IN'},
    {name: 'Indonesia', code: 'ID'},
    {name: 'Iran, Islamic Republic Of', code: 'IR'},
    {name: 'Iraq', code: 'IQ'},
    {name: 'Ireland', code: 'IE'},
    {name: 'Isle of Man', code: 'IM'},
    {name: 'Israel', code: 'IL'},
    {name: 'Italy', code: 'IT'},
    {name: 'Jamaica', code: 'JM'},
    {name: 'Japan', code: 'JP'},
    {name: 'Jersey', code: 'JE'},
    {name: 'Jordan', code: 'JO'},
    {name: 'Kazakhstan', code: 'KZ'},
    {name: 'Kenya', code: 'KE'},
    {name: 'Kiribati', code: 'KI'},
    {name: 'Korea, Democratic People\'S Republic of', code: 'KP'},
    {name: 'Korea, Republic of', code: 'KR'},
    {name: 'Kuwait', code: 'KW'},
    {name: 'Kyrgyzstan', code: 'KG'},
    {name: 'Lao People\'S Democratic Republic', code: 'LA'},
    {name: 'Latvia', code: 'LV'},
    {name: 'Lebanon', code: 'LB'},
    {name: 'Lesotho', code: 'LS'},
    {name: 'Liberia', code: 'LR'},
    {name: 'Libyan Arab Jamahiriya', code: 'LY'},
    {name: 'Liechtenstein', code: 'LI'},
    {name: 'Lithuania', code: 'LT'},
    {name: 'Luxembourg', code: 'LU'},
    {name: 'Macao', code: 'MO'},
    {name: 'Macedonia, The Former Yugoslav Republic of', code: 'MK'},
    {name: 'Madagascar', code: 'MG'},
    {name: 'Malawi', code: 'MW'},
    {name: 'Malaysia', code: 'MY'},
    {name: 'Maldives', code: 'MV'},
    {name: 'Mali', code: 'ML'},
    {name: 'Malta', code: 'MT'},
    {name: 'Marshall Islands', code: 'MH'},
    {name: 'Martinique', code: 'MQ'},
    {name: 'Mauritania', code: 'MR'},
    {name: 'Mauritius', code: 'MU'},
    {name: 'Mayotte', code: 'YT'},
    {name: 'Mexico', code: 'MX'},
    {name: 'Micronesia, Federated States of', code: 'FM'},
    {name: 'Moldova, Republic of', code: 'MD'},
    {name: 'Monaco', code: 'MC'},
    {name: 'Mongolia', code: 'MN'},
    {name: 'Montenegro', code: 'ME'},
    {name: 'Montserrat', code: 'MS'},
    {name: 'Morocco', code: 'MA'},
    {name: 'Mozambique', code: 'MZ'},
    {name: 'Myanmar', code: 'MM'},
    {name: 'Namibia', code: 'NA'},
    {name: 'Nauru', code: 'NR'},
    {name: 'Nepal', code: 'NP'},
    {name: 'Netherlands', code: 'NL'},
    {name: 'Netherlands Antilles', code: 'AN'},
    {name: 'New Caledonia', code: 'NC'},
    {name: 'New Zealand', code: 'NZ'},
    {name: 'Nicaragua', code: 'NI'},
    {name: 'Niger', code: 'NE'},
    {name: 'Nigeria', code: 'NG'},
    {name: 'Niue', code: 'NU'},
    {name: 'Norfolk Island', code: 'NF'},
    {name: 'Northern Mariana Islands', code: 'MP'},
    {name: 'Norway', code: 'NO'},
    {name: 'Oman', code: 'OM'},
    {name: 'Pakistan', code: 'PK'},
    {name: 'Palau', code: 'PW'},
    {name: 'Palestinian Territory, Occupied', code: 'PS'},
    {name: 'Panama', code: 'PA'},
    {name: 'Papua New Guinea', code: 'PG'},
    {name: 'Paraguay', code: 'PY'},
    {name: 'Peru', code: 'PE'},
    {name: 'Philippines', code: 'PH'},
    {name: 'Pitcairn', code: 'PN'},
    {name: 'Poland', code: 'PL'},
    {name: 'Portugal', code: 'PT'},
    {name: 'Puerto Rico', code: 'PR'},
    {name: 'Qatar', code: 'QA'},
    {name: 'Reunion', code: 'RE'},
    {name: 'Romania', code: 'RO'},
    {name: 'Russian Federation', code: 'RU'},
    {name: 'RWANDA', code: 'RW'},
    {name: 'Saint Barthélemy', code: 'BL'},
    {name: 'Saint Helena', code: 'SH'},
    {name: 'Saint Kitts and Nevis', code: 'KN'},
    {name: 'Saint Lucia', code: 'LC'},
    {name: 'Saint Martin', code: 'MF'},
    {name: 'Saint Pierre and Miquelon', code: 'PM'},
    {name: 'Saint Vincent and the Grenadines', code: 'VC'},
    {name: 'Samoa', code: 'WS'},
    {name: 'San Marino', code: 'SM'},
    {name: 'Sao Tome and Principe', code: 'ST'},
    {name: 'Saudi Arabia', code: 'SA'},
    {name: 'Senegal', code: 'SN'},
    {name: 'Serbia', code: 'RS'},
    {name: 'Serbia and Montenegro', code: 'CS'},
    {name: 'Seychelles', code: 'SC'},
    {name: 'Sierra Leone', code: 'SL'},
    {name: 'Singapore', code: 'SG'},
    {name: 'Sint Maarten (Dutch part)', code: 'SX'},
    {name: 'Slovakia', code: 'SK'},
    {name: 'Slovenia', code: 'SI'},
    {name: 'Solomon Islands', code: 'SB'},
    {name: 'Somalia', code: 'SO'},
    {name: 'South Africa', code: 'ZA'},
    {name: 'South Georgia and the South Sandwich Islands', code: 'GS'},
    {name: 'South Sudan', code: 'SS'},
    {name: 'Spain', code: 'ES'},
    {name: 'Sri Lanka', code: 'LK'},
    {name: 'Sudan', code: 'SD'},
    {name: 'Suriname', code: 'SR'},
    {name: 'Svalbard and Jan Mayen', code: 'SJ'},
    {name: 'Swaziland', code: 'SZ'},
    {name: 'Sweden', code: 'SE'},
    {name: 'Switzerland', code: 'CH'},
    {name: 'Syrian Arab Republic', code: 'SY'},
    {name: 'Taiwan, Province of China', code: 'TW'},
    {name: 'Tajikistan', code: 'TJ'},
    {name: 'Tanzania, United Republic of', code: 'TZ'},
    {name: 'Thailand', code: 'TH'},
    {name: 'Timor-Leste', code: 'TL'},
    {name: 'Togo', code: 'TG'},
    {name: 'Tokelau', code: 'TK'},
    {name: 'Tonga', code: 'TO'},
    {name: 'Trinidad and Tobago', code: 'TT'},
    {name: 'Tunisia', code: 'TN'},
    {name: 'Turkey', code: 'TR'},
    {name: 'Turkmenistan', code: 'TM'},
    {name: 'Turks and Caicos Islands', code: 'TC'},
    {name: 'Tuvalu', code: 'TV'},
    {name: 'Uganda', code: 'UG'},
    {name: 'Ukraine', code: 'UA'},
    {name: 'United Arab Emirates', code: 'AE'},
    {name: 'United Kingdom', code: 'GB'},
    {name: 'United States', code: 'US'},
    {name: 'United States Minor Outlying Islands', code: 'UM'},
    {name: 'Unknown', code: 'ZZ'},
    {name: 'Uruguay', code: 'UY'},
    {name: 'Uzbekistan', code: 'UZ'},
    {name: 'Vanuatu', code: 'VU'},
    {name: 'Venezuela', code: 'VE'},
    {name: 'Viet Nam', code: 'VN'},
    {name: 'Virgin Islands, British', code: 'VG'},
    {name: 'Virgin Islands, U.S.', code: 'VI'},
    {name: 'Wallis and Futuna', code: 'WF'},
    {name: 'Western Sahara', code: 'EH'},
    {name: 'Yemen', code: 'YE'},
    {name: 'Zambia', code: 'ZM'},
    {name: 'Zimbabwe', code: 'ZW'}
])

.constant('languages', [
  { value: 'cs-CZ', label: 'Čeština (Czech Republic)' },
  { value: 'de-DE', label: 'Deutsche (Deutschland)' },
  { value: 'en-GB', label: 'English (Great Britain)' },
  { value: 'en-US', label: 'English (US)' },
  { value: 'es-ES', label: 'Español (España)' }, // Castilian Spanish - Grande!!
  { value: 'fr-CA', label: 'Français (Canada)' },
  { value: 'fr-FR', label: 'Français (France)' },
  { value: 'it-IT', label: 'Italiano (Italia)' },
  { value: 'nl-NL', label: 'Nederlands (Nederland)' },
  { value: 'nb-NO', label: 'Norsk (Norge)' }, // Standard Norwegian
  { value: 'pl-PL', label: 'Polski (Polska)' },
  { value: 'pt-BR', label: 'Português (Brasil)' },
  { value: 'fi-FI', label: 'Suomi (Suomessa)' }, // Standard Finnish
  { value: 'sv-SE', label: 'Svenska (Sverige)' }, // Standard Swedish
  { value: 'ko-KR', label: '한국어 (한국)' }, // Standard Korean
  { value: 'ja-JP', label: '日本語 (日本)' }, // Standard Japanese
  { value: 'zh-CN', label: '简体中文 (中国)' }, // Simplified Chinese
  { value: 'zh-TW', label: '繁體中文 (中文 - 台灣)' } // Traditional Chinese - Taiwan
]);
