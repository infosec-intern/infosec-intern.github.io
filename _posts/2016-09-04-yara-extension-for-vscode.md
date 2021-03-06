---
layout: post
title: YARA Extension for VSCode
date: 2018-03-26
created: 2016-06-29
tags: yara vscode project
---

About a year ago I started a project to provide syntax highlighting and snippets support for [YARA on Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=infosec-intern.yara). The project went pretty well; Microsoft makes it easy to extend VSCode even without digging into the APIs too much.

![Syntax Highlights]({{ site.url }}/images/yara-ext-04092016.PNG)

After it was out for a bit, and people started using it more, a coworker of mine recommended some improvements to the extension that required significantly more programming and familiarity with the VSCode API. It's been a rough jouney, but it's been fun to learn about asynchronous programming and Microsoft's compiled Javascript language - Typescript.

At this point, version 2.0 of the YARA extension is **almost** out. The current iteration generates red and green 'squiggly' diagnostics data to tell you when there's a compilation warning or error while you're creating your YARA rules by auto-compiling in the background as you save your rules. I say it's **almost** out because I've had trouble with some edge-case errors. In addition to learning about Typescript and async programming, I've tried to be more consistent with writing unittests. I'm still working on good unittests and expanding my code coverage, so it probably won't be released until I'm satisfied with the tests.

**26 March 2018 UPDATE:** I've been working on this extension significantly more in recent months. As of now, there are over 1500 users of it, which is far more attention than anything I've ever done before! The current version is 1.2.4, and I've added support for several features along with unittests for each:
* Find All References
* Peeking and Go To Definition
* Better snippets (probably depends on whoever's using it)

I'm still working on fully testing the diagnostics feature, but I think it's the best it's ever been, so it should be out shortly. Also, I have a rough idea for providing [YARA module](https://yara.readthedocs.io/en/v3.7.0/modules.html) completion, but it's a pretty manual process and would be a pain to update in its current form, so I'm trying to explore new ways of generating the completion items.
