# README #

## Quick summary ##
Visual front-end for the LiveOps Configuration API.

## Version ##
0.0.0

### How do I get set up? ###

1. install nodejs (https://nodejs.org/download/)
1. install docker (https://docs.docker.com/installation/)
1. npm install -g gulp
1. npm install
1. bower install
1. if necessary, login to the docker.liveopslabs.com (if you need creds, please check confluence)
1. docker run -it --privileged=true -v /var/lib/docker:/var/lib/docker -p 9080:9080 --name bs-api docker.liveopslabs.com/bs-api
1. gulp serve

*To configure the API end-point, you can change the app/env.js apiHostname.

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
Run all suites locally (uses config at /protractor.local.conf.js)
```shell
$ gulp protractor:local
```

Run all suites on saucelabs (uses config at /protractor.conf.js)
```shell
$ gulp protractor
```

## Team ##
* John Benson (john.benson@bluespurs.com)
* Phil Hachey (phil.hachey@bluespurs.com)
* Samantha Routledge (samantha.routledge@bluespurs.com)
* Sasha Wilcox (sasha.wilcox@bluespurs.com)
* Greg Royan (greg.royan@bluespurs.com)
