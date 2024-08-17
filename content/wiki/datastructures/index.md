+++
title = "Data Structures"
description = "The many ways to structure and manage voxels in memory."
path = "wiki/datastructures"
[taxonomies]
categories = ["datastructures"]
tags = ["datastructures", "storage", "spatial-acceleration"]
+++

{% info_notice() %} Note: This section is about *runtime* storage, not [serialization](/wiki/serialization). {% end %}

The simplest way to store voxels is to define a three-dimensional array of elements (be it `struct`s or `integer`s), where each element represents a single voxel:

```c#
int width = ...;
int height = ...;
int depth = ...;
var voxels = new VOXEL[width][height][depth];

// Set a voxel:
voxels[x][y][z] = voxel;

// Get a voxel:
var voxel = voxels[x][y][z];
```

However, because storing *arrays within arrays* often means having *pointers pointing at pointers* (which ain't good for [various reasons](/wiki/optimization) we won't get into here), it is generally recommended to use a one-dimensional array with a clearly defined *spatial indexing scheme*.

Here's an example:

```c#
--snip--
// Spatial Indexing Scheme is: Y-height, Z-depth, X-width
// The arrays size is just all axes multiplied together:
var voxels = new VOXEL[height * depth * width];

// Our Indexing Formula is the indexing scheme in reverse,
// with the components being multiplied subsequently:
//     x + z*width + y*width*depth

// So let's define a function (here a lambda) for it:
var idx = (int x, int y, int z) => (x + z*width + y*width*depth);
// ^ NOTE: You may want to throw an error right here
//         if the coordinate components are out of bounds.

// Set a voxel:
voxels[idx(x,y,z)] = voxel;

// Get a voxel:
var voxel = voxels[idx(x,y,z)];
```

Now, storing voxels in a plain array like this is perfectly fine for small scenes...

However, for larger scenes, we'll have to use a data-structure that allows both loading and purging *parts of our volume* (called [Chunks](/wiki/chunking)) from memory, nearly in realtime, without slowing down *accessing* our voxel data.

> **Note:** These techniques can often be combined.

- [Multi-Level Grids](/wiki/datastructures/multi-level-grid)
- [Sparse Voxel Octree (SVO)](/wiki/datastructures/sparse-voxel-octree)

## References

- [https://0fps.net/2012/01/14/an-analysis-of-minecraft-like-engines/](https://0fps.net/2012/01/14/an-analysis-of-minecraft-like-engines/)
