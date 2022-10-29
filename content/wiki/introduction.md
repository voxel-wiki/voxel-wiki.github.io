+++
title = "Introduction"
description = "A general introduction to the concept of voxels."
path = "wiki/introduction"
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

##### Voxel Grids

It should be noted that a voxel grid may have holes, be stretched, have multiple sizes...
the only requirement is that the grid is *indexable*:

Every coordinate in the grid, i.e.: `x, y, z`, should consistently lead to either
an individual voxels value or an [up/down-sampled](/wiki/rendering/sampling) variant of it.

#### What is *not* a voxel?

If values are generated in a *two*-dimensional grid and *expanded* into a *third* dimension on-demand, such as *during rendering*,
you are ***not*** using voxels. That's just a plain old [heightmap](https://en.wikipedia.org/wiki/Heightmap) *pretending*
to be voxels!

**Important:**  
This does **not** mean that *columns* of values arranged in a grid, like [run-length encoded](/wiki/compression/run-length-encoding) data might be, are not voxels!
The way that voxels are [*stored*](/wiki/datastructures) does not matter as long as the grid is indexable.

## What are voxels used for?

Many things, but three of them stick out: **Videogames**, **3D Modeling**, **Simulation** and **Medicine**!

Since you are visiting this wiki, you might already know *what* you want to use voxels for;
if not, please take some time to think about it, or just read on ahead.

### Videogames

Want to create a videogame using voxels?

Then you'll have to first decide whether you want to start [from scratch](/wiki/engines/from-scratch)
or use an existing [game-engine](/wiki/engines/).

{% warn_notice() %}
    **Warning:**  
    Starting from scratch requires knowledge about *many* different areas of programming.
    If you don't have *any* experience with 3D computer-graphics,
    or simply don't want to invest *literal years* of your
    [*very finite life*](https://www.youtube.com/watch?v=JXeJANDKwDc),
    it might be best to start with a [game engine](/wiki/engines) instead.
{% end %}

Here are some questions you should ask yourself from the get-go...

&mdash; What should your voxels **look like** to the player?

- Plain coloured cubes?
- Textured cubes?
- Smooth terrain?
- Realistic?

&mdash; **How big** will the **individual voxels** be, in relation to the player?

Too small, you loose the ability to easily build stuff;
too big, there won't be enough detail for the mind to fill in.

Note that this directly plays into what your voxels look like!

&mdash; **How big** do you want **the world**, that the player exists in, to be?

Keep in mind that, even if you procedurally generate an *entire* planet,
you will *still* have to fill it with interesting content; best start small!

&mdash; Will players be able to **play together**?

If you start with just singleplayer and then try to add multiplayer on top... you will be in for a *colossal* world of pain.

&mdash; Do you want your voxels to be **destructible** by the player?

Some optimizations can only be done during development-time, instead of runtime,
due to the soft realtime constraints of videogames;
making the switch later is *very* annoying.

###### Minecraft Clone?

If you *do* intend to create a voxel-based videogame,
there is something you should be *immediately* and *acutely* aware of:

No matter what you do, your game **will** inevitably be compared to Minecraft... and that's okay!

Copying and [remixing](https://www.youtube.com/watch?v=MZ2GuvUWaP8) other peoples ideas
has been happening for, quite literally, *thousands of years* across ***all*** creative disciplines!

*Nothing* these days is truly original, so don't worry about it and just create what *you* like!

As a matter of fact, Minecraft is strongly inspired (read: a 'clone') of an earlier game: [Infiniminer](https://en.wikipedia.org/wiki/Zachtronics#Infiniminer).

{% warn_notice() %}
*Having said that*, **Copyrights** and **Trademarks** are very real things,
so don't go using assets from Minecraft, or other games for that matter, in your own project... unless you want to get sued.

Always check that the things you use have the [proper](https://choosealicense.com/) [license](https://tldrlegal.com/).

You have been warned!
{% end %}

### 3D Modeling

Want to create 3D-models made out of voxels?

In this case, we highly recommend checking out [MagicaVoxel](https://ephtracy.github.io/index.html?page=mv_main),
which is currently considered to be *the* best voxel-editor you can get; it's completely free!

### Simulation

{% todo_notice() %} Simulation…? {% end %}

### Medicine

{% todo_notice() %} Medicine…? {% end %}
