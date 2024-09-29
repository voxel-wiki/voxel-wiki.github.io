+++
title = "Introduction"
description = "A general introduction to the concept of voxels."
path = "/wiki/introduction"
[taxonomies]
categories = ["introduction"]
[extra]
chapters = true
chapter_prev = false
chapter_next = {text = "Choosing A Language", link = "/wiki/introduction/language"}
+++

This is a basic introduction to what voxels *are*, what they are *not* and their general use cases.

<!-- more -->

If you wish to know the history of voxels, see [here](https://web.archive.org/web/20141226072148/http://projectorgames.net/blog/?p=168).

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







---

{% figure(class="float", caption="A grid of voxels containing colours.", author="[Thetawave](https://en.wikipedia.org/wiki/de:User:Thetawave)", license="[CC-BY-3.0](https://commons.wikimedia.org/wiki/File:Voxelgitter.png)") %}https://upload.wikimedia.org/wikipedia/commons/b/b4/Voxelgitter.png{% end %}

> ...on a regular grid...

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












<details class="notice info">
<summary id="what-is-not-a-voxel" tabindex="0"><b>What is <em>not</em> a voxel?</b></summary>

Every now and then, someone thinks they are dealing/working with voxels, when they're in fact **not** doing so...

---

**Heightmaps Are Not Voxels**

If values are generated in a *two*-dimensional grid and *expanded* into a *third* dimension on-demand,
such as *during rendering*, you are ***not*** using voxels.

That's just a plain old [heightmap](https://en.wikipedia.org/wiki/Heightmap) *pretending* to be voxels!

{% info_notice() %}
**Important:**  
This does **not** mean that *columns* of values arranged in a grid, like [run-length encoded](/wiki/compression/run-length-encoding) data might be, aren't voxels!
The way that voxels are [*stored*](/wiki/datastructures) does not matter as long as the grid is indexable.
{% end %}

---

**Individual Voxels Have No Position**

If one defines individual voxels with an *explicit* position, like...

```rust
struct Voxel {
  position: (i32, i32, i32),
  value: ???
}
```

...then that's *not a Voxel*, by definition.

It's also really, *really* bad for performance. Don't do this.

Let me repeat: <b style="color:red">Don't do this.</b>
</details>













## Volume = Distance ³

A fundamental reality of many voxel algorithms
is that the data they deal with **cubically**[^squarecube].
What does that mean, in practice?

Let's do a tiny bit of math (<small>feel free to grab a calculator</small>):

1. Think of how far into the distance you want to 'see', in meters/voxels.
2. Using that distance, calculate `(D*2)³` to get the visible volume.
3. Assume a voxel takes just a single byte of space...
4. Divide by `1024` to get it as kilobytes.
5. Divide by `1024`, again, for megabytes.
   - Divide again to get gigabytes, if needed.
6. Look at the amount of memory used.
7. Change the distance and repeat a few times.

{{ volume_memory_calc(id="calculator") }}

{% info_notice(summary="Fun Fact: Planet-sized Volumes") %}
If you solve the volume for the size of the earth (a radius of 6371km), you will get a fun number of roughly **2068 exabyte**... which is roughly seven percent of the world-wide-webs *entire* contents (in ~2024), at about **27000 exabyte**!

Luckily, most of any planets volume is unreachable, hidden under the surface,
so it can be treated as if it didn't exist, vastly reducing the needed volume.
{% end %}

While computers these days are pretty darn powerful, **they still have limits**,
and working with voxels can push them there *very* quickly...

- Your RAM may be large (many gigabytes, usually ~4-8 GB),<br/>
  but the bits'n'bytes still need to go to/fro the CPU and back.

- Your CPU may be fast (*billions* of operations per second),<br/>
  but even the fastest processors will weep at `O(n³)`.

- Your GPU has a whole lot of cores, but efficiently using them is... complicated.
  Also, VRAM is *hella* expensive.

So keep the law in mind when writing yet another `for(voxel in volume)`,
or your CPU might just go up in flames. ;)

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

For the creation of **voxel art**,
we highly recommend checking out [MagicaVoxel](https://ephtracy.github.io/index.html?page=mv_main),
which is currently considered to be *the* best voxel-editor you can get; it's completely free!

Perhaps [share](/wiki/community) your creation?

---

## Next

Choosing a programming language!

---

[^squarecube]: <https://en.wikipedia.org/wiki/Square%E2%80%93cube_law>
