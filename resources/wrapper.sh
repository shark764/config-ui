#!/bin/bash

CONFIG=/var/www/app/env.js

if [ -n "$1" ]
  then
  sed -ri "s|('apiHostname', )(.*)(\).*)|\1\'$1\'\3|g" $CONFIG
fi

if [ -n "$2" ]
  then
  sed -ri "s|('BIRST_URL', )(.*)(\).*)|\1\'$2\'\3|g" $CONFIG
  sed -ri "s|('SSO_PASSWORD', )(.*)(\).*)|\1\'$3\'\3|g" $CONFIG
  sed -ri "s|('SPACE_ID', )(.*)(\).*)|\1\'$4\'\3|g" $CONFIG
  sed -ri "s|('HIDE_DASHBOARD_NAVIGATION', )(.*)(\).*)|\1\'$5\'\3|g" $CONFIG


fi

printf "Contents of $CONFIG:\n"
cat $CONFIG
printf "\nNginx is running... Waiting for requests...\n"
nginx -g "daemon off;"

