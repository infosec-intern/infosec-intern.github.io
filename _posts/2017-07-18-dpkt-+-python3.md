---
layout: post
title: dpkt + python3 = <3
date: 2017-07-18
tags: python dpkt misp
---
Lately I've been working on a [MISP module](https://github.com/MISP/misp-modules) for importing indicators from PCAP files. There's already a similar tool under the [MISP sightings tools](https://github.com/MISP/misp-sighting-tools), but it requires command-line use and, in my opinion, there should be some kind of integration with the UI for analysts with less command-line experience.

When I started this, I looked pretty extensively at that tool, `pcap-reader.py`, and saw it spawned tshark under a subprocess to do its parsing. I'm not too familiar with tshark, and I wanted to do this purely in python. At first, I thought I'd have a perfect python-only pcap parser (alliterations :D) in Scapy. It's well known, well documented, and it only works on python2...wait, it only works on python2? MISP's backend is written in pure python3, which means any potential MISP users would have to support both python 2 and 3 on their servers - potentially far past python2's support date. Also, ever since my friend [Tayler](https://tayler.me) convinced me to switch to python3, I haven't looked back. Given my lack of desire to write in python2 again, and the lack of python2 support in MISP, I decided Scapy was a poor option. Back to the drawing board!

After a little more research, I found some StackOverflow articles about a module called [pyshark](https://github.com/KimiNewt/pyshark). What's that? It's basically a python wrapper around tshark. It doesn't do any parsing itself; it simply [calls a subprocess](https://github.com/KimiNewt/pyshark/blob/master/src/pyshark/tshark/tshark.py#L49), much like the `pcap-reader.py` tool.