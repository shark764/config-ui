#!/bin/bash
set -e

node -v
npm -v
bower -v
npm i && bower install

npm run build

cd ..
cp -r app/dist/* mount
