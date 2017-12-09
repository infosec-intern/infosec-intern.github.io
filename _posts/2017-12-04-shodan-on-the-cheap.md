---
layout: post
title: Shodan's the Hammer. OSINT's the Nail
date: 2017-12-04
created: 2017-12-04
tags: shodan
---
## Cheap Lifetime Membership!
This year's Black Friday was pretty great for intelligence researchers. Shodan put up a Membership for $5 instead of $49!
<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">The Black Friday Sale is Live - Shodan Membership for $5 instead of $49: <a href="https://t.co/e2bXvQ0GQu">https://t.co/e2bXvQ0GQu</a> <a href="https://t.co/kP7qZXMOK1">pic.twitter.com/kP7qZXMOK1</a></p>&mdash; Shodan (@shodanhq) <a href="https://twitter.com/shodanhq/status/933907388444430336?ref_src=twsrc%5Etfw">November 24, 2017</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

Naturally, as an aspiring threat intel researcher, I bought up a membership almost immediately!
I started experimenting with the Shodan API with a [new GitHub repository](https://github.com/infosec-intern/shodan-stuff). Some simple queries on CenturyLink servers, open FTP and telnet services, and webcams started it off, but then I realized I could convert an article I previously read into a quick indicator feed.

## Empire Listener Feed
Tenable recently published an article on identifying PowerShell Empire HTTP listener servers on the open Internet. It's located on their site at https://www.tenable.com/blog/identifying-empire-http-listeners. The author did a great job of explaining each step of his query and how it relates to the Empire codebase, and the Shodan Python module is so straightforward that it was easy to translate the script.
It mostly boiled down to two types of queries - facets and searches.
```python
query = '''
title:"404 Not Found" +
"Content-Length: 233" +
"Cache-Control: no-cache, no-store, must-revalidate"' +
'-"post-check=" -"pre-check=" -"private" +
"Pragma: no-cache" +
"Expires: 0" +
"Server:" -"X-" -"Set-Cookie:"' +
'-"Connection:"
-"Etag" -"Last-Modified"
-"Accept-Ranges:" -"Access-Control"
'''
facets = {
    "org": "Top 5 Organizations",
    "domain": "Top 5 Domains",
    "port": "Top 5 Ports",
    "asn": "Top 5 ASNs",
    "country": "Top 5 Countries",
    "product": "Top 5 Servers",
    "isp": "Top 5 ISPs"
}
...
results = api.count(query, facets=list(facets.keys()))
...
results = api.search_cursor(query)
```
Facets are basically aggregations of search queries. They make the kick-ass maps and statistic reports that most people use Shodan for. Since I'm mainly concerned with generating an indicator feed, they don't do me a whole lotta good other than looking nice.

## CSV Results
Once all the Shodan data is collected, I simply iterate through the results and write the appropriate fields to a CSV file. I figured the most interesting data was the IP, port, location, and scan time. Shodan is constantly updating, so this data should always be pretty recent.
```
city, country, ip, port, timestamp
```
You can easily schedule this script with a cronjob and import it into tools like MISP for easy, regular consumption.