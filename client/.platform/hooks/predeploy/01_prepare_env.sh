#!/usr/bin/env bash
set -x
export PATH=./node_modules/.bin:$PATH
echo "postdeploy: Preparing .env file"
cat /opt/elasticbeanstalk/deployment/env > /var/app/current/.env
echo "postdeploy: Renaming _package.json back to package.json"
mv _package.json package.json
echo "postdeploy: Running: yarn add cross-env@^7.0.2"
yarn add cross-env@^7.0.2
