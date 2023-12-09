+++
title = "Palette Storage: Tagged-Pointer Palette Entries"
description = "Amortizing the indirection of palette entry pointers."
draft = true
[taxonomies]
categories = ["datastructures", "compression"]
tags = ["datastructures", "compression", "optimization", "instancing", "flyweight"]
[extra]
chapters = true
chapter_prev = {text = "Single-Variant Volume Omission", link = "/wiki/palettes/single-variant-volume-omission"}
chapter_next = false
+++

> Here's a question: How many bits does a single type of voxel (eg: a palette entry) take?
> 
> With palettes, it doesn't really matter! Since every palette entry represents all instances of a type in the associated voxel volume, it's perfectly fine to put them on the heap as their own objects... but, what if you wanted to *not* incur the cost of a heap allocation and the pointer-access?
> 
> The solution is to use [tagged pointers](https://en.wikipedia.org/wiki/Tagged_pointer)! A single bit can be used to indicate if a palette entries information is either **A)** stored on the heap as object or **B)** stored right in the pointer.
> 
> Given a 32-bit architecture which aligns allocations on 32-bit/4-byte boundaries (basically *all* 32-bit CPU's!), the two lowest bits in a pointer will always be zero (on 64-bit arch's it'll be the last three bits), meaning we can store whatever we want in these bits, as long as we mask them out when actually using the pointer as a pointer!
> 
> This gives you at minimum ***31 bits*** to encode a voxel type in (*63* bits on a 64-bit CPU!), which should be *way* more than enough for terrain (which tends to make up the majority of a voxel world by sheer volume), thus eliminating a *ton* of allocations and pointers!

{% todo_notice() %} explain {% end %}

### Implementation

{% todo_notice() %} implement {% end %}
