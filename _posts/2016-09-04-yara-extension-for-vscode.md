---
layout: post
title: YARA Extension for VSCode
date: 2017-07-04
tags: yara vscode project
---
### [YARA Extension for VSCode](https://marketplace.visualstudio.com/items?itemName=infosec-intern.yara)

About a year ago I started a project to provide syntax highlighting and snippets support for YARA on Visual Studio Code. The project went pretty well; Microsoft makes it easy to extend VSCode even without digging into the APIs too much.

![Syntax Highlights]({{ site.url }}/images/yara-ext-04092016.PNG)

After it was out for a bit, and people started using it more, a coworker of mine recommended some improvements to the extension that required significantly more programming and familiarity with the VSCode API. It's been a rough jouney, but it's been fun to learn about asynchronous programming and Microsoft's compiled Javascript language - Typescript.

