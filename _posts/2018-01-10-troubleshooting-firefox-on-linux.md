---
layout: post
title: Troubleshooting a FireFox on Linux
date: 2018-01-10
tags: linux troubleshooting
---

### Sway - An uncomfortable-at-times Window Manager
Typically, I'm pretty comfortable in a terminal, so I'm not one to obsess over how my windows are arranged, or how fancy my Linux desktop is (although Windows needs to be nice and tidy). 
I need `cd`, `ls`, `vim`, and `echo`, and that's about it to run my Linux box(es). Typically I default to the simplest and decent-looking window managers out of sheer laziness - GNOME - as a result. However, since I'm rebuilding my system from scratch anyway (short of compiling my kernel), I might as well try out a new window manager in the meantime.

In comes Sway. Sway is a "tiling" manager, meaning there's no concept of windows overlapping one another. Like floor tiles, each window sits adjacent to each other in a neat little box. My friend Tayler (who I've mentioned before) introduced me to one of the more popular tiling managers - i3 - a while back. It looks great, has some great features (i3status is a cleaner version of something I set up in GNOME for instance), and seemed fairly easy to navigate given my `tmux` experience. 
Unfortunately, I found out i3 only supports X11. Ew. I'm really trying to stay as Wayland-only as possible, both so I can get comfortable with a new technology (not like I've had to do much there), and to prepare for the "wave of the future of Linux graphics" (quotes coming from thin air - I hope no one actually said that seriously). 
After about 10 seconds of research, I found Sway. It's i3, but for Wayland. Perfect! It installed easily, supports the same configurations as i3 so years of examples on the Internet haven't gone to waste, and it's easy to wrap my head around. 

#### FireFox on Linux
So far I have only one major issue. FireFox 57. Something is wrong with XWayland support. Or something is wrong with Sway, because it works fine in GNOME and I'm pretty sure that uses XWayland. I'm still trying to figure it out. I have a handful of coredumps and very little expertise to troubleshoot them. Oh well, time to roll up my sleeves and learn some GDB. Will post when I have updates.

##### Saving our Core Dump
SystemD comes with a tool - `coredumpctl` - for managing recent process dumps
```sh
 ~  coredumpctl list
TIME                            PID   UID   GID SIG COREFILE  EXE
Fri 2018-01-05 17:50:21 MST    6546  1000  1000  11 missing   /usr/lib/firefox/firefox
Fri 2018-01-05 17:50:24 MST    6452  1000  1000  11 missing   /usr/lib/firefox/firefox
Fri 2018-01-05 17:50:24 MST    2276  1000  1000  11 missing   /usr/lib/firefox/firefox
Fri 2018-01-05 17:50:24 MST    1368  1000  1000  11 missing   /usr/lib/firefox/firefox
Wed 2018-01-10 19:26:30 MST    1276  1000  1000   3 present   /usr/lib/firefox/firefox
Wed 2018-01-10 19:26:30 MST    1274  1000  1000   3 present   /usr/lib/firefox/firefox
```
We can write these out to a file by selecting the PID of the coredump and using the output flag OR use `coredumpctl` directly
```sh
$ coredumpctl dump 1274 -o ./firefox.dump && gdb ./firefox.dump
$ coredumpctl gdb 1274
```

##### Examination
