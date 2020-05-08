#!/usr/bin/env bash

source constant.sh

domain=$1

templates=(
    "$nucleiTempDir/tokens/*.yaml"
    "$nucleiTempDir/panels/*.yaml"
    "$nucleiTempDir/security-misconfiguration/*.yaml"
    "$nucleiTempDir/subdomain-takeover/*.yaml"
    "$nucleiTempDir/technologies/*.yaml"
    "$nucleiTempDir/files/*.yaml"
    )

nucleiFile="$nucleiFile$domain"
tmpFile="$tmpFile$domain"
domFile="$domFile$domain"

amass enum --passive -d $domain | $massdnsDir/bin/massdns -r $massdnsDir/lists/resolvers.txt -t AAAA -o Sm -w $tmpFile

cat $tmpFile | httprobe --prefer-https > $domFile

for template in "${templates[@]}"
do
    echo "skip"
    nuclei -silent -t "$template" -l $domFile >> $nucleiFile
done



while IFS= read -r line
do
  ./attack.sh $line $domain
done < "$domFile"


if [[ -f $nucleiFile && -s $nucleiFile ]]; then
    echo "skip"
    ./slack.sh "nuclei-general" "$nucleiFile"
fi

#rm $nucleiFile
