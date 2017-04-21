'use strict';
angular.module('liveopsConfigPanel.config')
  // .constant('apiHostname', 'http://localhost:9080')
  .constant('apiHostname', 'https://dev-api.cxengagelabs.net')
  .constant('s3BucketUrl', 'https://cxengagelabs-dev-configurator-images.s3.amazonaws.com')
  .constant('BIRST_URL', 'https://dev-birst.cxengagelabs.net')
  .constant('rtdRefreshRate', 30000)
  .constant('SSO_PASSWORD', 'JO4IIiv0vuzyhoYoyWpbip0QquoCQyGh')
  .constant('SPACE_ID', '2846b565-23f8-4032-b563-21f8b7a01cc5')
  .constant('helpDocsHostname', 'http://docs.cxengage.net');
