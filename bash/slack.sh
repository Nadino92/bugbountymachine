#!/usr/bin/env bash
source constant.sh

text=$(cat $2 | tr -d '"')


if [[ ! -z $text ]]; then
  curl -X POST -H "Authorization: Bearer $SLACK_TOKEN" \
  -H 'Content-type: application/json' \
  --data "{\"channel\":\"$1\",\"text\":\"$text\"}" \
  https://slack.com/api/chat.postMessage  > /dev/null 2>&1
fi
