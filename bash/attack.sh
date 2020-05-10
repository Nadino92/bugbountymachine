#!/usr/bin/env bash

source util.sh
source constant.sh

subdomain=$1
domain=$2

noXssFiles=("jpg"
            "jpeg"
            "gif"
            "css"
            "tif"
            "tiff"
            "png"
            "ttf"
            "woff"
            "woff2"
            "ico"
            "pdf"
            "svg"
            "txt"
            "js")

checksum=()

debug "Run gau for $subdomain"

allurls=($(timeout 300 gau $subdomain | sort -u | egrep ".js|=" | egrep -v ".(jpg|jpeg|gif|css|tif|tiff|png|ttf|woff|woff2|ico|pdf|svg|txt)"))

debug "Progress bar for $subdomain for ${#allurls[@]} urls"

index=0

for url in "${allurls[@]}"
do
    extension=$(getExtension $url)

    if [[ ! " ${noXssFiles[@]} " =~ " ${extension} " && $url != *".js"* ]]; then
      if [[ $url == *"="* && $url == *"?"* ]]; then
        newurl=$(./urlparse.py $url)

        echo $newurl | nuclei -silent -t "$BBDIR/nuclei-templates/noisy/general-xss.yaml" | ./slack.sh $channelXss
      fi
    fi

    if [ "$url" == *".js"* ]; then
      echo $url | nuclei -silent -t "$BBDIR/nuclei-templates/tokens/*.yaml" | ./slack.sh $channelNuclei

      #outNucleiN=$(echo $url | nuclei -silent -t "$BBDIR/nuclei-templates/noisy/general-tokens.yaml")
      #md5NucleiN=$(echo $outNucleiN | md5sum | head -c 7)

      #if [[ ! " ${checksum[@]} " =~ " ${md5NucleiN} " ]]; then
      #  echo "$outNucleiN" | ./slack.sh $channelNucleiNoisy

        #debug "Adding $md5NucleiN to the checksums"
      #  checksum+=($md5NucleiN)
      #fi

    fi

    let "index++"

    percentage $index ${#allurls[@]}
done
echo -ne '\n'
