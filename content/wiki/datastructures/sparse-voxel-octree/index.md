+++
title = "Sparse Voxel Octree"
description = "The many ways to structure and manage voxels in memory."
path = "wiki/datastructures"
[taxonomies]
categories = ["datastructures"]
tags = ["datastructures", "storage", "spatial-acceleration"]
+++

### Introduction
Sparse Voxel Octrees, (or SVOs) are datastructures that allow for compression and quick transversel of a voxel world. It comprises a tree of nodes, that can either contain a single voxel type, or a list of 8 children nodes.
```rs
// An example in rust
enum Node<T>
{
    Leaf(T)
    Branch(Box<[Node<T>; 8]>),
}

struct Octree<T>
{
    root: Node<T>,
}
```
You can find the size of each voxel based on the `max_depth` of a tree, and the `current_depth` of the node with the equation: `2 ^ (max_depth - current_depth) * voxel_size`.

### Pros:
- Very small storage footprint, when compaired to raw 3d arrays, as simmilar voxels next to eachother are concatinated together
- Enable very fast transversel algorithems, for rays, and mesh generation, that would not be possible with other voxel storage datastructures.

### Cons:
- Tend to be slow to insert/retrieve spisific voxels from an index, as it needs to transverse multiple layers of the octree. (it should be noted that ***Slow*** is a relative term in this case)
- Physics calculations tend to not work very well with octrees (*Citation needed*)



