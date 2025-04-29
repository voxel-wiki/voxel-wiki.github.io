+++
title = "T-Junctions"
description = "Any vertex placed on an edge creates infinitely small gaps in geometry."
[taxonomies]
categories = ["math"]
tags = ["math", "meshing"]
+++

Any time your meshing process results in the corner of a triangle
resting on the edge of another triangle, you get a **T-Junction**.

While this gap between the corner and the edge *is* infinitely small mathematically,
it *absolutely isn't* in practice, due to floating-point computation and rounding.

<span style="color:red">This **always** happens</span>,
even if you've managed eliminate *all* floating-point errors.

There are four ways to work around this issue:

1. Expand the faces ever so slightly outwards.
2. Fill the pixel-wide gaps in a post-process shader.
3. Don't create geometry where vertices can lie on edges.
4. Directly raytrace your voxel volume.
