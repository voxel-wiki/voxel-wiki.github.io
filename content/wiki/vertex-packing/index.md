+++
title = "Vertex Packing"
description = "Manually bit-packing data into vertices for improved memory usage and bandwidth."
aliases = ["/wiki/vertex-packing"]
[taxonomies]
categories = ["rendering", "compression"]
tags = ["rendering", "compression", "meshing", "vertices"]
[extra]
chapters = true
chapter_prev = false
chapter_next = {text = "Vertex Pulling", link = "/wiki/vertex-pulling"}
+++

{% todo_notice() %} This article is a work-in-progress. {% end %}

- Vertex attributes can, at their smallest, only deal with bytes.
- Vertex attributes can be integers, which hold bits.
- Unpacking bit-packed data in a vertex shader is *fast*.

## References

- [Vertex Formats Part 1: Compression](https://www.yosoygames.com.ar/wp/2018/03/vertex-formats-part-1-compression/)
