+++
title = "Data Structures"
description = "The many ways to structure and manage voxels in memory."
path = "wiki/datastructures"
[taxonomies]
categories = ["datastructures"]
tags = ["datastructures", "storage", "spatial-acceleration"]
+++

Storing voxels in a plain array is perfectly fine for small scenes,
but as we increase the size (and thus volume) of our scene,
we will inevitably run into various limits, like the *size of our RAM*...

As such, we'll have to use a data-structure that allows both
loading and purging *parts of our volume* (called [Chunks](/wiki/chunking) or Bricks)
from memory, nearly in realtime, without slowing down the *access times* of our voxel data,
or the performance of world generation, *too* much.

> **Note:** These techniques can often be combined.

- Hashgrid
- [Multi-Level Grids](/wiki/datastructures/multi-level-grid)
- [Sparse Voxel Octree (SVO)](/wiki/datastructures/sparse-voxel-octree)

{{ todo_notice(body="List more datastructures?") }}
{{ todo_notice(body="Compare datastructures?") }}
{{ todo_notice(body="Coordinate-hashing vs -indexing?") }}
{{ todo_notice(body="Explain complexity trade-offs? Table/diagram?") }}
{{ todo_notice(body="Top- and bottom-level acceleration structures?") }}

## References

- [https://0fps.net/2012/01/14/an-analysis-of-minecraft-like-engines/](https://0fps.net/2012/01/14/an-analysis-of-minecraft-like-engines/)
