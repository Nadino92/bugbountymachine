#!/usr/bin/env bash

function percentage(){
  val=$1
  max=$2

  x=$(($val * 100 / $max))

  echo -ne "$bars"' ('"$x"'%)\r'
}

function getExtension(){
  filename=$(basename -- "$1")
  echo "${filename##*.}"
}
