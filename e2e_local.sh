#!/bin/bash
set -e

## Use the location of the script to log output
export E2E_LOG_FILE="$( cd "$(dirname "${BASH_SOURCE}")" ; pwd -P )"/../e2e_log.txt
cd "$( cd "$(dirname "${BASH_SOURCE}")" ; pwd -P )"

export SAUCE_BUILD=stageing
export SAUCE_TAG=regression

FILES="$( cd "$(dirname "${BASH_SOURCE}")" ; pwd -P )"/e2e/**/*.spec.js

echo "***** Config-UI E2E Tests *****" | tee -a ${E2E_LOG_FILE}

for f in $FILES
do
  fname=`expr "$f" : '.*\(\/.*\/.*.spec.js\)'` ## Extract file name with suite: /suite/name.spec.js
	echo "***** $fname *****" | tee -a ${E2E_LOG_FILE}
  export SAUCE_SUITE_NAME=$fname
  export E2E_TEST_SUITE=$f
  gulp protractor:local | tee -a ${E2E_LOG_FILE}
done
