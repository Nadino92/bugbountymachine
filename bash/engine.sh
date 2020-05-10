#!/usr/bin/env bash

source constant.sh
source util.sh

domain=$1
pid=$$
echo $pid > $procFile$pid

debug "Started engine for $domain"

templates=(
"$nucleiTempDir/tokens/amazon-mws-auth-token-value.yaml"
"$nucleiTempDir/tokens/aws-access-key-value.yaml"
"$nucleiTempDir/tokens/google-api-key.yaml"
"$nucleiTempDir/tokens/http-username-password.yaml"
"$nucleiTempDir/tokens/mailchimp-api-key.yaml"
"$nucleiTempDir/tokens/slack-access-token.yaml"
"$nucleiTempDir/vulnerabilities/cached-aem-pages.yaml"
"$nucleiTempDir/vulnerabilities/crlf-injection.yaml"
"$nucleiTempDir/vulnerabilities/discourse-xss.yaml"
"$nucleiTempDir/vulnerabilities/moodle-filter-jmol-lfi.yaml"
"$nucleiTempDir/vulnerabilities/moodle-filter-jmol-xss.yaml"
"$nucleiTempDir/vulnerabilities/path-based-open-redirect-1.yaml"
"$nucleiTempDir/vulnerabilities/pdf-signer-ssti-to-rce.yaml"
"$nucleiTempDir/vulnerabilities/twig-php-ssti.yaml"
"$nucleiTempDir/vulnerabilities/wordpress-duplicator-path-traversal.yaml"
"$nucleiTempDir/vulnerabilities/wordpress-wordfence-xss.yaml"
"$nucleiTempDir/vulnerabilities/x-forwarded-host-injection.yaml"
"$nucleiTempDir/panels/cisco-asa-panel.yaml"
"$nucleiTempDir/panels/globalprotect-panel.yaml"
"$nucleiTempDir/panels/grafana-detect.yaml"
"$nucleiTempDir/panels/jenkins-asyncpeople.yaml"
"$nucleiTempDir/panels/mongo-express-web-gui.yaml"
"$nucleiTempDir/panels/parallels-html-client.yaml"
"$nucleiTempDir/panels/phpmyadmin-panel.yaml"
"$nucleiTempDir/panels/sap-netweaver-detect.yaml"
"$nucleiTempDir/panels/supervpn-panel.yaml"
"$nucleiTempDir/panels/swagger-panel.yaml"
"$nucleiTempDir/panels/webeditors.yaml"
"$nucleiTempDir/security-misconfiguration/basic-cors-flash.yaml"
"$nucleiTempDir/security-misconfiguration/basic-cors.yaml"
"$nucleiTempDir/security-misconfiguration/jira-service-desk-signup.yaml"
"$nucleiTempDir/security-misconfiguration/springboot-detect.yaml"
"$nucleiTempDir/subdomain-takeover/detect-all-takeovers.yaml"
"$nucleiTempDir/files/apc_info.yaml"
"$nucleiTempDir/files/dir-listing.yaml"
"$nucleiTempDir/files/docker-registry.yaml"
"$nucleiTempDir/files/drupal-install.yaml"
"$nucleiTempDir/files/firebase-detect.yaml"
"$nucleiTempDir/files/git-config.yaml"
"$nucleiTempDir/files/jkstatus-manager.yaml"
"$nucleiTempDir/files/phpinfo.yaml"
"$nucleiTempDir/files/server-status-localhost.yaml"
"$nucleiTempDir/files/telerik-fileupload-detect.yaml"
"$nucleiTempDir/files/wadl-files.yaml"
"$nucleiTempDir/files/zip-backup-files.yaml"
"$nucleiTempDir/cves/CVE-2017-9506.yaml"
"$nucleiTempDir/cves/CVE-2018-0296.yaml"
"$nucleiTempDir/cves/CVE-2018-1247.yaml"
"$nucleiTempDir/cves/CVE-2018-13379.yaml"
"$nucleiTempDir/cves/CVE-2018-14728.yaml"
"$nucleiTempDir/cves/CVE-2018-2791.yaml"
"$nucleiTempDir/cves/CVE-2018-3760.yaml"
"$nucleiTempDir/cves/CVE-2018-5230.yaml"
"$nucleiTempDir/cves/CVE-2018-7490.yaml"
"$nucleiTempDir/cves/CVE-2019-10475.yaml"
"$nucleiTempDir/cves/CVE-2019-11510.yaml"
"$nucleiTempDir/cves/CVE-2019-12314.yaml"
"$nucleiTempDir/cves/CVE-2019-14974.yaml"
"$nucleiTempDir/cves/CVE-2019-19368.yaml"
"$nucleiTempDir/cves/CVE-2019-19781.yaml"
"$nucleiTempDir/cves/CVE-2019-19908.yaml"
"$nucleiTempDir/cves/CVE-2019-5418.yaml"
"$nucleiTempDir/cves/CVE-2019-8903.yaml"
"$nucleiTempDir/cves/CVE-2019-8982.yaml"
"$nucleiTempDir/cves/CVE-2020-2096.yaml"
"$nucleiTempDir/cves/CVE-2020-5284.yaml"
"$nucleiTempDir/cves/CVE-2020-8115.yaml"
    )

nucleiFile="$nucleiFile$domain"
nucleigFile="$nucleigFile$domain"
tmpFile="$tmpFile$domain"
domFile="$domFile$domain"

debug "Starting amass for $domain"

amass enum --passive -d $domain 1> $tmpFile 2>/dev/null

debug "Starting httprobe for $domain"

cat $tmpFile | sort -u | httprobe --prefer-https > $domFile
rm $tmpFile

for template in "${templates[@]}"
do
    debug "Nuclei $template started for $domain"
    nuclei -silent -t "$template" -l $domFile | ./slack.sh $channelNuclei
done

while IFS= read -r line
do
  debug "Attacking $line"
  ./attack.sh $line $domain
done < "$domFile"


rm $procFile$pid
#alertFiles $domain
