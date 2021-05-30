+++
title = "Storage"
+++

The simplest way to store voxels, is to define a three-dimensional array of elements (be it `struct`s or `integer`s), where each element represents a single voxel:

```c#
var voxels = new ELEMENT[width][height][depth];

// Set a voxel:
voxels[x][y][z] = voxel;

// Get a voxel:
var voxel = voxels[x][y][z];
```

However, that is far from the only way to store voxels...

## Compression

- [Palette Compression](/wiki/storage/palette-compression)

## References

- [https://0fps.net/2012/01/14/an-analysis-of-minecraft-like-engines/](https://0fps.net/2012/01/14/an-analysis-of-minecraft-like-engines/)
