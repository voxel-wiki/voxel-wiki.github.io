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

If you wish to know the history of voxels, in the specific context of games,
[see here](https://web.archive.org/web/20141226072148/http://projectorgames.net/blog/?p=168).

{% info_notice() %}
**Note:**
While this is quite the lengthy article, the concepts *should* be relatively straight forward.
If you need help with learning any of this, don't understand something,
or simply want to hang out, feel free to visit [our community](/wiki/community) and ask away!  ;)
{% end %}

## What's (in) a voxel...

{% figure(class="float", caption="A grid of voxels containing colours.", author="[Thetawave](https://en.wikipedia.org/wiki/de:User:Thetawave)", license="[CC-BY-3.0](https://commons.wikimedia.org/wiki/File:Voxelgitter.png)") %}https://upload.wikimedia.org/wikipedia/commons/b/b4/Voxelgitter.png{% end %}

The most common definition of voxels is that they're **cubes arranged in a grid**... which is fine as a quick explanation, but falls short by so much, as to be utterly useless and straight up *wrong*.

So...

Since there are several ways to define voxels, let's start by taking apart the word itself!

{% figure(class="text-center mb-3") %}
> Volumetric ('vo-') Element ('-xel')
{% end %}

This can be read as "an element of a volume", which is simple enough to interpret:
voxels are made by **cutting** a three-dimensional[^dimensions] **volume** into **elements**.

But how do we cut the volume? And what's an element?

### Voxel samples?

