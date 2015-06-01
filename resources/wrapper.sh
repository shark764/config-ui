#!/bin/bash

show_usage () {
  printf "API Hostname Required: $1 \n"
  printf "Please pass in the api hostname as an argument, ex. http://localhost:9800.\n"
}

if [ -z "$1" ]
  then
    show_usage
    exit 1
  else
    sed -ri "s|http://localhost:9080|$1|g" /usr/share/nginx/html/app/env.js
    printf "Contents of env.js:\n"
    cat /usr/share/nginx/html/app/env.js
    printf "\nNginx is running... Waiting for requests...\n"
    nginx -g "daemon off;"
fi
