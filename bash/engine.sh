#!/usr/bin/env bash

source constant.sh
source util.sh

domain=$1

debug "Started engine for $domain"

templates=(
    "$nucleiTempDir/tokens/*.yaml"
    "$nucleiTempDir/panels/*.yaml"
    "$nucleiTempDir/security-misconfiguration/*.yaml"
    "$nucleiTempDir/subdomain-takeover/*.yaml"
    "$nucleiTempDir/files/*.yaml"
    )

nucleiFile="$nucleiFile$domain"
nucleigFile="$nucleigFile$domain"
tmpFile="$tmpFile$domain"
domFile="$domFile$domain"

#amass enum -active -d $domain > $tmpFile

#cat $tmpFile | httprobe --prefer-https > $domFile

for template in "${templates[@]}"
do
    nuclei -silent -t "$template" -l $domFile >> $nucleiFile
done

while IFS= read -r line
do
  ./attack.sh $line $domain
done < "$domFile"

if [[ -f $nucleiFile && -s $nucleiFile ]]; then
    ./slack.sh "nuclei-general" "$nucleiFile"
fi

if [[ -f $nucleigFile && -s $nucleigFile ]]; then
    ./slack.sh "nuclei-noisy" "$nucleigFile"
fi

rm $nucleigFile $nucleiFile
