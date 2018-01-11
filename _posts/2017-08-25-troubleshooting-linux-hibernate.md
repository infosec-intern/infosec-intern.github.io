---
layout: post
title: Troubleshooting a Linux Hibernate/Suspend Issue
date: 2017-08-25
tags: linux troubleshooting
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

#### Update 2018-01-01**
I'm rebuilding my Arch Linux system due to a combination of prior negligence, instability, a new(ish) GPU, and just wanting to start off the new year with a clean slate
...Anyway...
While setting the EFI entries and perusing the [Power management page on the Arch Wiki](https://wiki.archlinux.org/index.php/Power_management/Suspend_and_hibernate), I noticed a throwaway phrase that might shed light on this problem and allow me to avoid it with this new setup.

 > There are...some high level interfaces providing tweaks to handle
 > problematic hardware drivers/kernel modules (e.g. video card re-initialization).

 I'll post updates on my progress. I promise this time.

#### Update 2018-01-04**
It worked! I just tested both `systemctl hibernate` and `systemctl suspend` and they worked flawlessly.
I was even able to notice when the [resume] hook was triggered after I woke the machine up from hibernate.

And to think all it took was wiping my OS and completely rebuilding from scratch!
