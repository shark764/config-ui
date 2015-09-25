#!/bin/bash
set -e

## Use the location of the script to log output
export E2E_LOG_FILE="$( cd "$(dirname "${BASH_SOURCE}")" ; pwd -P )"/../e2e_log.txt
cd "$( cd "$(dirname "${BASH_SOURCE}")" ; pwd -P )"

export SAUCE_USERNAME=$1
export SAUCE_ACCESS_KEY=$2
export SAUCE_TUNNEL=$3

export SAUCE_BUILD=stageing
export SAUCE_TAG=regression

echo "***** Config-UI E2E Tests *****" | tee -a ${E2E_LOG_FILE}

echo "***** LOGIN *****" | tee -a ${E2E_LOG_FILE}
export SAUCE_SUITE_NAME=Login
export E2E_TEST_SUITE=/login/*.spec.js
gulp protractor | tee -a ${E2E_LOG_FILE}

echo "***** NAVIGATION *****" | tee -a ${E2E_LOG_FILE}
export SAUCE_SUITE_NAME=Navigation
export E2E_TEST_SUITE=/navigation/*.spec.js
gulp protractor | tee -a ${E2E_LOG_FILE}

echo "***** TABLE CONTROLS *****" | tee -a ${E2E_LOG_FILE}
export SAUCE_SUITE_NAME=Table Controls
export E2E_TEST_SUITE=/tableControls/*.spec.js
gulp protractor | tee -a ${E2E_LOG_FILE}

echo "***** MANAGEMENT *****" | tee -a ${E2E_LOG_FILE}
export SAUCE_SUITE_NAME=Management
export E2E_TEST_SUITE=/management/*.spec.js
gulp protractor | tee -a ${E2E_LOG_FILE}

echo "***** CONFIGURATION *****" | tee -a ${E2E_LOG_FILE}
export SAUCE_SUITE_NAME=Configuration
export E2E_TEST_SUITE=/configuration/*.spec.js
gulp protractor | tee -a ${E2E_LOG_FILE}

echo "***** FLOWS *****" | tee -a ${E2E_LOG_FILE}
export SAUCE_SUITE_NAME=Flows
export E2E_TEST_SUITE=/flows/*.spec.js
gulp protractor | tee -a ${E2E_LOG_FILE}

echo "***** USER PROFILE *****" | tee -a ${E2E_LOG_FILE}
export SAUCE_SUITE_NAME=UserProfile
export E2E_TEST_SUITE=/userProfile/*.spec.js
gulp protractor | tee -a ${E2E_LOG_FILE}

echo "***** TENANT SWITCHING *****" | tee -a ${E2E_LOG_FILE}
export SAUCE_SUITE_NAME=TenantSwitching
export E2E_TEST_SUITE=/tenantSwitching/*.spec.js
gulp protractor | tee -a ${E2E_LOG_FILE}
