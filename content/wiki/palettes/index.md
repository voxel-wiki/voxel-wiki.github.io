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

Eventually, as the project grows, you add more voxel types. And more. Even **MORE**. ***MOA-***

`Compile Error: Cannot fit 257 enum variants in a byte.`

`Runtime Error: Cannot cast to u8 due to overflow.`

*-r*-oh? Well, that's a bummer.

Fitting 257 unique states into 8 bits is, unfortunately, mathematically and physically impossible...
so we've got to change our voxel instances to occupy the next largest data-type,
which is... *checks notes*... a short.

Which is eight more bits, or *two* bytes.

That'd make all our voxels take up **twice** the memory as before... do we *really* have to do that?

**Of course *not!***

### Prior Art

With the release of [Minecraft 1.13](https://minecraft.wiki/w/Java_Edition_1.13) <small>("Update Aquatic")</small> in July&nbsp;2018,
Mojang changed how their voxel types are [handled and stored internally](https://minecraft.wiki/w/Java_Edition_Flattening),
implementing a form of [palette](https://en.wikipedia.org/wiki/Palette_(computing))-based [lossless compression](https://en.wikipedia.org/wiki/Lossless_compression),
inspired by the [GIF file format](https://en.wikipedia.org/wiki/GIF).

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

So, how do we use that to our advantage?

Well, since the *variants* in any given chunk are *unique* within that chunk,
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

But the important detail here is that we're *not* holding the *global* palette:
this one is *local* to the chunk, the voxels pointing into *it*,
with it's *own* "colors" in turn, referencing the global palette.

And this local palette holds *only the unique variants*, of the voxels *actually contained* in the chunk...
so any index pointing *into* that palette, only's gotta be *just* big enough to do that and *no larger*.

How big, exactly?

{% figure(class="m-2", id="palette-size-equation", caption="Relation between a palettes size and the bit-size of any index/indices pointing into it.") %}
<center class="m-2"><code>index<sub>bits</sub> = ceil( log2 ( palette<sub>size</sub> ) )</code></center>
{% end %}

This formula may not mean much to you, so let's look at a table that solves it for some palette sizes:

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

Well, would you look at that: Our indices don't need many bits at all... or *any* at all, if the palette contains exactly *one* variant!

Let me be *much* louder and direct about this:

<span style="font-size:1.75em">By using *chunk-local* palettes, our voxels need *mere **bits*** to be stored.</span>

Since voxels, by their very nature, exist in *stupidly large*[^squarecubelaw] amounts,
this results in a pretty ludicrous reduction in memory consumption,
often *halving* or even *quartering* RAM usage.

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

And that's it.

Finally, at long last: **palette compressed** voxel storage.











---

## Implementation

Now then, time to actually implement it!

### Palettization

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
		int replace = Array.FindIndex(palette, (entry) => entry.voxel_type_id == voxel_type_id);
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
		int replace = Array.FindIndex(palette, (entry) => entry.voxel_type_id == voxel_type_id);
		if (replace != -1) {
			// the type is already in the palette
			volume[index] = replace;
			palette[replace].refcount += 1; // use it!
			return;
		}
		
		/* --- snip --- */
```

Since we know whether any given palette entry is used at all, we can also check if our 'old' entry has no remaining references, and reuse it instead:

```c#
		/* --- snip --- */
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
		
		/* --- snip --- */
```

And finally, we fix up the part where we grow the palette...

```c#
		/* --- snip --- */
		
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
**Note:** Compressing the indices isn't *strictly* necessary, actually.  
It's perfectly fine to only use the uniqueness properties of palette-based storage,
for implementing 'struct-like' variants of voxels;
more on that in the follow-up article.
{% end %}

### Compression

{% todo_notice() %} continue here {% end %}


```c#
class VarIntArray {
	enum Varlen {
		ZERO = 0, // A palette of 1.
		ONE  = 1, // A palette of 2.
		TWO  = 2, // A palette of 4.
		FOUR = 4, // A palette of 16.
		EIGHT = 8, // A palette of 256.
		SIXTEEN = 16 // A palette of 65536.
	} // TODO: Ext-class for enum (mask/shift/etc)
	
	readonly int capacity; // How many 'indices' the array holds.
	Varlen  length; // The current length of each/all indices.
	uint[]? data;   // The compressed indices: capacity*length/32
	
	// TODO: Setter
	// TODO: Getter
	// TODO: Resize
	// TODO: ForEach
	// TODO: SetAll
}
```


```pseudocode
// A fixed-size flat/linear storage
// for deduplicated bloxel states.
class BloxelStorage<const CAPACITY>:
	struct BloxelEntry:
		refcount: int
		instance: BloxelState
	
	palette: Array<BloxelEntry> = [
		BloxelEntry {refcount=CAPACITY, instance=AIR}
	]
	
	logsize: VarIntSize = log2(palette.length)
	
	indices: VarIntBuffer<CAPACITY> = new(logsize)
	
```

```pseudocode
enum VarIntSize:
	ZERO = 0 // A palette of 1.
	ONE  = 1 // A palette of 2.
	TWO  = 2 // A palette of 4.
	FOUR = 4 // A palette of 16.
	EIGHT = 8  // A palette of 256.
	SIXTEEN = 16 // A palette of 65536.

class VarIntBuffer<CAPACITY>:
	final vsize: VarIntSize = ZERO
	cells: Array<u64> = [_; CAPACITY * vsize / 64]

```

























## References

- [Wikipedia on Palettes in Computing](https://en.wikipedia.org/wiki/Palette_(computing))
- [Minecraft JE 1.13: The Flattening](https://minecraft.wiki/w/Java_Edition_1.13/Flattening)
- [Original Article](https://www.longor.net/articles/voxel-palette-compression-reddit)

---

[^squarecubelaw]: **the square cube law:** With every meter/unit that the viewing distance (a diameter `d`) is increased, the overall surface *area* will grow by a *square* factor (`d²`), while the *volume* will grow by a *cubic* (`d³`) factor!
