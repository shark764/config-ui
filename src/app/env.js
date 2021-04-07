'use strict';
angular
  .module('liveopsConfigPanel.config')
  .constant('apiHostname', 'https://qe-api.cxengagelabs.net')
  .constant('designerHostname', 'https://qe-designer.cxengagelabs.net')
  .constant('debuggerHostname', 'https://qe-debugger.cxengagelabs.net')
  .constant('config2Url', 'https://qe-config2.cxengagelabs.net')
  .constant('wfmUrl', 'https://cx-wfm-qe.cxengagelabs.net')
  .constant('qualityManagementUrl', 'https://qe-cxqm-web.cxengagelabs.net/Engage')
  .constant('s3BucketUrl', 'https://cxengagelabs-qe-configurator-images.s3.amazonaws.com')
  .constant('BIRST_URL', 'https://qe-birst.cxengagelabs.net')
  .constant('rtdRefreshRate', 30000)
  .constant('SSO_PASSWORD', 'JO4IIiv0vuzyhoYoyWpbip0QquoCQyGh')
  .constant('SPACE_ID', '2846b565-23f8-4032-b563-21f8b7a01cc5')
  .constant('helpDocsHostname', 'http://docs.cxengage.net')
  // .constant('apiHostname', 'http://localhost:9080')
  // .constant('designerHostname', 'http://localhost:1339')
  // .constant('debuggerHostname', 'http://localhost:4200')
  // .constant('config2Url', 'http://localhost:3000')
  .constant('CxEngageConfig', {
    baseUrl: 'https://qe-api.cxengagelabs.net/v1/',
    // baseUrl: 'http://localhost:9080/v1/',
    logLevel: 'debug',
    // environment is modified in the Jenkins deploy task, best not to override this
    environment: 'qe',
    blastSqsOutput: true,
    locale: 'en-US',
    reportingRefreshRate: 10000,
    supervisorMode: true
  });
