+++
title = "Chunking"
+++

The first and possibly most important step when dealing with voxels, is to divide the voxel grid into **chunks**. Regardless of what kind of data-structure one ultimatively ends up using, at the bottom of it there will likely be *chunks* containing *voxels* (when using a tree-like structure, chunks may be called *bricks*).

![Chunking](./chunking.png)

## Motivation

**TODO**

## Code Example

Let's implement chunking, shall we?

```c#
class Chunk {
	// How many voxels does the chunk contain on any given axis?
	public const int EDGE_LEN = 32;
	
	// Size of a single slice of the chunk.
	public const int VOX_AREA = EDGE_LEN * EDGE_LEN;
	
	// Position of the chunk within the scene.
	public int chunk_x;
	public int chunk_y;
	public int chunk_z;
	
	// Voxel Data.
	public VOXEL[] voxels;
	
	public Chunk(int x, int y, int z) {
		chunk_x = x;
		chunk_y = y;
		chunk_z = z;
		voxels = new VOXEL[EDGE_LEN*EDGE_LEN*EDGE_LEN];
	}
	
	public VOXEL get(int local_x, int local_y, int local_z) {
		return voxels[local_x + local_y*EDGE_LEN + local_z*VOX_AREA];
	}
	
	public void set(int local_x, int local_y, int local_z, VOXEL voxel) {
		voxels[local_x + local_y*EDGE_LEN + local_z*VOX_AREA] = voxel;
	}
}
```

And then, to use it:

```c#
Chunk[][][] chunks = /* ? */;

var x = 1;
var y = 2;
var z = 3;

// Get the chunk...
var chunk = chunks[x / Chunk.EDGE_LEN][y / Chunk.EDGE_LEN][z / Chunk.EDGE_LEN];

// Set the voxel:
chunk.set(x % Chunk.EDGE_LEN, y % Chunk.EDGE_LEN, z % Chunk.EDGE_LEN, voxel);

// Get the voxel:
var voxel = chunk.get(x % Chunk.EDGE_LEN, y % Chunk.EDGE_LEN, z % Chunk.EDGE_LEN);
```

Having to write all these divisions time and time again *might* be a bit annoying, so let's give the chunk some extra methods:

```c#
class Chunk {
	/* --- SNIP --- */
	
	public VOXEL get_from_world(int x, int y, int z) {
		return this.get(x - chunk_x*EDGE_LEN, y - chunk_y*EDGE_LEN, z - chunk_z*EDGE_LEN);
	}
	
	public void set_from_world(int x, int y, int z, VOXEL voxel) {
		this.set(x - chunk_x*EDGE_LEN, y - chunk_y*EDGE_LEN, z - chunk_z*EDGE_LEN, voxel);
	}
}
```

Which makes using the chunk much simpler:

```c#
/* --- SNIP --- */

// Set the voxel:
chunk.set_from_world(x, y, z, voxel);

// Get the voxel:
var voxel = chunk.get_from_world(x, y, z);
```

In all of the above code, you might have noticed that nearly all coordinate variables have prefixes: There is a [good reason for that](/wiki/coordinate-systems).