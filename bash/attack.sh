#!/bin/bash

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

debug "Run gau for $subdomain"

allurls=($(gau $subdomain))

debug "Progress bar for $subdomain for ${#allurls[@]} urls"

index=0

for url in "${allurls[@]}"
do
    extension=$(getExtension $url)

    if [[ ! " ${noXssFiles[@]} " =~ " ${extension} " ]]; then
      if [[ $url == *"="* && $url == *"?"* ]]; then
        var=1
        #dalfox url $url --silence -blind https://nadino.xss.ht | grep "Triggered XSS payload" 1>> $xssFile$domain 2>/dev/null
      fi
    fi

    if [ "$extension" == "js" ]; then
      echo $url | nuclei -silent -t "$BBDIR/nuclei-templates/tokens/*.yaml" >> $nucleiFile$domain
      echo $url | nuclei -silent -t "$BBDIR/nuclei-templates/noisy/*.yaml" >> $nucleigFile$domain
    fi

    let "index++"

    percentage $index ${#allurls[@]}
done
echo -ne '\n'
