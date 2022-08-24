#!/usr/bin/env bash
echo "Creating new screen session and run yarn start"
screen -dmS run-webapp
screen -S run-webapp -X stuff 'yarn start\n'
while :
  do sleep 1000
done
