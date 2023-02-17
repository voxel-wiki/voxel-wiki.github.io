+++
title = "Introduction"
description = "A general introduction to the concept of voxels."
path = "/wiki/introduction"
+++

This is a basic introduction to what voxels *are*, what they are *not* and their general use cases.

## What is a voxel?

To quote Wikipedia:

{% quote(author="Wikipedia [on Voxels](https://en.wikipedia.org/wiki/Voxel)") %}
  In [3D computer graphics](https://en.wikipedia.org/wiki/3D_computer_graphics),
  a voxel represents a value on a [regular grid](https://en.wikipedia.org/wiki/Regular_grid)
  in [three-dimensional space](https://en.wikipedia.org/wiki/Three-dimensional_space).
{% end %}

Since most people don't have a good understanding/foundation of math (in this case: [linear algebra](https://en.wikipedia.org/wiki/Linear_algebra)), let's simplify this:

{% info_notice() %}
  <a title="A stack of voxels, with one marked red.&#010;Vossman; M. W. Toews, CC BY-SA 2.5, via Wikimedia Commons" href="https://commons.wikimedia.org/wiki/File:Voxels.svg"><img style="float:right;height:3rem" alt="Voxels" src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Voxels.svg/256px-Voxels.svg.png"></a>
  A voxel is a value in a **three**-dimensional grid,
  like a [pixel](https://en.wikipedia.org/wiki/Pixel) or [texel](https://en.wikipedia.org/wiki/Texel_(graphics))
  is a value in a **two**-dimensional grid or a sheet of [graph paper](https://en.wikipedia.org/wiki/Graph_paper).
  <br style="clear:both">
{% end %}

That is the definition of a voxel!

{% info_notice() %}
**Note:**
Sometimes voxel grids can have more than three dimensions, making them hyper-volumetric elements;
or, if one adds a time-dimension, they become *temporal voxels*: toxels.
{% end %}

##### Voxel Values

Of course, there is the open question of „what *kind* of value?‟... the answer being: *Anything*, depending entirely on what you intend to do with voxels.

It might be...

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

...and this is *without* taking the encoding, be it in-memory or on-disk, into account!

##### Voxel Grids

It should be noted that a voxel grid may have holes, be stretched, have multiple sizes, etc. ...
the only requirement is that the grid is *indexable*:

> Every coordinate in the grid, that is all possible `x, y, z`-trios, should consistently lead to either
an individual voxel *or* an up/down-sampled variant of it.

#### What is *not* a voxel?

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
