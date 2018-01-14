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
Like all browsers, FireFox is a multi-threaded application. When we load the core dump, we run the `bt` command, which is just an alias for `backtrace`, to get information about the stack frames in each thread. Then we can start forming a picture from there.

After looking at the traces, my process looked a little like the following when it died:
```
* Thread-1: 1274 (main thread)
    * Thread-2: 1277 (pthread_cond_wait)
    * Thread-3: 1278 (pthread_cond_wait)
    * Thread-4: 1279 (pthread_cond_wait)
    * Thread-5: 1280 (pthread_cond_wait)
    * Thread-6: 1281 (pthread_cond_wait)
    * Thread-7: 1282 (pthread_cond_wait)
    * Thread-8: 1283 (pthread_cond_wait)
```
Threads 2 through 8 had the same stack trace ending in `pthread_cond_wait` from the `libpthread.so.0` shared library. From the man page for this function (`man 3 pthread_cond_wait`) we can see that this function blocks threads based on some condition set by a caller thread. Since Thread-1 is the only thread that isn't blocked, we can assume that's the caller.

Thread-1's stacktrace is a lot more complicated than 2-8, so that's where I'll spend my time. The full trace is below:
```sh
Thread 1 (Thread 0x7efe4b10d740 (LWP 1274)):
#0  0x00007efe4ad01c50 in raise () at /usr/lib/libpthread.so.0
#1  0x00007efe3e99493b in  () at /usr/lib/firefox/libxul.so
#2  0x00007efe4ad01db0 in <signal handler called> () at /usr/lib/libpthread.so.0
#3  0x00007efe4acfd766 in pthread_cond_timedwait@@GLIBC_2.3.2 () at /usr/lib/libpthread.so.0
#4  0x00007efe4b0d09b7 in  () at /usr/lib/firefox/libnspr4.so
#5  0x00007efe4b0d0e8a in PR_WaitCondVar () at /usr/lib/firefox/libnspr4.so
#6  0x00007efe4b0d29ad in PR_Sleep () at /usr/lib/firefox/libnspr4.so
#7  0x00007efe3e99f27a in  () at /usr/lib/firefox/libxul.so
#8  0x00007efe3e9a101b in  () at /usr/lib/firefox/libxul.so
#9  0x00007efe3e9a13f2 in  () at /usr/lib/firefox/libxul.so
#10 0x00005625ba16423d in  ()
#11 0x00005625ba1638ad in  ()
#12 0x00007efe4a1b0f4a in __libc_start_main () at /usr/lib/libc.so.6
#13 0x00005625ba163bca in _start ()
```
We can see the first line, which is the most recent function call in a trace, is for the `raise` function. From its man page (`man 3 raise`), we see that it exists to send signals from a callee thread to a caller thread. In its own words: 
> in a single-threaded program, it is equivalent to kill(getpid(), sig);

The stacktraces I most typically see are in Python, so this function call tells me some sort of unhandled exception was thrown, and FireFox didn't know how to handle it properly, so it exited with an error.