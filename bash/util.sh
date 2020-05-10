#!/usr/bin/env bash

source constant.sh

alertFiles=( "$nucleiFile:nuclei-general"
        "$nucleigFile:nuclei-noisy"
        "$xssFile:xss"
        "$sqliFile:sqli" )

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
  prefix=="${1%?*}?"
  echo "cazzo $prefix"
  filename=$(basename -- "$prefix")
  echo "filename $filename"
  echo "finale ${filename##*.}"
  echo "${filename##*.}"
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
