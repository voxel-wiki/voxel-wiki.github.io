+++
title = "Basic Storage"
description = "What is a voxel in practice?"
path = "/wiki/introduction/storage"
[taxonomies]
categories = ["introduction"]
[extra]
chapters = true
chapter_prev = {text = "Choosing A Language", link = "/wiki/introduction/language"}
chapter_next = {text = "World Generation", link = "/wiki/introduction/generation"}
+++

As noted in the [theory section](./#what-is-a-voxel-in-theory), a voxel can be ***anything***; the only limit is your imagination... and the amount of memory and disk-space you have! Speaking of which, how *are* voxels represented in practice?

{% info_notice() %}
From this point on, we assume that you (the reader) know the basics of programming;
in concrete terms that would be what **bits and bytes** are, **primitive types** like *integers*, the relation between **stack and heap memory** and, last of all, **pointers/references**.
{% end %}

{% warn_notice() %} **The following sections are a work-in-progress.** {% end %}

### Storing Voxels

For a start, let's assume that our voxels store a single byte each...

```rust
/// This represents a single voxel sample/instance.
type Voxel = u8; // A single byte.
```

Since a voxel *outside* a grid is, by [definition](./#what-is-a-voxel-in-theory), *not* a voxel, we will have to put it into a grid of voxels...

```rust
/// A finite grid of voxels.
pub struct VoxelGrid {
  // ???
}
```

...but how exactly do we do that?

At first, you might try to use a 3D array; let's say of size `16³`:

```rust
/// The size of our grid along any axis.
pub const GRID_SIZE: usize = 16;

/// A finite grid of `GRID_SIZE³` voxels.
pub struct VoxelGrid {
  values: [[[Voxel; GRID_SIZE]; GRID_SIZE]; GRID_SIZE];
  // Well ain't that nice to look at, eh?
}

// Define methods to GET and SET voxels:
impl VoxelGrid {
  pub fn get(&self, x: u32, y: u32, z: u32) -> Voxel {
    self.values[x][y][z]
  }
  
  pub fn set(&self, x: u32, y: u32, z: u32, v: Voxel) {
    *self.values[x][y][z] = v;
  }
}

```

Now accessing it is pretty simple:

```rust
// Create the volume, filled with zeroes...
let mut volume = VoxelGrid {
  values: [[[ 0 ; GRID_SIZE]; GRID_SIZE]; GRID_SIZE]
};

// Have some coordinates...
let (x,y,z) = (0, 1, 2);

// Get a voxel:
let v = volume.get(x, y, z);

// Set a voxel:
volume.set(x, y, z, v);
```

{% info_notice() %}
**Note on 3D arrays:**  
In the vast majority of languages, 3D arrays are implemented as *"arrays of pointers to arrays of pointers to arrays of values"* (sometimes referred to as "jagged arrays"), which has a few downsides:

- If the memory allocator doesn't play nice,
  our innermost arrays may be spread all over the place (i.e.: fragmentation).
- Accessing any value requires dereferencing three-ish pointers,
  which can and will trash the cache and thus access speed.
- Iterating/looping over them *always* requires three nested loops.
- Creating and (de)serializing 3d arrays tends to be a messy affair.
{% end %}

For a variety of reasons (see note above) and reasons yet to be revealed,
we will now go ahead and *flatten* our array, turning it one-dimensional!

```rust
pub struct VoxelGrid {
  values: [Voxel; GRID_SIZE * GRID_SIZE * GRID_SIZE];
}
```

Of course, we will now have to do the bound-checks by ourselves, but as long as we use the correct equality operators, there really is nothing to it!

```rust
impl VoxelGrid {
  pub fn get(&self, x: u32, y: u32, z: u32) -> Option<Voxel> {
    if x < 0 || x >= GRID_SIZE {return None} // 0 ⋯ GRID_SIZE-1
    if y < 0 || y >= GRID_SIZE {return None} // 0 ⋯ GRID_SIZE-1
    if z < 0 || z >= GRID_SIZE {return None} // 0 ⋯ GRID_SIZE-1
    self.values[ /* ??? */] // uuuuh...?
  }
}
```

I suppose a function that turns `x,y,z` into an index is also needed: an **index function**!
Since it depends on the bounds-check to work correctly, let's move it there...

```rust
impl VoxelGrid {
  /// A function to turn 3d coordinates into an array index.
  pub fn index(&self, x: u32, y: u32, z: u32) -> Option<usize> {
    if x < 0 || x >= GRID_SIZE {return None} // 0 ⋯ GRID_SIZE-1
    if y < 0 || y >= GRID_SIZE {return None} // 0 ⋯ GRID_SIZE-1
    if z < 0 || z >= GRID_SIZE {return None} // 0 ⋯ GRID_SIZE-1
    Some(x + y*GRID_SIZE + z*GRID_SIZE*GRID_SIZE) // SCHEME
  }
  
  pub fn get(&self, x: u32, y: u32, z: u32) -> Option<Voxel> {
    self.values[ self.index(x,y,z)? ] // yay!
  }
  
  pub fn set(&self, x: u32, y: u32, z: u32, v: Voxel) -> Option<()> {
    (*self).values[ self.index(x,y,z)? ] = v;
  }
}
```

{% info_notice() %}
The line marked with `SCHEME` declares a (spatial) **indexing scheme** for us, which defines the *order* and *importance* of the `x,y,z` axes, but also how to turn coordinates into a usable index. Neat!
{% end %}

And so our example becomes this:

```rust
// Create the volume...
let mut volume = VoxelGrid {
  values: [ 0 ; GRID_SIZE * GRID_SIZE * GRID_SIZE]
};

// Have some coordinates...
let (x,y,z) = (/**/, /**/, /**/);

// Get a voxel:
let v = volume.get(x, y, z).unwrap();

// Set a voxel:
volume.set(x, y, z, v).unwrap();
```

Handling errors is outside the scope of this guide, so do note that the `unwrap`s in the example will,
if the coordinates are ever out of bounds, crash our program; but at least you'll know where!

Now how do we fill it? And just what type should `Voxel` be?!

We will answer the second question first... after fixing a glaring issue.

### The Heap

If you tried increasing the `GRID_SIZE` a little too much,
you *might* run into a problem: a stack overflow!

Right now our `VoxelGrid` is defined like this:

```rust
pub struct VoxelGrid {
  values: [Voxel; GRID_SIZE * GRID_SIZE * GRID_SIZE];
}
```

...and 'created' like this...

```rust
// Create the volume...
let mut volume = VoxelGrid {
  values: [ 0 ; GRID_SIZE * GRID_SIZE * GRID_SIZE]
};
```

That line right there? It allocates our `VoxelGrid` on the stack! Which is bad,
as stack memory is quite limited (e.x.: 1mB on Windows); putting huge things on it can (obviously)
cause a stack-overflow, but will also obliterate our CPU's cache... :(

Thankfully avoiding this is an easy fix: Allocate it on the heap!

First turn the array into a vector (which is a thin abstraction over `malloc`)...

```rust
pub struct VoxelGrid {
  values: Vec<Voxel>;
}
```

...create it right on the heap, like this...

```rust
// Create the volume...
let mut volume = VoxelGrid {
  values: vec![ 0 ; GRID_SIZE * GRID_SIZE * GRID_SIZE]
};
```

...and we're done! Now on to defining our voxel type(s)...

### Types of Voxel

To decide what our voxels *are*, we need to know...

- How does a player interact with the voxels?
- How the voxels interact with each other?
- How much data can we cut out and derive?
- Do the voxels form a continuous *or* discrete surface?

{% todo_notice() %} Types of voxels. {% end %}
{% todo_notice() %} `VoxelGrid` and `VoxelVolume` separation. {% end %}

### World Management

Now, having just a single finite `VoxelGrid` puts a hard limit on how large our world can be, while also forcing us to load the whole thing at once... which isn't exactly great. So let's go and cut up our world into **Chunks**!

We begin by turning our existing `VoxelGrid` into a `VoxelChunk` with a *chunk position*:

```rust
/// The position of a chunk, using `GRID_SIZE`-sized units.
#[derive(
  Default, Clone, Copy, // this is a primitive type
  Hash, PartialEq, Eq // needed for HashMap keying
)]
struct ChunkPosition {
  pub x: i32,
  pub y: i32,
  pub z: i32,
}

/// A chunk of voxels within a larger world-grid.
#[derive(Clone)]
struct VoxelChunk {
  pub position: ChunkPosition,
  pub volume: VoxelVolume,
}
```

Then we can create a `VoxelWorld` that holds any number of chunks,
by stuffing them in a `HashMap`!

```rust
use std::collections::HashMap;

struct VoxelWorld {
  pub chunks: HashMap<ChunkPosition, VoxelChunk>,
}
```

{% info_notice() %}
You may *eventually* want to change the default `Hasher` of the `HashMap` to a faster one,
like [`AHash`](https://crates.io/crates/ahash), [`FNV`](https://crates.io/crates/fxhash)
or [`BLAKE`](https://crates.io/crates/blake2).
{% end %}

{% todo_notice() %} Chunk Management. {% end %}
{% todo_notice() %} Sliding-Window impl? {% end %}

## Next

Next up: Basic world generation!
