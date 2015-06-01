#!/bin/bash

if [ -n "$1" ]
  then
  sed -ri "s|http://localhost:9080|$1|g" /var/www/app/env.js
  printf "Contents of env.js:\n"
  cat /var/www/app/env.js
fi

printf "\nNginx is running... Waiting for requests...\n"
nginx -g "daemon off;"
