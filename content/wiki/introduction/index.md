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

There could even be *another* grid of voxels 'inside' each voxel!





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

As noted in the theory section, a voxel can be ***anything***...

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

...and this is *without* taking the encoding, be it in-memory or on-disk, into account.
The only limit is your imagination... and the size of your memory/disk!

{% todo_notice() %} This section needs more content. {% end %}







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
