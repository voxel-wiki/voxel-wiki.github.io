+++
title = "Storage"
description = "The many ways to structure and manage voxels in memory."
+++

> Note: This section generally covers *runtime* storage, not [serialization](/wiki/serialization).

The simplest way to store voxels, is to define a three-dimensional array of elements (be it `struct`s or `integer`s), where each element represents a single voxel:

```c#
var voxels = new VOXEL[width][height][depth];

// Set a voxel:
voxels[x][y][z] = voxel;

// Get a voxel:
var voxel = voxels[x][y][z];
```

However, that is far from the only way to store voxels...

> **Note:** These techniques can be combined in arbitrary ways.

- [Chunking](/wiki/storage/chunking)
- [Multi-Level Grids](/wiki/storage/multi-level-grid)
- [Sparse Voxel Octree (SVO)](/wiki/storage/sparse-voxel-octree)

## Compression

- [Palette Compression](/wiki/storage/palette-compression)
- [Run-Length Encoding](/wiki/storage/run-length-encoding)

## References

- [https://0fps.net/2012/01/14/an-analysis-of-minecraft-like-engines/](https://0fps.net/2012/01/14/an-analysis-of-minecraft-like-engines/)
