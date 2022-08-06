+++
title = "3D Raycasting"
description = "Traveling through 3D grids in a straight line."
path = "/wiki/raycasting"
[taxonomies]
categories = ["algorithms"]
tags = ["algorithm", "math", "raycasting", "raytracing"]
+++

{{ stub_notice() }}

## Introduction

The [Digital Differential Analyzer](https://en.wikipedia.org/wiki/Digital_differential_analyzer_(graphics_algorithm)) (`DDA`) algorithm,
adapted to 3D, is *exactly* the thing one needs to travel along a line (or a ray) through a grid of voxels.

## Implementation

The following implementation was written in `GLSL`,
but should be simple enough to be ported to any language may choose...

{{ embed_text(file="dda.glsl", lang="glsl") }}

## References

- [Wikipedia](https://en.wikipedia.org/wiki/Digital_differential_analyzer_(graphics_algorithm))
- Paper: [A Fast Voxel Traversal Algorithm for Ray Tracing (1987)](http://citeseer.ist.psu.edu/viewdoc/summary?doi=10.1.1.42.3443)
- [Voxel Rendering Using Discrete Ray Tracing](https://castingrays.blogspot.com/2014/01/voxel-rendering-using-discrete-ray.html)
- [Cast ray to select block in voxel game](https://gamedev.stackexchange.com/a/49423)
- [`C` Implementation](https://webdocs.cs.ualberta.ca/~graphics/books/GraphicsGems/gemsiv/vox_traverse.c)
- [`C++` Implementation](https://gist.github.com/garymacindoe/895430c1e53a6e50cb35)
- [`GLSL` Implementation](https://www.shadertoy.com/view/XddcWn)
- [`GLSL` Implementation](https://www.shadertoy.com/view/4sVfWw) (Octree Variant)
