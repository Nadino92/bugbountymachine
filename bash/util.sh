#!/usr/bin/env bash

function percentage(){
  val=$1
  max=$2

  x=$(($val * 100 / $max))

  echo -ne "$bars"' ('"$x"'%)\r'
}

function debug(){
  msg=$1

  echo -e "\033[1;33m[*]\033[0m $msg"
  echo -ne '\n'
}

function getExtension(){
  filename=$(basename -- "$1")
  echo "${filename##*.}"
}
