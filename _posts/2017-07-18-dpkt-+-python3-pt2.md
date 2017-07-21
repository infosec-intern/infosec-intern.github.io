---
layout: post
title: dpkt + python3 = <3 (Part Two)
date: 2017-07-20
modified: 2017-07-20
tags: python dpkt misp
---
## Time to get programming!
I still have to solve the problem of converting my base64-encoded PCAP to a usable format for dpkt. Thankfully, python3 makes that easy too.
The `io` module contains a couple classes - StringIO and BytesIO - that essentially act like files that are entirely in memory. Since PCAP files contain raw bytes, BytesIO is the obvious option.
A few lines of code will meet our requirements here:
``` python
import base64
import io
import dpkt

raw_data = io.BytesIO(base64.b64decode(data))
with open(raw_data, "r") as ifile:
    pcap = dpkt.pcap.Reader(ifile)
```
And boom! We can start reading from the PCAP file just as if it was written to disk. While writing this blog post, I realized I probably could've done the same thing to get the pyshark module working, but I'll just let that be a lesson for another time.
Plus, I've enjoyed learning about and using dpkt, and I think after some more practice, I could find some ways to contribute back to the project.

Next challenge: start parsing the PCAP for interesting data. If you're familiar with networking, you'll know it's not as simple as just picking the HTTP packets out; there are many layers inside each packet that need to be parsed before we can determine if a packet is even used for HTTP or not.
IP addresses, for example, can be extracted from a packet with or without an HTTP header. The dpkt module makes it simple to pull out IP data, and python3's `ipaddress` module makes working with IPs a breeze - I barely need to know subnet masks or IP versions to make a good parser.

``` python
import ipaddress
import dpkt

for packet in pcap:
    # dpkt extracts packets as tuples: (timestamp, buffer)
    # only convert the buffer data into an Ethernet packet
    if isinstance(packet[1], dpkt.ethernet.Ethernet):
        eth = dpkt.ethernet.Ethernet(packet[1])
        ip = eth.data
        # dpkt stores ip.src and ip.dst as byte strings from the code:
        #       ('src', '4s', b'\x00' * 4),
        #       ('dst', '4s', b'\x00' * 4)
        srcip = ipaddress.ip_address(ip.src)
        dstip = ipaddress.ip_address(ip.dst)
```
