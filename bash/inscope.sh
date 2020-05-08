#!/usr/bin/env bash

source util.sh
source constant.sh

input="$BBDIR/inscope.txt"

while IFS= read -r line
do
  currQueue=$(getQueue)

  while (( $currQueue == 0 ))
  do
    sleep 2m
  done

  debug "Adding $line to queue"

  decreaseQueue
  ./engine.sh $line &

done < "$input"
