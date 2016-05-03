# README #

## Quick summary ##
Visual front-end for the LiveOps Configuration API.

## Current Build Status ##
[![Build Status](https://vpn.liveopslabs.com/buildStatus/icon?job=config-ui)](http://jenkins.liveopslabs.com/job/config-ui/)

## Version ##
2.1.0

### How do I get set up? ###

1. Clone the repository
1. From the root directory of the repo, run the following command: `npm install && bower install`
1. Run `gulp serve` to start the application

<sub>For API development, configurator must be set up according to [this article](https://liveops.atlassian.net/wiki/display/TITAN/Local+Configurator+Environment+Setup)</sub>

**Note:** To configure the API end-point, you can change the app/env.js apiHostname.

### How do I make a new release? ###

[Click Here](https://liveops.atlassian.net/wiki/display/TITAN/Releasing+a+new+Config-UI)

### Unit tests ###
Run all unit tests
```shell
$ gulp test
```

Run unit tests and generate coverage report (view report at /coverage/PhantomJS [version]/index.html)
```shell
$ gulp coverage
```

Run a single spec file
```shell
$ gulp test:single --specFile="path/to/file.spec.js"
```

### E2E tests ###
Login uses params.login in the respective config file and is default to titan@liveops.com
Do not run the suite on a shared API as many records are created and edited.
Tests depend on availability of Mailinator and expect that invitation emails are redirected to titantest@mailinator.com
E2E Tests do not cover the following:
* Media Upload
* Flow designer
* Reporting Dashboards
* All browser support
* Links to external pages (Help Docs)
* Interaction with Toolbar or other components

Run all suites locally (uses config at /protractor.local.conf.js)
```shell
$ ./e2e_local.sh
```

Run all suites on saucelabs (uses config at /protractor.conf.js)
```shell
$ ./e2e_sauce.sh <SAUCE_USERNAME> <SAUCE_ACCESS_KEY> <SAUCE_TUNNEL>
```

## Team ##
* Josh Stevens (jstevens@liveops.com)
* Samuel Stiles (sstiles@liveops.com)
* Matthew Jones (mjones@liveops.com)
* Nick Fitzpatrick (nfitzpatrick@liveops.com)
