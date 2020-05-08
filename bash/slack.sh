#!/usr/bin/env bash


text=$(cat $2 | tr -d '"')

curl -X POST -H "Authorization: Bearer $SLACK_TOKEN" \
-H 'Content-type: application/json' \
--data "{\"channel\":\"$1\",\"text\":\"$text\"}" \
https://slack.com/api/chat.postMessage  > /dev/null 2>&1
