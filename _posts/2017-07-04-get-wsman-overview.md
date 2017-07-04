---
layout: post
title: Get-WSManCommands Beta Release
date: 2017-06-30
tags: powershell project wsman
---
I recently found a log that encodes any remote commands run during a session, and the start/stop times of the WSMan sessions. If you're wondering what WSMan is, Microsoft has a good overview of using WSMan in PowerShell [here](https://msdn.microsoft.com/en-us/powershell/reference/5.0/microsoft.wsman.management/providers/wsman-provider). To simplify things, WSMan is a way to remotely control Windows machines - akin to SSH or Telnet in Unix. You may know it by other names like WinRM (or Windows Remote Management), and PSSessions (PowerShell Sessions). Although I haven't played with them much, I believe PowerSploit and PowerShell Empire rely heavily on PSSession objects to run commmands remotely.

My goal with this script is to make PowerShell analysis incredibly easy. Wouldn't it be great if you could just run one command and get a Bash history-like file? Wouldn't it be even better if it wasn't a flat textfile, but an array of PowerShell objects?

Work is still ongoing on this project