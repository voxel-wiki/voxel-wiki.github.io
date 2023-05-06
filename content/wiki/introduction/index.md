+++
title = "Introduction"
description = "A general introduction to the concept of voxels."
path = "/wiki/introduction"
+++

This is a basic introduction to what voxels *are*, what they are *not* and their general use cases.

## What is a voxel in theory?

To quote Wikipedia:

{% quote(author="Wikipedia [on Voxels](https://en.wikipedia.org/wiki/Voxel)") %}
  <a title="A stack of voxels, with one marked red.&#010;Vossman; M. W. Toews, CC BY-SA 2.5, via Wikimedia Commons" href="https://commons.wikimedia.org/wiki/File:Voxels.svg"><img style="float:right;height:3rem;margin:0.25rem" alt="Voxels" src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Voxels.svg/256px-Voxels.svg.png"></a>
  In [3D computer graphics](https://en.wikipedia.org/wiki/3D_computer_graphics),
  a voxel represents a value on a [regular grid](https://en.wikipedia.org/wiki/Regular_grid)
  in [three-dimensional space](https://en.wikipedia.org/wiki/Three-dimensional_space).
{% end %}

Since most people don't have a good understanding/foundation of math (in this case: [linear algebra](https://en.wikipedia.org/wiki/Linear_algebra)), let's explain this piece by piece.





---
> A voxel represents a value...

An individual voxel can be absolutely *anything*. Yes, **anything**.

- [Numerical things](https://en.wikipedia.org/wiki/Number),
  like [density](https://en.wikipedia.org/wiki/Density),
  [color](https://en.wikipedia.org/wiki/Color)
  and [direction](https://en.wikipedia.org/wiki/Euclidean_vector).
- [Labelled things](https://en.wikipedia.org/wiki/Flyweight_pattern)
  such as [states](https://en.wikipedia.org/wiki/State_(computer_science)),
  [types](https://en.wikipedia.org/wiki/Type_system),
  names, etc. etc.
- [Structured things](https://en.wikipedia.org/wiki/Data_structure):
  [text](https://en.wikipedia.org/wiki/String_(computer_science)),
  an [item](https://en.wikipedia.org/wiki/Item_(game_terminology)),
  or some other [object](https://en.wikipedia.org/wiki/Object_(computer_science)).
- *Another* grid of voxels 'inside' each voxel!

And of all this is *without* taking the encoding, be it in-memory or on-disk, into account.

See the [practice section](#what-is-a-voxel-in-practice) for more details on this.






---
> ...on a regular grid...

{% figure(class="float", caption="A grid of voxels containing colours.") %}[![From Wikipedia](https://upload.wikimedia.org/wikipedia/commons/b/b4/Voxelgitter.png)](https://commons.wikimedia.org/wiki/File:Voxelgitter.png){% end %}

Taking the definition from Wikipedia...

> <small>A regular grid is a tessellation of n-dimensional Euclidean space by congruent parallelotopes (e.g. bricks). [...] </small>

...and breaking it down:

- <q>Tessellation</q>  
  The grid is formed by *dividing space* into **cells**.
- <q>n-dimensional</q>  
  The grid has *at least* one dimension.  
  <small>But since we are in 3D space, at least three.</small>
- <q>Euclidian space</q>  
  The *axes* are at *90° degree angles* to each other, *everywhere*.
- <q>Congruent</q>  
  *Every* cell in the grid has *exactly* the **same shape**.
- <q>Parallelotopes</q>  
  - The cells are shaped like boxes.
  - Each opposing side has the same area/shape.
  - Their edges in a given axis are parallel.

Now you *might* think that the *cells* of the grid are the voxels, but [that is not the case](https://www.researchgate.net/publication/244986797_A_Pixel_Is_Not_A_Little_Square_A_Pixel_Is_Not_A_Little_Square_A_Pixel_Is_Not_A_Little_Square)! The voxels are theoretically *on the corners* where the cells meet, they are neither *inside* the cells nor *are* they the cells; a voxel is a *point sample*, not a little cube.

In practice you will usually notice this when either *rounding* or *off-by-one* errors occur.

<div style="clear:both"></div>





---
> ...in three-dimensional space.

- There must be *at least* three-dimensions, so as to form a **volume**.
- Adding more spatial dimensions turns the voxels hyper-volumetric,  
  making them **hypervoxels** <small>(there is no shorthand or acronym for this)</small>.
- Adding a time-dimension turns them into temporal voxels,  
  making them **toxels**.

---

That is the definition of a voxel; and if that all sounded complicated... well that's because it is!
Mathematics are like that sometimes.

Let us continue with voxels in practice...








## What is a voxel in practice?

As noted in the [theory section](#what-is-a-voxel-in-theory), a voxel can be ***anything***; the only limit is your imagination... and the amount of memory and disk-space you have! Speaking of which, how *are* voxels represented in practice?

{% info_notice() %}
From this point on, we assume that you (the reader) know the basics of programming;
in concrete terms that would be what **bits and bytes** are, **primitive types** like *integers*, the relation between **stack and heap memory** and, last of all, **pointers/references**.

Also, for the purpose of clarity, we will *not* be using pseudocode.
{% end %}

{% warn_notice() %} **The following sections are a work-in-progress.** {% end %}

### Choosing a Language

In many fields of programming, the choice of language is quite open... even interpreted languages are often acceptable!

But with voxels? Take a quick look at this table:

| Size | Volume |
|------|--------|
| `1` | `1` |
| `2` | `8` |
| `4` | `64` |
| `8` | `512` |
| `16` | `4096` |
| `32` | `32768` |
| `64` | `262144` |
| `128` | `2097152` |
| ... | ... |
| `1024` | `1073741824` |

Unless you keep the range of the active volume *very* small (on the order of `16³` to `256³`), you will quickly realize that there is a *scaling problem*: Increasing the size of the volume will consume *exponentially* more and more memory, while making computations horrendously expensive.

As such, there are some rather strong **requirements** when choosing a language:

- Tightly packing data, via structs and continuous arrays.
- Processing large arrays/lists of numbers at bare-metal speed.
- Creation of complex, nested, but performant, data-structures.
- No copying or cloning of data unless requested.
- Access to graphics hardware acceleration.
- Multithreading.

This effectively cuts out *all* languages that are [interpreted](https://en.wikipedia.org/wiki/Interpreter_(computing)) instead of compiled, such as `Python`, `JavaScript`, `PHP`, `Lua`, `Perl` and `Ruby`; using these languages limits your active volume to quite a small size, which can be fine.

Some [Just-In-Time Compiled](https://en.wikipedia.org/wiki/Just-in-time_compilation) languages *can* be used, such as `Java` and `C#`, but it's not recommended due to some of the listed requirements and a variety of rather hard to explain factors; just... trust us on this one. Please.

Unfortunately, all of this restricts our choice to 'system-level' languages, such as `C`, `C++`, `Rust`, `Zig`, `Go` and so on.

### Basic Storage

For a start, let's assume that our voxels store... nothing.

```rust
type Voxel = ();
```

Since a voxel outside a grid is (by definition) not a voxel, we will have to put it into a grid of voxels...

```rust
pub struct VoxelGrid {
  // ???
}
```

...but how exactly do we do that?

At first, you might try to use a 3D array; let's say of size `16³`:

```rust
pub const GRID_SIZE: usize = 16;

pub struct VoxelGrid {
  values: [[[Voxel; GRID_SIZE]; GRID_SIZE]; GRID_SIZE];
  // Well ain't that nice to look at, eh?
}
```

Now accessing it is pretty simple:

```rust
// Create the volume... somehow.
let mut volume = VoxelGrid { /* ??? */ };

// Have some coordinates...
let (x,y,z) = (/**/, /**/, /**/);

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
    Some(x + y*16 + z*16*16) // SCHEME
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

But how to we fill it?

### Basic Generation

{% todo_notice() %} Filling a volume via [Procedural Generation](/wiki/procgen). {% end %}







## What is *not* a voxel?

If values are generated in a *two*-dimensional grid and *expanded* into a *third* dimension on-demand,
such as *during rendering*, you are ***not*** using voxels.

That's just a plain old [heightmap](https://en.wikipedia.org/wiki/Heightmap) *pretending* to be voxels!








{% info_notice() %}
**Important:**  
This does **not** mean that *columns* of values arranged in a grid, like [run-length encoded](/wiki/compression/run-length-encoding) data might be, are not voxels!
The way that voxels are [*stored*](/wiki/datastructures) does not matter as long as the grid is indexable.
{% end %}









---

## What are voxels used for?

*Many* things, but three of them stick out:

<ul class="exclusive-choice-set" aria-label="uses of voxels">
  <li><a href="/wiki/intro-to-videogames">Videogames</a></li>
  <li><a href="/wiki/intro-to-simulation" class=missing>Simulation</a></li>
  <li><a href="/wiki/intro-to-medicine" class=missing>Medicine</a></li>
</ul>

{% info_notice() %}
Since you are visiting this wiki, you might already know what you intend to use voxels for;
if not, please take some time to think about it, otherwise just read on ahead! :)
{% end %}

For making **art** made of voxels,
we highly recommend checking out [MagicaVoxel](https://ephtracy.github.io/index.html?page=mv_main),
which is currently considered to be *the* best voxel-editor you can get; it's completely free!  
Perhaps [share](/wiki/community) your creation?
