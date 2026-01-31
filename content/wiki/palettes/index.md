+++
title = "Palette Storage"
description = "Storing voxels via painting by numbers."
draft = true
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

- [Physical color palettes](https://en.wikipedia.org/wiki/Palette_(painting)) and [paint-by-number kits](https://en.wikipedia.org/wiki/Paint_by_number).
- [Indexed color](https://en.wikipedia.org/wiki/Indexed_color) [image file formats](https://en.wikipedia.org/wiki/Image_file_format), such as [GIF](https://en.wikipedia.org/wiki/GIF).
- [Minecraft 1.13](https://minecraft.wiki/w/Java_Edition_1.13)
	<small>("Update Aquatic", released July&nbsp;2018)</small>:  
	By changing how voxel types are [referenced internally](https://minecraft.wiki/w/Java_Edition_Flattening),
	Mojang was able to [losslessly compress](https://en.wikipedia.org/wiki/Lossless_compression) voxel volumes at runtime.

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

The honest answer is that, for the *vast majority* of chunks, there's maybe two,
sometimes four, and *very* rarely eight, unique voxel variants;
things are just... mostly all the same stuff.

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

...we get... a chunk that is [painted by numbers](https://en.wikipedia.org/wiki/Paint_by_number), consisting of numbers (the indices) and a **palette** of variants.

Now you *might* think-

> Great, so we're painting our voxels by numbers, palette in hand; *so what*?

But the important detail here is that we're **not holding the global palette**:
this one is *local* to its chunk with it's own "colors", the chunks voxels pointing into it,
indirectly using the global palette.

And this local palette holds *only* the unique variants, of the voxels currently stored in the chunk...
so any index pointing into that palette, only's gotta be *just* big enough to do that *and no larger*.

How big exactly? Well, here's the math:

{% figure(class="m-2", id="palette-size-equation", caption="Relation between a palettes size and the bit-size of any index/indices pointing into it.") %}
<center class="m-2"><code>index<sub>bits</sub> = ceil( log2 ( palette<sub>size</sub> ) )</code></center>
{% end %}

This formula may not mean much to you, so let's look at a table that solves it for some palette sizes...

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

Well, would you look at that: Even with reasonably high numbers of variants, the indices don't need many bits at all... or *any* at all, if the palette contains exactly *one* variant!

{% figure(class="mb-3", id="palette-local-minbits") %}
> With per-chunk palettes, voxels need *mere bits* of storage.
{% end %}

Since voxels, by their very nature, exist in *stupidly large*[^squarecubelaw] amounts,
this results in a pretty ludicrous reduction in memory consumption,
often halving or even quartering RAM usage.

Let's redefine our chunk structure, to use an array of integers whose size is variably defined by the formula:

```pseudocode
class Chunk:
	...
	palette: List<VoxelTypeId>
	indices: VarIntArray<ceil(log2(palette.size)), VOLUME>
```

All that really changed, is that the chunks volume is now made of *indices*,
whose bit-size depends on the palettes size,
with the palette they point at as a new field above it...

...and that's it, theory-wise: **palette compressed** voxel storage.

### Pro & Contra

Using this technique, we gain many advantages, like...

- **Massively reduced memory footprint:**  
  Since common environments only need a few voxel variants, even if arranged in impossibly many [pseudo-randomly generated](/wiki/procgen) patterns, large volumes of voxels will take up *way* less memory.

- **Smaller (pre-)serialized size:**  
  The technique is also great for persistent storage, as a chunks volume of indices can still be dumped straight to disk, with the serialized palette taking barely any additional space.

- **Effectively unlimited voxel types:**  
  With the indirection of the palette, the pointer into the global palette can safely use a 32-bit integer,
  ensuring you'll run out of ideas for voxel types, before ever overflowing said pointer.

- **Almost zero-cost state permutations:**  
  Entries in the local palette can hold additional data, not just a reference into the global palette,
  with even a single extra 32-bit integer allowing for ludicrously many state permutations.

- **Multilayer voxel data:**  
  By splitting voxel types up into layers, like 'solid' and 'fluid', each layer having its own palette,
  multiple voxel types can be overlaid and potentially simulated in parallel.

...but, of course, this comes with trade-offs:

- **Access overhead:**  
  All voxel accesses will be a <small>tiny</small> bit slower on average.
  Given some old micro-benchmarks, one can expect up to ~14% slowdown,
  with reads less affected than writes. For bulk access,
  temporary decompression of the volume may be needed.

- **Pointer chasing:**  
  The palette entries *must* be stored as contiguous array that, except for the global palette, shouldn't contain any additional pointers/references, to keep the palettes uniqueness constraint intact. This *can* be worked around, if necessary, with tagged value pointers and/or atomically shared objects.

- **Dynamic allocations:**  
  Both the volume of indices and its associated palette can change in size as they're edited,
  which can be quite the issue in memory- or allocation-constrained environments (like the GPU!).

---

## Implementation

Now then, time to actually implement it!

For simplicities/familiarities sake, we'll be using
[C#](https://en.wikipedia.org/wiki/C_Sharp_(programming_language))
here.

Let's start with a basic chunk implementation,
using `byte` for `VoxelTypeId`, as one often does:

```c#
public class Chunk {
	public const int EDGE_SIZE = 32;
	public const int VOLUME_SIZE = EDGE_SIZE * EDGE_SIZE * EDGE_SIZE;
	byte[] voxels = new byte[VOLUME_SIZE];
	
	public int index(int x, int y, int z) {
		// out-of-bounds handling omitted for brevity
		return x*EDGE_SIZE*EDGE_SIZE + z*EDGE_SIZE +  y;
	}
	
	public byte get_voxel(int x, int y, int z) {
		return voxels[index(x,y,z)];
	}
	
	public void set_voxel(int x, int y, int z, byte voxel) {
		voxels[index(x,y,z)] = voxel;
	}
}
```

To store our unique voxel variants in a palette, we turn the volume into indices and create a plain-ol' array of palette entries... let's rewrite our chunk class:

```c#
// This MUST be a struct.
struct PaletteEntry {
	short voxel_type_id;
}

class Chunk {
	public const int EDGE_SIZE = 32;
	public const int VOLUME_SIZE = EDGE_SIZE * EDGE_SIZE * EDGE_SIZE;
	
	byte[] volume = new byte[VOLUME_SIZE]; // renamed!
	PaletteEntry[] palette = /* init omitted for now */;
	
	public int index(int x, int y, int z) {
		// out-of-bounds handling omitted for brevity
		return x*EDGE_SIZE*EDGE_SIZE + z*EDGE_SIZE +  y;
	}
	
	public short get_voxel(int x, int y, int z) {
		var index = index(x,y,z);
		var palette_id = volume[index];
		return palette[palette_id];
	}
	
	public void set_voxel(int x, int y, int z, short voxel_type_id) {
		/* ??? */
	}
}
```

So far, easy! Except... hold on... how do we *set* a voxel now?

First off, to ensure the uniqueness of variants in the palette, we now have to *scan* the palette for the type we want to set our voxel to:

```c#
	public void set_voxel(int x, int y, int z, short voxel_type_id) {
		var index = index(x,y,z);
		var old_palette_id = volume[index]; // we'll need this
		
		// Check if the voxel type is already in the palette,
		// and if so, use it!
		int replace = Array.FindIndex(palette
			, (entry) => entry.voxel_type_id == voxel_type_id
		);
		
		if (replace != -1) {
			// the type is already in the palette, use it!
			volume[index] = replace;
			return;
		}
		
		/* --- snip --- */
```

If we cant find our voxel type, we expand the palette:

```c#
		/* --- snip --- */
		
		Array.Resize(palette, palette.Length + 1);
		
		var last = palette.Length - 1;
		palette[last] = new PaletteEntry() {voxel_type_id};
		volume[index] = last;
		// all done!... right?
	}
```

But now there's a new problem: since our volume of indices is currently using bytes (we'll fix that later!), if we keep changing voxels (adding more variants to the palette), we will eventually overflow our index after ~256 changes... which is bad.

How do we eliminate old/unused entries from the palette?

We *could* scan our volume of indices, counting how many point at which palette entry, but that'd be *quite* the opposite of efficient.

Let's instead add a *reference counter* to our palette entries.

```c#
struct PaletteEntry {
	short voxel_type_id;
	int refcount = 0;
}
```

Of course, we now have to correctly keep track of these `refcount`-ers, so...

```c#
	public void set_voxel(int x, int y, int z, short voxel_type_id) {
		var index = index(x,y,z);
		var old_palette_id = volume[index];
		
	    // Reduce the refcount for the *current* palette entry...
	    palette[old_palette_id].refcount -= 1;
		
		// Check if the voxel type is already in the palette,
		// and if so, use it!
		int replace = Array.FindIndex(palette
			, (entry) => entry.voxel_type_id == voxel_type_id
		);
		
		if (replace != -1) {
			// the type is already in the palette
			volume[index] = replace;
			palette[replace].refcount += 1; // use it!
			return;
		}
		
		/* --- snip A --- */
```

Since we know whether any given palette entry is used at all, we can also check if our 'old' entry has no remaining references, and reuse it instead:

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
		
		Array.Resize(palette, palette.Length * 2);
		// ^This (ab)uses zero-initialization of structs.
		
		var last = palette.Length - 1;
		palette[last] = new PaletteEntry() {voxel_type_id, refcount = 1};
		volume[index] = last;
		
		// There, all done now... right?
	}
```

Et voilà, we have implemented palettes! :D

Except we forgot to compress the indices; *oooops!*

{% info_notice() %}
**Note:** Compressing the indices isn't *strictly* necessary.  

If one can ensure the palette stays below 256 variants, using plain bytes as indices is viable,
and will still save memory, compared to using a volume of shorts as voxels.

It's also perfectly fine to stop right here and come back later,
as the compression of indices is a self-contained implementation detail.
{% end %}

{{ todo_notice(body="???") }}




## References

- [Wikipedia on Palettes in Computing](https://en.wikipedia.org/wiki/Palette_(computing))
- [Minecraft JE 1.13: The Flattening](https://minecraft.wiki/w/Java_Edition_1.13/Flattening)
- [Original Article](https://www.longor.net/articles/voxel-palette-compression-reddit)

---

[^squarecubelaw]: **The square cube law:** With every meter/unit that the viewing distance (a diameter `d`) is increased, the overall surface area will grow by a *square* factor (`d²`), while the volume will grow by a *cubic* (`d³`) factor!
