#!/usr/bin/env bash

source util.sh
source constant.sh

input="$BBDIR/inscope.txt"



while IFS= read -r line
do
  debug "Adding $line to queue"
  engine.sh $line
done < "$input"
