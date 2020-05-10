#!/usr/bin/env bash

source util.sh
source constant.sh

input="$BBDIR/inscope.txt"

rm $BBDIR/tmp/proc*
rm $BBDIR/tmp/tmp*

while IFS= read -r line
do
  queue=($(ls $domFile | grep "proc"))
  currQueue=${#queue[@]};

  while (( $currQueue >= $1 ))
  do
    sleep 30

    queue=($(ls $domFile | grep "proc"))
    currQueue=${#queue[@]};
  done

  debug "Adding $line to queue"

  ./engine.sh $line &
done < "$input"
