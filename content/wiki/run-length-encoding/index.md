+++
title = "Run-Length Encoding"
description = "Storing runs of voxels instead of individual values."
aliases = ["/wiki/rle"]
[taxonomies]
categories = ["compression"]
tags = ["compression", "optimization"]
+++

{{ref(id="wikipedia-run-length-encoding")}} (or **RLE** for short) is a type of compression that encodes sequences of repeating values in just a few bytes! <!-- more -->

In our case, we want to use RLE to compress voxel volumes, so we first have to make our volume sequential. This is usually done by [chunking](/wiki/chunking) our volume and storing our voxels in a one-dimensional array, with some spatial indexing scheme on top. Once that is done, we can get started!

The most basic way to do RLE is to write a number indicating repetitions, followed by the thing to repeat. Given the following 8³ chunk of voxels, with each line being a vertical column and a palette of `0=Air, 1=Dirt, 2=Grass`...

```
1 1 1 2 0 0 0 0
1 1 1 2 0 0 0 0
1 1 1 2 0 0 0 0
...
```

...a basic RLE implementation would compress to the following:

```
3 1 1 2 4 0
3 1 1 2 4 0
3 1 1 2 4 0
...
```

Assuming that the voxels take one byte each, and the run-length too, we get a **25%** size reduction for *this particular pattern* of voxels!

---

{% todo_notice() %} Explain how different patterns can wildly change RLE results. {% end %}

{% todo_notice() %} Explain how RLE can be combined with palette compression. {% end %}

{% todo_notice() %} Write example code for encoding/decoding. {% end %}
{% todo_notice() %} Extend example code with read-only 'skip' decoding. {% end %}
