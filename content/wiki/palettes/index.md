+++
title = "Palette Storage"
description = "Storing voxels via painting by numbers."
aliases = ["/wiki/palette-compression"]
[taxonomies]
categories = ["datastructures", "compression"]
tags = ["datastructures", "compression", "optimization", "instancing", "flyweight"]
[extra]
chapters = true
chapter_prev = false
chapter_next = {text = "Indices Bit-Compression", link = "/wiki/palettes/indices-bit-compression"}
+++

When dealing with voxels as discrete values (i.e.: bloxels) one will usually have a single **global palette**,
indexed via small integers, that defines all possible variants/materials that may occur in the world...

<!-- more -->

{% figure(class="float clear-header", caption="**A Color Palette**", author="[Vincent Le Moign](https://twitter.com/webalys)", license="CC-BY-4.0") %}/wiki/palettes/600-artist-palette.svg{% end %}

...as such, a global palette is often declared as a static/constant `enum`, like this:

```pseudocode
enum VoxelTypeId = u8:
	Air   = 0
	Stone = 1
	Dirt  = 2
	Grass = 3
```

Or, more commonly, a list of 'type' objects:
<div class="clearfix"></div>

```pseudocode
class VoxelType:
	name: String
	sprite: ?
	light: ?
	shape: ?
	...

class World:
	voxeltypes: Vec<VoxelType>
	...

type VoxelTypeId = Pointer<World.voxeltypes>
```

Since in either case the `VoxelTypeId`s are just integers, usually a single byte,
that index into this global palette, a chunk's simply a volume of these:

```pseudocode
class Chunk:
	const SIZE: 8
	const VOLUME: SIZE ** 3
	voxels: Array<VoxelTypeId, VOLUME>
```

...and all is good! But for how long?

## Motivation

Eventually, as the project grows, you add more voxel types.
Then some more. And even more. Even **MORE**. ***MOA-***

`Compile Error: Cannot fit 257 enum variants in a byte.`

*-r*-oh... well, that's a bummer.

Fitting 257 unique states into 8 bits is, unfortunately, mathematically and physically impossible...
so we've got to change our voxel instances to occupy the next largest data-type,
which is... <small>*checks notes*</small>... a short.

Which is eight more bits, or *two* bytes.

That'd make all our voxels take up **twice** the memory as before... do we *really* have to do that?

**Of course *not!***

### Prior Art

{% info_notice() %}This section is optional reading, only here for histories sake.{% end %}

