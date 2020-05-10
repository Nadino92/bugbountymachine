#!/usr/bin/env python3

import urllib.parse as urlparse
from urllib.parse import parse_qs
import sys

url=sys.argv[1]

parsed = urlparse.urlparse(url)
out = url.split("?")[0]+"?"
for k in parse_qs(parsed.query):
    out+=k+"=\"><injectable>"

print(out)
