+++
title = "Quad Indices"
description = "The basic pattern of indices for quads made of triangles."
[taxonomies]
categories = []
tags = ["meshing"]
+++

A **quadliteral** (also called **quad**, **tetragon** or **quadrangle**) is a four-sided polygon, with four corners/vertices and four edges/sides.

Unfortunately, GPUs/rasterizers generally only deal with triangles,
so we'll have to split each one of our quads into two triangles...
resulting in two of the vertices being duplicated.

Since we don't like pointless duplication, we ought to use an **element/index-buffer**,
which tells the GPU how to assemble two triangles from four vertices each.

But how do we assign/number/order the four vertices?

{% figure(caption="**Diagram of Winding Orders:** Clockwise, Counter-Clockwise, Z-Order, N-Order",author="Lars Longor K",license="CC0",class="full") %}/wiki/quad-indices/windings.svg{% end %}

## Clockwise Winding

{{stub_notice(kind="section")}}

## Counter-Clockwise Winding

> The opposite/inverse of clockwise order.

{{stub_notice(kind="section")}}

## Z-Order Winding

{{stub_notice(kind="section")}}

## N-Order Winding

> The opposite/inverse of Z-order.

{{stub_notice(kind="section")}}

## References

- <https://en.wikipedia.org/wiki/Quadrilateral>
