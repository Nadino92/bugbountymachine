#!/usr/bin/env bash

input="$BBDIR/inscope.txt"
while IFS= read -r line
do
  echo "Read $line"
  engine.sh $line
done < "$input"
