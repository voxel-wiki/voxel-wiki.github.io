+++
title = "Palette Storage: Single-Variant Volume Omission"
description = "When all voxels are the same, why allocate memory?"
draft = true
weight = 40
[taxonomies]
categories = ["datastructures", "compression"]
tags = ["datastructures", "compression", "optimization", "instancing", "flyweight"]
[extra]
chapters = true
chapter_prev = {text = "Indices Bit-Compression", link = "/wiki/palettes/indices-bit-compression"}
chapter_next = {text = "Tagged-Pointer Palette Entries", link = "/wiki/palettes/tagged-pointer-palette-entries"}
[extra.sidebar]
show = true
chapter = "storage"
label = "Single-Variant Volume Omission"
+++

> When you think about it, a palette with only a single entry, doesn't need to have a voxel volume allocated for it... which leads to a rather simple optimization, for when there are a lot of chunks filled with, say, only air!

{% todo_notice() %} explain {% end %}

## Implementation

{% todo_notice() %} implement {% end %}
