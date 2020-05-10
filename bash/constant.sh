#!/usr/bin/env bash

BBDIR="$HOME/bugbountymachine"

nucleiFile="$BBDIR/tmp/nuclei_"
nucleigFile="$BBDIR/tmp/nucleig_"
xssFile="$BBDIR/tmp/xss_"
sqliFile="$BBDIR/tmp/sqli_"

tmpFile="$BBDIR/tmp/tmp_"
domFile="$BBDIR/tmp/"
procFile="$BBDIR/tmp/proc_"

xssPayload="\"><injectable>"

nucleiTempDir="$BBDIR/nuclei-templates"
massdnsDir="$BBDIR/massdns/"

channelNucleiNoisy="nuclei-noisy"
channelNuclei="nuclei-general"
channelXss="xss"
