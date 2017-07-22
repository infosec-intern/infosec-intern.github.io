---
layout: post
title: dpkt + python3 = <3 (Part Three)
date: 2017-07-22
tags: python dpkt misp
---
## Integrating with MISP
Now that we can extract data with `dpkt` and filter IP data out, we can begin importing these attributes into MISP.
We can use the UDP and TCP, HTTP, and DNS modules in `dpkt` to delve further into the packet data. These modules will include information like source and destination port numbers, HTTP method, URI, and nameservers.

At the end of your handler function, you'll just return a JSON document with all of your attributes and the categories and types they fall under:
``` python
r = {'results':[{'categories':[],'types':[],'values':[]}]}
return r
```

The end result, after parsing HTTP request headers and DNS A, AAAA, and PTR queries/answers, netted me this:

![PCAP Import]({{ site.url }}/images/pcap_import.PNG)

If you want to write your own module, the [misp-module slides](https://circl.lu/assets/files/misp-training/luxembourg2017/4-misp-modules.pdf) given by Circl.lu are the best place to start.