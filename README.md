# README #

## Quick summary ##
Visual front-end for the LiveOps Configuration API.

## Current Build Status ##
[![Build Status](https://vpn.liveopslabs.com/buildStatus/icon?job=config-ui)](http://jenkins.liveopslabs.com/job/config-ui/)

## Version ##
0.0.0

### How do I get set up? ###

1. install nodejs (https://nodejs.org/download/)
1. install docker (https://docs.docker.com/installation/) *
1. npm install -g gulp
1. npm install
1. bower install
1. if necessary, login to the docker.liveopslabs.com (if you need creds, please check confluence) *
1. run api according to https://github.com/liveops/api-containers *
1. gulp serve

<br>
<sub>* For API development only</sub>

**Note:** To configure the API end-point, you can change the app/env.js apiHostname.

### Unit tests ###
Run all unit tests
```shell
$ gulp test
```

Run unit tests and generate coverage report (view report at /coverage/PhantomJS [version]/index.html)
```shell
$ gulp coverage
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
* John Benson (john.benson@bluespurs.com)
* Phil Hachey (phil.hachey@bluespurs.com)
* Samantha Routledge (samantha.routledge@bluespurs.com)
* Sasha Wilcox (sasha.wilcox@bluespurs.com)
* Greg Royan (greg.royan@bluespurs.com)
* Todd Roper (troper@liveops.com)
* Doron Orenstein (dorenstein@loveops.com)
