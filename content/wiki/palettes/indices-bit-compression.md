+++
title = "Palette Storage: Indices Bit-Compression"
description = "Compressing voxels below one byte."
draft = true
[taxonomies]
categories = ["datastructures", "compression"]
tags = ["datastructures", "compression", "optimization", "instancing", "flyweight"]
[extra]
chapters = true
chapter_prev = {text = "Palette Storage", link = "/wiki/palettes"}
chapter_next = {text = "Single-Variant Volume Omission", link = "/wiki/palettes/single-variant-volume-omission"}
+++

{% info_notice() %} This is the technique commonly known as **Palette Compression**. {% end %}

> The first (and most impactful) optimization to implement for palettes is the use of bit-buffers.
> 
> That is, by reducing the bit-size of the voxels to the minimum amount of bits needed (eg: the amount of unique indices, which equates to the amount of palette entries), the amount of memory needed to store large low-entropy voxel volumes is *massively* reduced.

{% todo_notice() %} explain {% end %}

{% todo_notice() %} "dimensionality does not matter" hint {% end %}

### Implementation

{% todo_notice() %} implement {% end %}
