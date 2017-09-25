---
layout: post
title: Get-ScriptBlock Release
date: 2017-09-24
created: 2017-06-30
tags: powershell project
---

I just got one of my recent projects, Get-ScriptBlock.ps1, in a workable state! I'm really excited about it, as its
a tool I've found myself needing in the past, but couldn't find any equivalents out in the ether. Don't get me wrong, there's definitely still work to do on it, like giving it an event log file to read instead of just using the Get-WinEvent command, but I believe it's in a state where large bugs are gone and its fairly easy to get up and running quickly.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">DFIR friends: check out a script I wrote for extracting scriptblocks from winevt logs. WIP and tested only on PSv5 <a href="https://t.co/KthcsQS3o8">https://t.co/KthcsQS3o8</a></p>&mdash; Thomas Gardner (@infosec_intern) <a href="https://twitter.com/infosec_intern/status/880907272897081345">June 30, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

This script is just one of many I'm working on under the _Posh-Utilities_ repository. I also have a wrapper around some native zip/unzip functions built into C#, and plans to introduce a Windows Management, or WSMan, command-extraction script. I'll elaborate more on these in the future though

**9/24 Update** After working on the Get-BITSHistory script some more, I decided to update this script into an [Advanced Function](https://technet.microsoft.com/en-us/library/hh413265.aspx) cmdlet. As a result, intead of running the script directly from the file, it requires dot-sourcing first. From there, you can run the cmdlet just like any other.

###### If you're wondering why this post is dated before my first post on July 2nd, it's because I announced the script before beginning my work on this blog
