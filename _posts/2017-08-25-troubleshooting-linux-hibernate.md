---
layout: post
title: Troubleshooting a Linux Hibernate/Suspend Issue
date: 2017-08-25
tags: linux suspend troubleshooting
---
I love Linux, but it has never been good at a few things:

1. Gaming
2. Going to sleep (or more accurately waking up)
3. Marketing

I'll be ignoring points 1 and 3 and focusing on point 2 - troubleshooting waking up a Linux machine. I have a desktop with Arch Linux and kernel 4.12, and every time my desktop puts itself to sleep I have to reboot it just to use it again.
This is because - for one reason or another - my HID devices (mouse and keyboard) stop working, and it's one of the most frustrating problems I've had to deal with in the 4 or so years I've been regularly using Linux.

### Suspend vs. Hibernate
The only reason I know this is a suspend problem (and may or may not be a hibernate one), is due to `journalctl`. Systemd, for all its faults, has a handy way of filtering the system logs on a per-boot basis. The `--boot|-b` option in journalctl uses a relative index to look up which system boot you want to look at. Typically I'll do this immediately after start up and will want to look at the previous boot, which is index -1.

```sh
journalctl -b -1
```

--- TBD ---