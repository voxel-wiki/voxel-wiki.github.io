+++
title = "Run-Length Encoding"
description = "Storing runs of voxels instead of individual values."
+++

[Run-Length Encoding](https://en.wikipedia.org/wiki/Run-length_encoding) (or **RLE** for short) is a type of compression that encodes sequences of repeating values in just a few bytes!

In our case, we want to use RLE to compress voxel volumes, so we first have to make our volume sequential. This is usually done by [chunking](/wiki/storage/chunking) our volume and storing our voxels in a one-dimensional array, with some spatial indexing scheme on top. Once that is done, we can get started!

One rather simple way to do RLE is to write a number indicating repetitions, followed by the thing to repeat...

> **TODO:** Write example code for encoding/decoding.
> **TODO:** Extend example code with read-only decoding.
