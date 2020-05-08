#!/usr/bin/env bash

source constant.sh
source util.sh

domain=$1

debug "Started engine for $domain"

templates=(
    "$nucleiTempDir/tokens/google-api-key.yaml"
    "$nucleiTempDir/panels/*.yaml"
    "$nucleiTempDir/security-misconfiguration/*.yaml"
    "$nucleiTempDir/subdomain-takeover/*.yaml"
    "$nucleiTempDir/files/*.yaml"
    "$nucleiTempDir/cves/*.yaml"
    )

nucleiFile="$nucleiFile$domain"
nucleigFile="$nucleigFile$domain"
tmpFile="$tmpFile$domain"
domFile="$domFile$domain"

debug "Starting amass for $domain"

amass enum --passive -d $domain 1> $tmpFile 2>/dev/null

debug "Starting httprobe for $domain"

cat $tmpFile | httprobe --prefer-https > $domFile
rm $tmpFile

for template in "${templates[@]}"
do
    debug "Nuclei $template started for $domain"
    nuclei -silent -t "$template" -l $domFile >> $nucleiFile
done

while IFS= read -r line
do
  debug "Attacking $line"
  ./attack.sh $line $domain
done < "$domFile"

alertFiles $domain

increaseQueue
