+++
title = "Basic Storage"
description = "What is a voxel in practice?"
path = "/wiki/introduction/storage"
[taxonomies]
categories = ["introduction"]
[extra]
chapters = true
chapter_prev = {text = "Choosing A Language", link = "/wiki/introduction/language"}
chapter_next = false
+++

As noted in the [theory section](./#what-is-a-voxel-in-theory), a voxel can be ***anything***; the only limit is your imagination... and the amount of memory and disk-space you have! Speaking of which, how *are* voxels represented in practice?

{% info_notice() %}
From this point on, we assume that you (the reader) know the basics of programming;
in concrete terms that would be what **bits and bytes** are, **primitive types** like *integers*, the relation between **stack and heap memory** and, last of all, **pointers/references**.

Also, for the purpose of clarity, we will *not* be using pseudocode.
{% end %}

{% warn_notice() %} **The following sections are a work-in-progress.** {% end %}

### Basic Storage

For a start, let's assume that our voxels store... nothing.

```rust
/// This represents a single voxel sample/instance.
type Voxel = (); // using the empty 'unit type' for now.
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
```

Now accessing it is pretty simple:

```rust
// Create the volume, filled with 'nothing'...
let mut volume = VoxelGrid {
  values: [[[Voxel; GRID_SIZE]; GRID_SIZE]; GRID_SIZE]
};

// Have some coordinates...
let (x,y,z) = (0, 1, 2);

// Get a voxel:
let v = volume.values[x][y][z];

// Set a voxel:
*volume.values[x][y][z] = v;
```

But what happens if `x`, `y` or `z` go *outside* the volume? We might get an error and crash!

Let's prevent that by defining *accessor functions* and then ***only*** use these:

```rust
impl VoxelGrid {
  pub fn get(&self, x: u32, y: u32, z: u32) -> Option<Voxel> {
    self.values.get(x)?.get(y)?.get(z)
  }
  
  pub fn set(&self, x: u32, y: u32, z: u32, v: Voxel) -> Option<()> {
    *self.values.get_mut(x)?.get_mut(y)?.get_mut(z) = v;
  }
}
```

Alas, this shows us one of three annoyances with using 3D arrays:

- Accessing elements always requires us to 'jump' trough two levels of indirection.
- Iterating/looping over our voxels requires *three* nested loops, which is a pain to write.
- Creating and filling a 3D array is, unsurprisingly, quite messy.

As such, we will now go ahead and make our array *flat*, turning it one-dimensional!

```rust
pub struct VoxelGrid {
  values: [Voxel; GRID_SIZE * GRID_SIZE * GRID_SIZE];
}
```

Of course, we will now have to do the bound-checks by ourselves, but as long as we use the correct equality operators, there really is nothing to it!

```rust
impl VoxelGrid {
  pub fn get(&self, x: u32, y: u32, z: u32) -> Option<Voxel> {
    if x < 0 || x >= GRID_SIZE {return None}
    if y < 0 || y >= GRID_SIZE {return None}
    if z < 0 || z >= GRID_SIZE {return None}
    self.values[ /* ??? */] // uuuuh...?
  }
}
```

I suppose a function that turns `x,y,z` into an index is also needed: an **index function**!
Since it depends on the bounds-check to work correctly, let's move that there too.

```rust
impl VoxelGrid {
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
    *self.values[ self.index(x,y,z)? ] = v;
  }
}
```

{% info_notice() %}
The line marked with `SCHEME` declares a *spatial indexing scheme* for us, which defines the *order* and *importance* of the `x,y,z` axes, but also how to turn coordinates into a usable index. Neat!
{% end %}

And so our example becomes this:

```rust
// Create the volume... somehow.
let mut volume = VoxelGrid { /* ??? */ };

// Have some coordinates...
let (x,y,z) = (/**/, /**/, /**/);

// Get a voxel:
let v = volume.get(x, y, z).unwrap();

// Set a voxel:
volume.set(x, y, z, v).unwrap();
```

Handling errors is outside the scope of this guide, so do note that the `unwrap`s in the example will,
if the coordinates are ever out of bounds, crash our program; but at least you'll know where!

But how to we fill it? And just what type should `Voxel` be?!

### Types of Voxel

{% todo_notice() %} Types of voxels. {% end %}

### Basic Generation

{% todo_notice() %} Filling a volume via [Procedural Generation](/wiki/procgen). {% end %}

