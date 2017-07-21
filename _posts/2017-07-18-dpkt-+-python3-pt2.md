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
```python
import base64
import io
raw_data = io.BytesIO(base64.b64decode(data))
with open(raw_data, "r") as ifile:
    pcap = dpkt.pcap.Reader(ifile)
```
And boom! We can start reading from the PCAP file just as if it was written to disk. While writing this blog post, I realized I probably could've done the same thing to get the pyshark module working, but I'll just let that be a lesson for another time.
I've enjoyed learning about and using dpkt, and I think after some more practice, I could find some ways to contribute back to the project.

--- work in progress ---