Starting with the latter (because it's shorter), **the elements are point samples**: Pieces of data that exist at specific/exact positions in 3D space.

Since voxels are samples, we are now obligated to pull in some concepts/rules from signal processing:

1. Voxels are often [sampled](https://en.wikipedia.org/wiki/Sampling_(signal_processing)) from original fields of data, like terrain-height, density, temperature, moistness, etc. etc.
2. Voxels have, depending on the data they represent, a type/class of continuity that limits how they can be 'mixed'.
3. Voxels tend to be under- and super-sampled, creating moiré effects and aliasing artifacts.
4. Voxels, being samples, don't need to know or store their own position.

{% figure(class="text-center mb-3") %}
> Voxel are point samples; signal-processing rules apply.
{% end %}

{% info_notice() %}
**Note:** Because of point 4, having voxels explicitly store their own position, like...

```rust
struct Voxel {
  position: (i32, i32, i32),
  value: ???
}
```

...quite literally makes them no longer be voxels.
It's also *horrifically&nbsp;bad* for performance.
<b style="color:red">Don't do this.</b>[^tempsamples]
{% end %}

On point 2 specifically, voxels can be split into two-ish families:

- **Continuous voxels** represent fields of quantities, intensities, densities;
  anything that is smooth or approximate.

- **Discrete voxels** (or **bloxels**) represent indices and distinct values,
  that cannot be interpolated or mixed.  
  <small class="info notice d-inline">This is what Minecraft's blocks are!</small>

Depending on the needs of simulation- and rendering-systems,
voxels from these families might be layered and stored in the same data-structure,
share the same memory pool/s, or perhaps even be interleaved.

They are not written in stone and, quite often, overlap in a variety of ways.

{% figure(class="text-center mb-3") %}
> Voxel may be discrete, continuous, or anything in-between.
{% end %}

### Voxel tilings?

Next, we'd like to cut the volume... which is currently only defined to have three dimensions,
with no boundary or 'outside'... meaning it's *infinite*.

So whatever method we choose to cut it up, has to be repeatable in *all* directions,
at *any* distance, *forever*. And the only thing we can cut *by*, is our position in 3D space...

Thankfully, there's just the thing for that: A [honeycomb](https://en.wikipedia.org/wiki/Honeycomb_(geometry))!

{% figure(class="text-center mb-3") %}
> Every voxel volume is defined by a honeycomb tiling.
{% end %}

No, not the one bees make (*imagine a sad 🐝 here*), but the **geometric tilings** that perfectly fill space,
without leaving any gaps, and of which there are infinitely... many... <small>oh no</small>.

For sanity's sake, we'll now proceed to ignore all geometric honeycomb tilings
(<small>but remember that any[^planetsmith] can be used!</small>) and focus on the one
that'll give us the least amount[^headaches] of headaches: **cubic cells**.

{% figure(class="text-center mb-3") %}
> The simplest tiling to use for voxels is cubic cells.
{% end %}

{% info_notice() %}
**Note:** This is why voxels are often thought of as "little cubes".
The vast, *vast* majority of implementations use cubic cells as their tiling,
simply because doing so is... simpler.  
Who would've guessed?!
{% end %}

A tiling of cubic cells is nice to work with for many reasons, which include, but are not limited to:

1. We can use euclidean coordinates (`x,y,z`) as positions.
   - Which is what most people are comfortable with.
2. Coordinates can always consist of whole numbers (integers).
   - Which makes indexing voxels straightforward.
3. Cubes can be perfectly cut/packed into smaller/larger cubes.
   - Which makes grouping and storing voxels simple.

### So what's in a voxel?

With our perfectly serviceable cubic tiling in hand,
we can return to the original question: **What's *in* a voxel?**

{% figure(class="text-center mb-3") %}
> Voxels can contain or represent anything.
{% end %}

Yep, the short answer is that an individual voxel can be, or represent, *absolutely anything*, like...

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
- *Another* grid of voxels.

<!-- And that's *without* taking the matter of encoding and storing voxels, be it in-memory or on-disk, into account. -->

...but that *still* doesn't tell us much, so we'll have to go, yet again, for the long answer... which *could* be summarized as <q>it depends</q>, but when's that ever been helpful?!

### How many voxels?

Let's start with the obvious: Where there's one voxel, there's a thousand, million, billion, trillion...

{% figure(class="text-center mb-3") %}
> Voxels tend to exist in absurdly large numbers.
{% end %}

...and *any* increase in the simulation- or rendering-distance makes the number go up, *fast*.
If you've got JavaScript enabled, play around with this calculator widget, see how big the required raw memory gets.

{{ volume_memory_calc(id="calculator") }}

This is an unavoidable consequence of the [square-cube law](https://en.wikipedia.org/wiki/Square%E2%80%93cube_law),
which just states that with increasing size, the volume of a shape expands faster than it's surface area.

{% info_notice(summary="Fun Fact: Planet-sized Volumes") %}
If you calculate the volume for the size of the earth (a radius of 6371km), you will get a fun number of roughly **2068 exabyte**... which is roughly seven percent of the world-wide-webs *entire* contents (in ~2024), at about **27000 exabyte**!

Luckily, most of any planets volume is unreachable, hidden under the surface,
so it can be treated as if it didn't exist, vastly reducing the needed volume.

So we absolutely *can* have a [whole planet of voxels](/wiki/planets)!
{% end %}

Now, computers these days are pretty darn powerful, but they still have limits,
and thanks to the aforementioned law, working with voxels will get you there *very* quickly...

- Your RAM may be large (many gigabytes, usually ~4-16 GB),
  but the bits'n'bytes still need to go to/fro the CPU and back.

- Your CPU may be fast, capable of *billions* of operations per second,
  but even the fastest processors will weep at `O(n³)`.
  Especially because just `1000³` already *is* a billion!

- Your GPU has a whole lot of cores, but efficiently using them,
  much less getting data there and back, is... complicated.
  Also, VRAM is *hella* expensive.

### Actually storing voxels?

That said, while anything we store inside our voxels should be as small as possible,
so as to not consume all physical memory, this doesn't literally mean <q>only use a single byte per voxel</q>;
far from it!

{% figure(class="text-center mb-3") %}
> Storing voxels is an art of its own; be creative!
{% end %}

With a bit of creative thinking, we can still put pretty much whatever we want in them,
usually involving a mix of the following:

1. Split the voxel volume into sections, be it columns or cubes.
   - Basically all optimization tricks depend on this.
   - Do *not* split the volume into planes, like a stack of images.
     Doing so can-and-will ruin memory locality.
2. If a section of the voxel volume is unused, purge it from memory,
   possibly saving it to disk if fast regeneration isn't viable.
   - Sections that are entirely empty are a good start;
     no point in storing the upper atmosphere!
   - It's sometimes viable to convert sections into lower [levels of detail](/wiki/level-of-detail),
     taking less resources to store, compute and render.
3. In the case of continuous voxel data, such as colors and normals,
   the precision of the data [can be cut down](/wiki/discretization) quite a bit,
   without much loss in perceptual quality.
4. Whenever viable, [compress](/wiki/compression) sections of the voxel volume,
   either via a fast general method like [LZ4](https://en.wikipedia.org/wiki/LZ4_(compression_algorithm)),
   or soft-realtime methods like [palette compression](/wiki/palette-compression)
   and [run-length encoding](/wiki/rle).
5. Used sparingly and in the right places, some additional indirection *may* improve performance,
   just as it can ruin it.
   - Just don't heap-allocate individual voxels.

---

{{ todo_notice(body="Something's missing here... but what?!") }}

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
we highly recommend checking out [MagicaVoxel](/wiki/magicavoxel),
which is currently considered to be *the* best voxel-editor you can get; it's completely free!

Perhaps [share](/wiki/community) your creation?

---

## Next

Choosing a programming language!

<small>The chapter links are below the footnotes.<small>

---

**Footnotes:**

[^dimensions]: Voxels can exist in more than three dimensions, too! Conversely, voxels *cannot* exist in two dimensional space, or even 2.5D... so if someone calls a plain-ol' heightmap "voxels", they're quite wrong. Or just confused, in which case: send them here!

[^planetsmith]: There's an indie game called "Planet Smith" that uses hexagonal prisms as cells, with the occasional heptagon to prevent gaps, over a spherical geometry, forming entire planets... still voxels!

[^headaches]: There *will* be more than zero headaches, guaranteed! ...<br/>That's not a joke. Remember to drink water and take breaks.

[^tempsamples]: The exception to this rule is, of course, when a voxel is "taken out" of it's volume; in that case it's perfectly fine to *temporarily* give it an explicit position.
