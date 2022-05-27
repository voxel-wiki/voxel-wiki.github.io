+++
title = "Introduction"
description = "A general introduction to the concept of voxels."
path = "wiki/introduction"
+++

So, you want/need/must work with voxels and have no idea where to start, much less what exactly voxels are?

Well, you've come to the right place!

## What is a voxel?

To quote Wikipedia:

> In [3D computer graphics](https://en.wikipedia.org/wiki/3D_computer_graphics), a voxel represents a value on a [regular grid](https://en.wikipedia.org/wiki/Regular_grid) in [three-dimensional space](https://en.wikipedia.org/wiki/Three-dimensional_space).
> <br>&mdash; *Wikipedia [on Voxels](https://en.wikipedia.org/wiki/Voxel)*

That is... quite a mouthful, so let us simplify:

> A voxel is a value in a three-dimensional grid, like a pixel/texel is a value in a two-dimensional grid.

That's a voxel!

Now, you *might* be asking „*What kind of value?*‟, but sadly the answer to that depends *entirely* on what you wish to do with voxels! It might be colors, directions, states, 'types', etc. etc.; absolutely anything that can be meaningfully arranged in a grid, really.

Interestingly, the grid in question may have holes, be stretched, have multiple sizes... with the only requirement being that every `x,y,z`-coordinate consistently leads to an individual voxel or an [up/down-sampled](/wiki/rendering/sampling) variant of it.

### What is *not* a voxel?

If, for example, your values are generated in a *two*-dimensional grid and then 'expanded' into a *third* dimension during rendering, you are ***not*** using voxels. That's just a plain old [heightmap](https://en.wikipedia.org/wiki/Heightmap) *pretending* to be voxels! The exception to this are [run-length encoded](/wiki/storage/run-length-encoding) *columns* of voxels.

## What are voxels used for?

Many things, but three of them stick out: **Videogames**, **3D Modeling** and **Medicine**!

Since you are visiting this wiki, you might already know *what* you want to use voxels for; if not, please think about it now, or just read on ahead.

### Videogames

Want to create a videogame using voxels?

Then you'll have to first decide whether you want to start [from scratch](/wiki/engines/from-scratch) or use an existing [game-engine](/wiki/engines/).

> **Note:**  
> Starting from scratch requires knowledge about *many* different areas of programming. If you don't have *any* experience with 3D computer-graphics, or simply don't want to invest *literal years* of your *[very finite life](https://www.youtube.com/watch?v=JXeJANDKwDc)*, it might be best to start with a game engine instead.

Also, you *should* decide early on if you want your voxels to be (or not be) destructible/editable by the user/player at runtime, very early on, since many optimizations depend on knowing this fact; making the switch later is *very* annoying.

#### Minecraft Clone?

If you *do* intend to create a voxel-based videogame, there is something **you should be immediately and acutely aware of**:

No matter what you do, your game *will* inevitably be compared to Minecraft... and that's okay! Copying and [remixing](https://www.youtube.com/watch?v=MZ2GuvUWaP8) other peoples ideas has been happening for quite literally thousands of years (basically forever), across *all* creative disciplines! Nothing these days is truly original, so don't worry about it and just create what *you* like!

### Modeling

Want to create 3D-models made out of voxels?

In this case, we highly recommend checking out [MagicaVoxel](https://ephtracy.github.io/index.html?page=mv_main), which is considered the best voxel-editor you can get, at no cost!

### Medicine

**TODO**
