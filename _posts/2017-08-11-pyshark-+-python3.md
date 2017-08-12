---
layout: post
title: pyshark + python3 = <3
date: 2017-08-11
tags: python pyshark misp
---
So, remember that time I said *"Unfortunately, this also didn't appear to work due to the way MISP sends data to its modules"* in reference to pyshark?

[**pyshark Example**](https://github.com/KimiNewt/pyshark)
```python
>>> import pyshark
>>> cap = pyshark.FileCapture('/tmp/mycapture.cap')
>>> cap
<FileCapture /tmp/mycapture.cap (589 packets)>
>>> print cap[0]
Packet (Length: 698)
Layer ETH:
        Destination: BLANKED
        Source: BLANKED
        Type: IP (0x0800)
Layer IP:
        Version: 4
        Header Length: 20 bytes
        Differentiated Services Field: 0x00 (DSCP 0x00: Default; ECN: 0x00: Not-ECT (Not ECN-Capable Transport))
        Total Length: 684
        Identification: 0x254f (9551)
        Flags: 0x00
        Fragment offset: 0
        Time to live: 1
        Protocol: UDP (17)
        Header checksum: 0xe148 [correct]
        Source: BLANKED
        Destination: BLANKED
  ...
```

Well, I was kind of right, and I was kind of wrong. When I first tried to develop a PCAP import module for MISP, I thought I couldn't read a datastream into python3 and have it act like a file. This assumption proved to be wrong, as the `io.ByteIO` class does just that. Unfortunately, when actually trying to implement this in practice, pyshark runs into a separate problem when reading from a file-like memory stream.

Pyshark is great at reading from many capture file formats (PCAP, PCAP-NG, and CAP) using the same interface, but the FileCapture class demonstrated above [actually checks](https://github.com/KimiNewt/pyshark/blob/master/src/pyshark/capture/file_capture.py#L46) that a file exists before reading it. This doesn't work when I have a stream of binary data wrapped in a `BytesIO` object.

Semi-fortunately, the author(s) of pyshark are developing a PipeCapture class for handling these memory streams. I say "semi"-fortunately because it doesn't appear to work yet. Not only is it [not exported by pyshark](https://github.com/KimiNewt/pyshark/blob/master/src/pyshark/__init__.py), but there's some problem using my [memory stream and STDIN](https://github.com/KimiNewt/pyshark/blob/master/src/pyshark/capture/capture.py#L375). I continually get file descriptor errors.

Maybe this is a great way to contribute to another FOSS project: pyshark!