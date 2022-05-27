+++
title = "Compression"
description = "The many ways to compress volumetric data."
path = "wiki/compression"
+++

Once we have our data-structure of choice in place, we might still want (or outright *need*) to have *a lot* of voxels loaded at once, which leads us to two issues:

- It might seem like we have a lot of <dfn title="volatile computer working memory">RAM</dfn> (gigabytes, in fact!), but voxel volume data is *big* (it scales by the power of three: `n³`) and our users may have other things running, like a web browser, so we can't just eat all of it!

- The bandwidth between working memory (RAM) and our processor (CPU) is *limited* and *shared* with other processes, thus being highly contended!

To remedy these issues, we'll have to *compress* our voxels, for which there are many methods...

- [Lossy Compression](/wiki/compression/lossy-compression)
- [Palette Compression](/wiki/compression/palette-compression)
- [Run-Length Encoding](/wiki/compression/run-length-encoding)

> **Note:** Compressing voxel data is, of course, also greatly useful for persistence and networking.
