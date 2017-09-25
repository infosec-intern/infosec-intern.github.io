---
layout: post
title: Get-BITSHistory Release
date: 2017-09-24
created: 2017-09-24
tags: powershell project
---

After being inspired by all the great [DerbyCon 7 talks](http://www.irongeek.com/i.php?page=derbyconstreams), I decided to revisit my _Posh-Utilities_ repository. One of my initial ideas was compiling the various (up to 4) BITS event logs into a single, easily-parsable object.
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

You can find the script [on my GitHub profile](https://github.com/infosec-intern/Posh-Utilities/blob/master/Get-BITSHistory.ps1). As always, give it a shot and don't hesitate to submit issues or pull requests!

And a quick example, straight from the PowerShell Get-Help menu:
```
 Get-BITSHistory | Select-Object -First 1
    Id              : {2ABEF5DC-81A6-49F0-B314-D324D31A75D1}
    Name            : Push Notification Platform Job: 1
    Owner           : computer\Username
    ProcessPath     : C:\Windows\System32\svchost.exe
    StartTime       : 9/16/2017 4:25:47 PM
    ProcessId       : 1964
    URL             : http://img-s-msn-com.akamaized.net/tenant/amp/entityid/AArXcnF.img?w=204&h=100&m=6&tilesize=wide&x=620&y=148&ms-scale=150&ms-contrast=standard
    BytesTotal      : 15552
    StatusCode      : 0
    ByteTransferred : 15552
    EndTime         : 9/16/2017 4:25:47 PM
```