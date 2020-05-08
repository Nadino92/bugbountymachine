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

allurls=($(gau $subdomain))

echo "Progress bar for $subdomain for ${#allurls[@]} urls"

index=0

for url in "${allurls[@]}"
do
    extension=$(getExtension $url)

    if [[ ! " ${noXssFiles[@]} " =~ " ${extension} " ]]; then
      if [[ $url == *"="* && $url == *"?"* ]]; then
        var=1
        #dalfox url $url -blind https://nadino.xss.ht
      fi
    fi

    if [ "$extension" == "js" ]; then
      echo $url | nuclei -silent -t "$BBDIR/nuclei-templates/tokens/general-tokens.yaml" >> $nucleiFile$domain
    fi

    let "index++"

    percentage $index ${#allurls[@]}
done
echo -ne '\n'
