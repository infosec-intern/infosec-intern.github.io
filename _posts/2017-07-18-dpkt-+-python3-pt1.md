---
layout: post
title: dpkt + python3 = <3 (Part One)
date: 2017-07-20
created: 2017-07-18
tags: python dpkt misp
---
## Setup Day
### (a.k.a. "You mean WireShark isn't the only program for reading PCAPs?")
Lately I've been working on a [MISP module](https://github.com/MISP/misp-modules) for importing indicators from PCAP files. There's already a similar tool under the [MISP sightings tools](https://github.com/MISP/misp-sighting-tools),
but it requires command-line use and, in my opinion, there should be some kind of integration with the UI for analysts with less command-line experience.

<blockquote class="twitter-tweet" data-lang="en">
    <p lang="en" dir="ltr">pcapreader.py is a tool to read PCAP files and add sightings to IOC’s in MISP (<a href="https://t.co/2Bu0jT3tGO">https://t.co/2Bu0jT3tGO</a>)
        <a href="https://twitter.com/hashtag/previoustweet?src=hash">#previoustweet</a>
        <a href="https://twitter.com/hashtag/RMLL2017?src=hash">#RMLL2017</a>
    </p>
    &mdash; Xavier Mertens (@xme) <a href="https://twitter.com/xme/status/882593164737089537">July 5, 2017</a>
</blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

When I started this, I looked pretty extensively at that tool, `pcap-reader.py`, and saw it spawned tshark under a subprocess to do its parsing.

I'm not too familiar with tshark, and I wanted to do this purely in python. At first, I thought I'd have a perfect python-only PCAP parser (alliterations :D) in Scapy.
It's well known, well documented, and it only works on python2...wait, it only works on python2? MISP's backend is written in pure python3, which means any potential MISP users would have to support both python 2 and 3 on their servers - potentially far past python2's support date.
Also, ever since my friend [Tayler](https://tayler.me) convinced me to switch to python3, I haven't looked back. Given my lack of desire to write in python2 again, and the lack of python2 support in MISP, I decided Scapy was a poor option.
Back to the drawing board!

After a little more research, I found some StackOverflow articles about a module called [pyshark](https://github.com/KimiNewt/pyshark). What's that? It's basically a python wrapper around tshark.
It doesn't do any parsing itself; it simply [calls a subprocess](https://github.com/KimiNewt/pyshark/blob/master/src/pyshark/tshark/tshark.py#L49), much like the `pcap-reader.py` tool.
Unfortunately, this also didn't appear to work due to the way MISP sends data to its modules. According to the [misp-module writing slides](https://circl.lu/assets/files/misp-training/luxembourg2017/4-misp-modules.pdf) given by circl.lu, MISP sends the import module a JSON document via HTTP POST.

![Querying a module]({{ site.url }}/images/misp-query-module.PNG)

There's no file saved to disk or data sent through a network interface, so I had trouble getting the PCAP data into pyshark to even attempt to parse it. Again, back to the drawing board.

Finally, after even more research - \*ahem\* Stack Overflow articles - I came upon [dpkt](https://dpkt.readthedocs.org/). I had never heard of this module before, and it appears to have a relatively small following.
In fact, I've had to rely entirely on [articles](https://jon.oberheide.org/blog/2008/10/15/dpkt-tutorial-2-parsing-a-pcap-file/) written 9 years ago by Jon Oberheide and the source code hosted on GitHub.

I know this doesn't sound like a perfect scenario, but the module is kept fairly up-to-date. There has been a steady stream of commits to GitHub over the last year, and the pip package appears to be updated to a fairly recent version of the code.
There was even a new PR created the day I started this blog post! Clearly there's interest in the package.

Alright, now we've found our perfect module! Part one is done; check out part two for more about some of the tips I learned programming the PCAP module!
