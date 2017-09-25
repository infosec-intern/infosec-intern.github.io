---
layout: post
title: Get-BITSHistory Release
date: 2017-06-30
modified: 2017-07-04
tags: powershell project
---

After being inspired by all the great [DerbyCon 7 talks](https://technet.microsoft.com/en-us/library/hh413265.aspx), I decided to revisit my _Posh-Utilities_ repository. One of my initial ideas was compiling the various (up to 4) BITS event logs into a single, easily-parsable object.
Currently, the BITS logs split apart the job statuses and the files downloaded by the jobs.

Job Info (Event ID):
* Start Job (3)
* Stop Job (4)
* Cancel Job (5)

Files Downloaded (Event ID):
* Open Connection (59)
* Close Connection (60)
* Connection Errors (61)

The only thing stringing all these logs together is a job ID, and since it's a long GUID, it's perfect as a unique key into a hashmap. The script parses these 6 different types of event logs - oldest to youngest - then, for every unique job ID it finds, it creates a new object to hold the various attributes like:
* Job Start Time
* Job End Time
* URL
* Resulting Filesize
* Bytes Transferred
* Job Status Code