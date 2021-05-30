+++
title = "Palette Compression"
+++

> This is a rewrite; the original article can be found here: [https://www.longor.net/articles/voxel-palette-compression-reddit](https://www.longor.net/articles/voxel-palette-compression-reddit)

When writing a voxel engine, eventually you will come to realize that storing your voxels as 32-bit integers (or worse: as individual heap-allocated objects!) is eating a lot more memory than you'd like, potentially slowing down your game without any obvious reason as to *why*, and doing [bit-twiddling](https://graphics.stanford.edu/~seander/bithacks.html) to pack your data into a smaller space, is probably giving you quite a headache, so you might be thinking: There *has* to be a better way! *Right*...?

**And there is!**

All we have to do, (un)surprisingly, is look at Minecraft...

## Prior Art

With the release of Minecraft 1.13, Mojang added a form of lossless compression for voxel-data to their game, based upon the basic concept of *color palettes*.

Think of it like a GIF image: By limiting ourselves to a small set of colors and arranging the picture elements in various patterns, we can create an image that *appears* to have more colors than it *actually* contains, but with fraction of the memory consumption!

| GIF image of a parrot. | The resulting palette. |
|:-:|:-:|
| ![Image of a Parrot](https://upload.wikimedia.org/wikipedia/commons/d/d7/RGB_24bits_palette_sample_image.jpg) | ![Color Palette of the Image](https://upload.wikimedia.org/wikipedia/commons/0/05/Sample_Image_RGB_Cube.gif) |

> **Image Source:** [https://en.wikipedia.org/wiki/Palette_(computing)](https://en.wikipedia.org/wiki/Palette_(computing))  
> **Image Credits:** [Ricardo Cancho Niemietz](https://en.wikipedia.org/wiki/User:Ricardo_Cancho_Niemietz) & [Kjerisch](https://commons.wikimedia.org/wiki/User:Kjerish)

Normally, palettes are used to improve image quality in the presence of hardware and/or software constraints (and sometimes for [artistic reasons](https://en.wikipedia.org/wiki/Pixel_art)), but they can also be used for compressing more complex data, as long as most elements can share the same underlying data!

In our case, what is being compressed is *voxel data*, which lends itself *perfectly* for this method.

## Pro & Contra

By using palette compression for voxel data, we gain numerous advantages, like...

- **Massively reducing the memory footprint of voxels:**
  With palette compression, it is possible to decrease the size of individual voxels so far,
  that they only take a *single bit* of memory in the best case.

- **Smaller serialized size:**
  By using the same principle for transporting voxels over a network or storing them on disk,
  we can reduce the amount of bandwidth used and waste less hard-drive space!

- **Practically infinite material types and states:**
  Because the types and states of voxels are separate from the actual voxels, we can have as many types and as much complex state as we want, without increasing memory consumption exponentially!

- **Overlapping voxel data:**
  And at last, using palette compression makes it viable to have several layers of voxels occupying the same location, thus allowing things like fluids (eg: water) to flow into other (solid) voxels, or making snow-cover something applicable for any and all materials!

**As for disadvantages...**

The palette is a dynamic structure, that grows and shrinks with the number of differing types/states contained within it, which can be a problem in memory or allocation constrained environments. There are some optimizations that mitigate this, allowing one to amortize the read-write-performance to effectively `O(1)` in the majority of cases.

Also, if one doesn't pay close attention to the layout of data in memory, it is *very* easy to simultanously cause pointer chasing and utterly trash CPU caches, which is... *bad*.
