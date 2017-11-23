#!/bin/bash

CONFIG=/var/www/app/env.js
VENDOR=$(find /var/www/scripts/vendor-*.js)

if [ -n "$1" ]
  then
  sed -ri "s|('apiHostname', )(.*)(\).*)|\1\'$1\'\3|g" $CONFIG
  sed -ri "s|(https://dev-api.liveopslabs.com)|$1|g" $VENDOR
fi

if [ -n "$2" ]
  then
  sed -ri "s|('BIRST_URL', )(.*)(\).*)|\1\'$2\'\3|g" $CONFIG
  sed -ri "s|('SSO_PASSWORD', )(.*)(\).*)|\1\'$3\'\3|g" $CONFIG
  sed -ri "s|('SPACE_ID', )(.*)(\).*)|\1\'$4\'\3|g" $CONFIG
fi

if [ -n "$5" ]
  then
  sed -ri "s|('rtdRefreshRate', )(.*)(\).*)|\1\'$5\'\3|g" $CONFIG
fi

if [ -n "$6" ]
  then
  sed -ri "s|('designerHostname', )(.*)(\).*)|\1\'$6\'\3|g" $CONFIG
fi

printf "Contents of $CONFIG:\n"
cat $CONFIG
printf "\nNginx is running... Waiting for requests...\n"
nginx -g "daemon off;"