Originally, while these days more so for [artistic reasons](https://en.wikipedia.org/wiki/Pixel_art),
[indexed&nbsp;color](https://en.wikipedia.org/wiki/Indexed_color) methods were often used
to improve digital image quality in the presence of hardware and/or software constraints.

This led to, among other things, the creation of the [GIF](https://en.wikipedia.org/wiki/GIF) image file format,
whose pronunciation keeps being debated to this day&nbsp;<small>(lol)</small>,
which, though slowly replaced by video formats with better compression (like AVIF),
still sees widespread usage across the internet.

{% figure(caption="GIF image of a parrot and its resulting color palette, represented as rotating cube of RGB samples.", author="**Image Source:** [https://en.wikipedia.org/wiki/Palette_(computing)](https://en.wikipedia.org/wiki/Palette_(computing))<br/>**Image Credits:** [Ricardo Cancho Niemietz](https://en.wikipedia.org/wiki/User:Ricardo_Cancho_Niemietz) & [Kjerisch](https://commons.wikimedia.org/wiki/User:Kjerish)") %}
<table>
	<tbody><tr>
		<td><img title="Image of a Parrot" src="https://upload.wikimedia.org/wikipedia/commons/d/d7/RGB_24bits_palette_sample_image.jpg"></td>
		<td><img title="Palette of the Image (as animated rotating RGB-space cube)" src="https://upload.wikimedia.org/wikipedia/commons/0/05/Sample_Image_RGB_Cube.gif"></td>
		<td></td>
	</tr></tbody>
</table>
{% end %}

<br>

At some point during the development of [Minecraft 1.13](https://minecraft.wiki/w/Java_Edition_1.13)
<small>("Update Aquatic", released July&nbsp;2018)</small>, after changing how their voxel types are
[referenced internally](https://minecraft.wiki/w/Java_Edition_Flattening) in the previous update,
Mojang was able to implement [lossless compression](https://en.wikipedia.org/wiki/Lossless_compression)
of voxel volumes at runtime: the first publicly known usage of palette compression for voxels.

{% info_notice() %}
Physically, color palettes are both
used in [free-form painting](https://en.wikipedia.org/wiki/Palette_(painting))
and via [paint-by-number kits](https://en.wikipedia.org/wiki/Paint_by_number);
the latter being surprisingly fitting!
{% end %}

## Theory

{% info_notice() %}
If you aren't already, use some form of [chunking](/wiki/chunking) to manage your voxel volume;
this technique directly requires and expands upon it.
{% end %}

Let's assume, for arguments sake, that your chunks contain `8³` voxels;
how many possible voxel variations (number of unique voxel types) can exist in a single chunk?

If you went and raised `8` to the power of `3`, and got `512`, you have a working calculator!
So, let's note this down as a rule:

{% figure(class="mb-3", id="palette-size-maximum") %}
> A chunk can *always only contain* as many voxel variations as it's *total volume* and **never more**.
{% end %}

Quite simple! Now, conversely, what is the *minimum* amount of variations a chunk can hold?
If *all* the voxels were exactly the same? Well, we'd have... one variant!

{% figure(class="mb-3", id="palette-size-minimum") %}
> The *minimum* number of voxel variations of *any* chunk, *regardless* of size, is **one**.
{% end %}

That covers the extreme cases; now what about the average?

How many unique voxel variants does any common chunk contain?

- Imagine a chunk way up in the sky; it'd just be air, right?

- Or a chunk deep below ground: its just rock, with a scant few ores mixed in.

- And don't forget the open sea/ocean: its just (sea)water, as far as the eye can sea!

- What about a grassy field? Some plants, grass, dirt/soil...

For the *vast majority* of chunks, there's maybe two, sometimes four,
and *very* rarely eight, unique voxel variants; things are just...
mostly all the same stuff.

It's only on the surface where all the plants and structures live,
which is a *way* smaller volume than the sky and underground,
that the average chunk will hold more than a bakers dozen variants.

So, how can we use that to our advantage?

Well... since the *variants* in any given chunk are *unique* within that chunk,
we can stuff them into a list, like say...

```pseudocode
Variants = {Air, Grass, Dirt, Flower}
```

...and then redefine our chunks volume to be indices pointing into that list...

```pseudocode
Indices = [0, 0, 0, 0, ..., 2, 2, 2]
```

...we get... a chunk that is [painted by numbers](https://en.wikipedia.org/wiki/Paint_by_number),
consisting of numbers (the indices) and a **palette** of variants.

Now you *might* think-

> Great, so we're painting our voxels by numbers, palette in hand; *so what*?

But the important detail here is that we're **not holding the global palette**:
this one is *local* to its chunk with it's own "colors", the chunks voxels pointing into it,
indirectly using the global palette.

And this local palette holds *only* the unique variants, of all voxels currently stored in the chunk...
so any index pointing into that palette, only's gotta be *just* big enough to do that *and no larger*.

How big exactly? Well, here's the math:

{% figure(class="m-2", id="palette-size-equation", caption="Relation between a palettes size and the bit-size of any index/indices pointing into it.") %}
<center class="m-2"><code>index<sub>bits</sub> = ceil( log2 ( palette<sub>size</sub> ) )</code></center>
{% end %}

This formula may not mean much to you (or ya don't like math! IDK),
so let's look at a table that solves it for some palette sizes...

| Palette Size<br><small>(local unique variants)</small> | Index Bits<br><small>`ceil(log2(palette-size))`</small> |
|------------:|-----|
|         `1` | `0` (!) |
|         `2` | `1` |
|     `3 - 4` | `2` |
|     `5 - 8` | `3` |
|    `9 - 16` | `4` |
|   `17 - 32` | `5` |
|   `33 - 64` | `6` |
|  `65 - 128` | `7` |
| `129 - 256` | `8` |

Well, would you look at that: Even with reasonably high numbers of variants,
the indices don't need many bits at all... or *any* at all,
if the volume &amp; palette happens to contain exactly *one* variant!

{% figure(class="mb-3", id="palette-local-minbits") %}
> With per-chunk palettes, voxels need *mere bits* of storage.
{% end %}

Since voxels, by their very nature, exist in *stupidly large*[^squarecubelaw] amounts,
this results in a pretty ludicrous reduction in memory consumption,
often more than halving RAM usage, at almost zero performance cost.

Let's redefine our chunk structure, to use an array of integers whose size is variably defined by the previous formula:

```pseudocode
class Chunk:
	...
	palette: List<VoxelTypeId>
	indices: VarIntArray<ceil(log2(palette.size)), VOLUME>
```

All that really changed, is that the chunks volume is now made of *indices*,
whose bit-size depends on the palettes size,
with the palette they point at as a new field above it...

...and theory-wise, that's it: **palette compressed** voxel storage.

### Pro & Contra

Using this technique, we gain many advantages, like...

- **Massively reduced memory footprint:**  
  Since common environments only need a few voxel variants,
  even if arranged in impossibly many [pseudo-randomly generated](/wiki/procgen) patterns,
  large volumes of voxels will take up *way* less memory.

- **Smaller (pre-)serialized size:**  
  The technique is also great for persistent storage,
  as a chunks volume of indices can still be dumped straight to disk,
  with the serialized palette taking barely any additional space.

- **Effectively unlimited voxel types:**  
  With the indirection of the palette, the pointer into the global palette can safely be a proper pointer/reference,
  ensuring you'll sooner run out of ideas for voxel types, rather than available working memory.

- **Almost zero-cost state permutations:**  
  Expanding on the previous point, entries in the local palette can also hold additional metadata,
  instead of just a reference into the global palette.
  Even a single extra 32-bit integer of metadata, allows for ludicrously many state permutations,
  at almost no additional cost.

- **Multilayer voxel data:**  
  By splitting voxel types across multiple layers, like 'solid' and 'fluid', each layer having its own palette,
  voxels can be 'overlaid' (or 'logged') and potentially simulated in parallel.

...but, of course, this comes with trade-offs:

- **Access overhead:**  
  All voxel accesses will be a <small>tiny</small> bit slower on average.
  Given some old micro-benchmarks, one can expect (at worst) an up to ~14% slowdown,
  with reads significantly less affected than writes. For bulk read/write access,
  temporary decompression of the volume may be needed.

- **Pointer chasing:**  
  The palette entries *must* be stored as contiguous array that,
  except for the global palette pointed at by the voxel type,
  shouldn't contain any additional pointers/references,
  as to keep palette operations in local registers and L1 cache,
  avoiding spilling into L2 (or worse: L3) cache as much possible.
  This can be partially worked around, if necessary, with tagged value pointers and/or atomically shared objects.

- **Dynamic allocations:**  
  Both the volume of indices and its associated palette can change in size as they're edited,
  which can be quite the issue in memory- or allocation-constrained environments (like the GPU!).
  Using the system allocator here, especially on Windows, will cost *way* too much time/latency.

<br/>With all that said, these trade-offs are *absolutely worth it*.

---

## Implementation

Now then, time to actually implement it!

For simplicities/familiarities sake, we'll be using
[C#](https://en.wikipedia.org/wiki/C_Sharp_(programming_language))
here.

Let's start with a basic chunk implementation,
using `ushort` for `VoxelTypeId`, for examples sake:

```c#
public class Chunk {
	public const int EDGE_SIZE = 32;
	public const int VOLUME_SIZE = EDGE_SIZE * EDGE_SIZE * EDGE_SIZE;
	ushort[] voxels = new ushort[VOLUME_SIZE];
	
	// --- Internal Spatial Indexing Scheme
	// See: voxel.wiki/wiki/introduction/storage#spatial-indexing-scheme
	public int index(int x, int y, int z) {
		// out-of-bounds handling omitted for brevity
		return x*EDGE_SIZE*EDGE_SIZE + z*EDGE_SIZE +  y;
	}
	
	public ushort get_voxel(int x, int y, int z) {
		return voxels[index(x,y,z)];
	}
	
	public void set_voxel(int x, int y, int z, ushort voxel) {
		voxels[index(x,y,z)] = voxel;
	}
}
```

To store our unique voxel variants in a palette, we turn the volume into indices
and create a plain-ol' array of palette entries... let's rewrite our chunk class:

```c#
// This MUST be a struct.
struct PaletteEntry {
	ushort voxel_type_id;
}

class Chunk {
	public const int EDGE_SIZE = 32;
	public const int VOLUME_SIZE = EDGE_SIZE * EDGE_SIZE * EDGE_SIZE;
	
	PaletteEntry[] palette;
	byte[] indices = new byte[VOLUME_SIZE]; // renamed!
	
	public int index(int x, int y, int z) {
		// out-of-bounds handling omitted for brevity
		return x*EDGE_SIZE*EDGE_SIZE + z*EDGE_SIZE +  y;
	}
	
	public ushort get_voxel(int x, int y, int z) {
		var index = index(x,y,z);
		var palette_id = indices[index];
		return palette[palette_id];
	}
	
	public void set_voxel(int x, int y, int z, ushort voxel_type_id) {
		/* ??? */
	}
}
```

So far, easy! Except... hold on... how do we *set* a voxel now?

First off, to ensure the uniqueness of variants in the palette,
we now have to *scan* the palette for the type we want to set our voxel to:

```c#
	public void set_voxel(int x, int y, int z, ushort voxel_type_id) {
		var index = index(x,y,z);
		var old_palette_id = indices[index]; // we'll need this
		
		// Check if the voxel type is already in the palette,
		// and if so, use it!
		int replace = Array.FindIndex(palette
			, (entry) => entry.voxel_type_id == voxel_type_id
		);
		
		if (replace != -1) {
			// the type is already in the palette, use it!
			indices[index] = replace;
			return;
		}
		
		/* --- snip --- */
```

{% info_notice() %}
**Note:**
This scan is why the palette **must** be an array of tightly packed struct entries:
iterating over such a consecutive (~1kB) range of memory, is up to ***14x faster than using a hashmap***.

If entries were to be fragmented across memory, due to being heap-allocated,
that single pseudo-random(-ish) entry pointer-dereference alone would ruin performance.
{% end %}

If we cant find our voxel type, we've got to expand the palette:

```c#
		/* --- snip --- */
		
		Array.Resize(palette, palette.Length + 1);
		
		var last = palette.Length - 1;
		palette[last] = new PaletteEntry() {voxel_type_id};
		indices[index] = last;
		// all done!... right?
	}
```

But now there's a new problem:
Since our volume of indices is currently using bytes (we'll fix that next chapter!),
if we keep changing voxels (adding more variants to the palette),
our index will eventually overflow after ~256 changes... which is bad.

How do we eliminate old/unused entries from the palette?

We *could* scan our volume of indices,
counting how many point at which palette entry and, using that,
periodically (or on overflow) remove unused entries.
But that'd be quite inefficient.

Let's instead add a *reference counter* to our palette entries.

```c#
struct PaletteEntry {
	ushort voxel_type_id;
	int refcount = 0;
}
```

Of course, we now have to correctly keep track of these `refcount`-ers,
so let's adjust what we've written before...

```c#
	public void set_voxel(int x, int y, int z, ushort voxel_type_id) {
		var index = index(x,y,z);
		var old_palette_id = indices[index];
		
		// Reduce the refcount for the *current* palette entry...
		palette[old_palette_id].refcount -= 1;
		
		// Check if the voxel type is already in the palette,
		// and if so, use it!
		int replace = Array.FindIndex(palette,
			(entry) => entry.voxel_type_id == voxel_type_id
		);
		
		if (replace != -1) {
			// Type is already in the palette;
			indices[index] = replace;
			palette[replace].refcount += 1; // use it!
			return;
		}
		
		/* --- snip A --- */
```

Since we know whether any given palette entry is used at all,
we can also check if our 'old' entry has no remaining references,
and immediately reuse it instead:

```c#
		/* --- snip A --- */
		// There is no existing palette entry with our type...
		
		// Is the *current* palette entry unused?
		if (palette[old_palette_id].refcount == 0) {
			// The old entry is unused, replace it wholesale!
			palette[old_palette_id] = new PaletteEntry() {
				voxel_type_id,
				refcount = 1
			};
			
			// We don't have to change the index in the volume,
			// as it already points to the old-now-new entry.
			return; // done!
		}
		
		/* --- snip B --- */
```

And finally, we fix up the part where we grow the palette...

```c#
		/* --- snip B --- */
		
		Array.Resize(palette, Math.max(palette.Length,2) * 2);
		// ^This (ab)uses zero-initialization of structs.
		
		var last = palette.Length - 1;
		palette[last] = new PaletteEntry() {voxel_type_id, refcount = 1};
		indices[index] = last;
		
		// There, all done now... right?
	}
```

Et voilà, we have implemented palettes! :D

Except we forgot to compress the indices; *oooops!*

{% info_notice() %}
**Note:** Compressing the indices isn't *strictly* necessary.  

If one can ensure the palette stays below 256 variants, using plain bytes as indices is viable,
and will still save lot's of memory, compared to using a volume of shorts as voxels.

It's also perfectly fine to stop right here and come back later,
as the compression of indices is a self-contained implementation detail.
{% end %}

Let's cover that in [the next chapter](/wiki/palettes/indices-bit-compression), shall we?

## Packed Storage Interface

But wait, there is one more (optional!) thing we can do here!

Since the palette and indices are flat structures,
with the definition of "position" and "location" separately declared
by the [spatial indexing scheme](/wiki/introduction/storage#spatial-indexing-scheme),
we can split out the palette storages implementation.

Why, you ask?

By abstracting palette storage to be generic over any type of equatable struct elements
<small>(in C# terms: `where T: struct, IEquatable<T>`)</small>, it can be reused for a variety of things,
the best examples being additional layers/channels of data, overlaid atop the base voxel volumes.

These additional layers can contain stuff like separately simulated liquids,
cellular-automata based lighting, per-voxel color tints/paints, logic-circuit simulation, etc. etc.

{{ todo_notice(body="Storage Implementation Separation") }}

```c#
// THIS CODE IS NOT COMPLETE / USABLE
// THIS CODE IS NOT COMPLETE / USABLE
// THIS CODE IS NOT COMPLETE / USABLE

class Chunk {
	public const int EDGE_SIZE = 32;
	public const int VOLUME_SIZE = EDGE_SIZE * EDGE_SIZE * EDGE_SIZE;
	
	readonly IPackedStorage<MyVoxelType> storage = new PaletteStorage(VOLUME_SIZE);
	// todo: ...?
}

interface IPackedStorage<T> where T: struct, IEquatable<T> {
	uint getCapacity();
	T getElement(uint position);
	T setElement(uint position, T element);
}

class ArrayStorage<T> : IPackedStorage<T> where T: struct, IEquatable<T> {
	readonly T[] elements;
	// todo: ...?
}

struct PaletteEntry<T> where T: struct, IEquatable<T> {
	T element;
	int refcount = 0;
	// todo: ...?
}

class PaletteStorage<T> : IPackedStorage<T> where T: struct, IEquatable<T> {
	PaletteEntry<T> palette;
	byte[] indices;
	// todo: ...?
}

// THIS CODE IS NOT COMPLETE / USABLE
// THIS CODE IS NOT COMPLETE / USABLE
// THIS CODE IS NOT COMPLETE / USABLE
```

---

{{ todo_notice(body="Arena Allocation?") }}
{{ todo_notice(body="Run-Length Encoding?") }}
{{ todo_notice(body="Tagged Value Pointers?") }}

## References

- [Wikipedia on Palettes in Computing](https://en.wikipedia.org/wiki/Palette_(computing))
- [Minecraft JE 1.13: The Flattening](https://minecraft.wiki/w/Java_Edition_1.13/Flattening)
- [Original article on longor.net](https://www.longor.net/articles/voxel-palette-compression-reddit)

---

[^squarecubelaw]: **The square cube law:** With every meter/unit that the viewing distance (a diameter `d`) is increased,
the overall surface area will grow by a *square* factor (`d²`), while the volume will grow by a *cubic* (`d³`) factor!
