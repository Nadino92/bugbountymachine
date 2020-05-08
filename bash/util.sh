#!/usr/bin/env bash

source constant.sh

alertFiles=( "$nucleiFile:nuclei-general"
        "$nucleigFile:nuclei-noisy"
        "$xssFile:xss"
        "$sqliFile:sqli" )

queue=4

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

function decreaseQueue(){
  let "queue--"
  debug "Queue decreased now is $queue"
}

function increaseQueue(){
  let "queue++"
  debug "Queue increased now is $queue"
}

function getQueue(){
  echo $queue
}

function alertFiles(){
  domain=$1

  for item in "${alertFiles[@]}"
  do
    file="${item%%:*}"
    channel="${item##*:}"
    if [[ -f $file ]]; then
      if [[ -s $file ]]; then
        debug "Sending notification for $file on channel $channel"
        ./slack.sh "$channel" "$file"
      fi
      rm $file
    fi
  done

}
