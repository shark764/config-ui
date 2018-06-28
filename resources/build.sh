#!/bin/bash
set -e

node -v
npm -v
bower -v
npm i && bower install

mv resources/config_pr.json dist/config_pr.json

npm run build
cd ..
cp -r app/dist/* mount
