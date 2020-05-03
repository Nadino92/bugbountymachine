#!/usr/bin/env python
import sys
import time
import os
import json
import requests
from pprint import pprint
from zapv2 import ZAPv2


apiKey = os.environ['ZAP_API']
target = sys.argv[1]
zap = ZAPv2(apikey=apiKey, proxies={'http': 'http://127.0.0.1:8080', 'https': 'http://127.0.0.1:8080'})

scanID = zap.spider.scan(target)

while int(zap.spider.status(scanID)) < 100:
    time.sleep(1)

# TODO : explore the app (Spider, etc) before using the Passive Scan API, Refer the explore section for details
while int(zap.pscan.records_to_scan) > 0:
    # Loop until the passive scan has finished
    #print('Records to passive scan : ' + zap.pscan.records_to_scan)
    time.sleep(2)

#print('Passive Scan completed')

# Print Passive scan results/alerts
#print('Hosts: {}'.format(', '.join(zap.core.hosts)))
#print('Alerts: ')


bannedAlerts = [
    "CSP Scanner: Wildcard Directive",
    "X-Frame-Options Header Not Set",
    "CSP Scanner: style-src unsafe-inline"
    ]

headers = {
    'Authorization': 'Bearer '+os.environ['SLACK_TOKEN'],
    'Content-type': 'application/json'
}

for a in zap.core.alerts():
    if a['risk'] == "Medium" or a['risk'] == "High":
        if a['alert'] not in bannedAlerts:
            data = '{"channel":"zap","text":"ZAP alert => '+a['alert']+'\n'+a['url']+'"}'
            requests.post("https://slack.com/api/chat.postMessage", headers=headers, data=data)
