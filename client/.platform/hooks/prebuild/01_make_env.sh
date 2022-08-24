#!/usr/bin/env bash
set -x
export PATH=./node_modules/.bin:$PATH
old_screen_pid=$(screen -ls|grep run-webapp|cut -d'.' -f1)
echo "Killing existing screen pid $old_screen_pid"
kill -9 $old_screen_pid
screen -wipe
echo "prebuild: Removing node_modules"
rm -rf node_modules
echo "prebuild: Removing package-lock.json"
rm package-lock.json
# echo "prebuild: Copying environmental variables to .env"
# cat /opt/elasticbeanstalk/deployment/env > /var/app/current/.env
echo "prebuild: Installing node-v12.16.1"
if [ -d /opt/elasticbeanstalk/node-install/node-v12.16.1-linux-x64 ];then
  echo "prebuild: node-v12.16.1-linux-x64 exists, skipping"
else
  echo "prebuild: Downloading node-v12.16.1-linux-x64"
  curl https://nodejs.org/download/release/v12.16.1/node-v12.16.1-linux-x64.tar.gz -o /tmp/node-v12.16.1-linux-x64.tar.gz
  echo "prebuild: Extracting node-v12.16.1-linux-x64 to path: /opt/elasticbeanstalk/node-install/"
  tar xzf  /tmp/node-v12.16.1-linux-x64.tar.gz -C /opt/elasticbeanstalk/node-install/
fi
echo "prebuild: Setting symbolic link `npm`"
ln -sf /opt/elasticbeanstalk/node-install/node-v12.16.1-linux-x64/bin/npm /usr/bin/npm
echo "prebuild: Setting symbolic link `node`"
ln -sf /opt/elasticbeanstalk/node-install/node-v12.16.1-linux-x64/bin/node /usr/bin/node
echo "prebuild: Instaling yarn"
npm install --production yarn@^1.22.10
ln -sf `pwd`/node_modules/.bin/yarn /usr/bin/yarn
echo "prebuild: Running yarn install"
yarn install
echo "prebuild: Setting symbolic link `yarn`"
ln -sf /var/app/current/node_modules/.bin/yarn /usr/bin/yarn
echo "prebuild: Renaming package.json to _package.json to avoid Benstalk to run `npm install`"
mv package.json _package.json
