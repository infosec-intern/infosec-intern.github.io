---
layout: post
title: dpkt + python3 = <3 (Part Two)
date: 2017-07-20
modified: 2017-07-22
tags: python dpkt misp
---
## Time to get programming!
I still have to solve the problem of converting my base64-encoded PCAP to a usable format for `dpkt`. Thankfully, python3 makes that easy too.
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
Plus, I've enjoyed learning about and using `dpkt`, and I think after some more practice, I could find some ways to contribute back to the project.

Next challenge: start parsing the PCAP for interesting data. If you're familiar with networking, you'll know it's not as simple as just picking the HTTP packets out; there are many layers inside each packet that need to be parsed before we can determine if a packet is even used for HTTP or not.
IP addresses, for example, can be extracted from a packet with or without an HTTP header. The `dpkt` module makes it simple to pull out IP data, and python3's `ipaddress` module makes working with IPs a breeze - I barely need to know subnet masks or IP versions to make a good parser.

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
        # this method determines if ip.src/ip.dst is an ipv4 or ipv6 address
        # and then it instantiates that class and returns it
        # very useful if you're not sure which address type you're handling
        srcip = ipaddress.ip_address(ip.src)
        dstip = ipaddress.ip_address(ip.dst)
```

From this point on, we can easily implement a whitelist-like capability.
This is espcially useful for IPv4, which makes extensive use of NATing (Network Address Translation-ing) to separate private and public networks. Certain subnets like `10.0.0.0/8` and `192.168.0.0/16` are used for internal networks, and we can tell our MISP module to exclude this IPs from being added.
The `ipaddress` module can create subnets just as easily as IP addresses, and then we can determine if an IP address is in a subnet with a simple `in` statement like so:

``` python
import ipaddress

subnets = ["10.0.0.0/8", "192.168.0.0/16"]
addresses = ["192.168.1.1", "1.1.1.1", "127.0.0.1"]

for address in addresses:
    ip = ipaddress.ip_address(address)
    for subnet in subnets:
        # much like the ip_address() method, ip_network() figures out
        # ipv4 and ipv6 subnets on its own
        network = ipaddress.ip_network(subnet)
        if ip in network:
            print("%s is whitelisted" % ip)
```

Now that we can extract data with `dpkt` and filter IP data out, we can begin importing these attributes into MISP. At the end of your handler function, you'll just return a JSON document with all of your attributes and the categories and types they fall under:
``` python
r = {'results':[{'categories':[],'types':[],'values':[]}]}
return r
```

The end result, after parsing HTTP request headers and DNS A, AAAA, and PTR queries/answers, netted me this:

![PCAP Import]({{ site.url }}/images/pcap_import.PNG)

If you want to write your own module, the [misp-module slides](https://circl.lu/assets/files/misp-training/luxembourg2017/4-misp-modules.pdf) given by Circl.lu are the best place to start.