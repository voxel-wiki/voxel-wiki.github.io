+++
title = "Palette Storage: Indices Bit-Compression"
description = "Compressing voxels below one byte."
draft = true
[taxonomies]
categories = ["datastructures", "compression"]
tags = ["datastructures", "compression", "optimization", "instancing", "flyweight"]
[extra]
chapters = true
chapter_prev = {text = "Palette Storage", link = "/wiki/palettes"}
chapter_next = {text = "Single-Variant Volume Omission", link = "/wiki/palettes/single-variant-volume-omission"}
+++

With the storage of our voxel volume chunks neatly palettized,
via separation of the voxel-samples unique identities from their local usage,
split into a palette and indices... we can now proceed to *almost perfectly* compress the latter,
by replacing the indices storage with a variable-length-integer buffer.

<!-- more -->

{% info_notice() %} This is the technique commonly known as **Palette Compression**. {% end %}

## Theory

As explained in the [previous chapter](/wiki/palettes##theory),
the *maximum* bit-size of any given chunks indices,
is *exactly equal* the palette entry counts *ceiled base-2 logarithm*.

{% figure(class="m-2", id="palette-size-equation", caption="Relation between a palettes size and the bit-size of any index/indices pointing into it.") %}
<center class="m-2"><code>index<sub>bits</sub> = ceil( log2 ( palette<sub>size</sub> ) )</code></center>
{% end %}

By reducing the bit-size of the individual indices to the minimum amount of bits needed,
while still correctly pointing at their respective palette entries,
the overall memory usage of voxel volumes is *massively* reduced,
possibly by up to <span style="white-space:nowrap">***~90% or more***</span>.

But how exactly does that work?

Let's pretend we've got a `4³`-sized chunk with `4` palette entries,
and dump all of that as plain literals / constant data...

```rust
struct Chunk {
	palette: Box<[PaletteEntry]>,
	indices: Box<[u8; 4*4*4]>,
};

let my_pretend_chunk = Chunk {
	palette: Box::new([
		// Our 4 entries are sorted by refcount here,
		// but thats **not** a requirement!
		/*0x0*/PaletteEntry{voxel_type_id: AIR,    refcount: 33},
		/*0x1*/PaletteEntry{voxel_type_id: GRASS,  refcount: 16},
		/*0x2*/PaletteEntry{voxel_type_id: DIRT,   refcount: 13},
		/*0x3*/PaletteEntry{voxel_type_id: FLOWER, refcount: 2},
	]),
	indices: Box::new([
		// Chunk is 4³, so there are 64 indices here.
		// Indices are laid out one column of voxels per line,
		// with the first number being at the bottom.
		0x02, 0x01, 0x00, 0x00,
		0x02, 0x01, 0x00, 0x00,
		0x02, 0x01, 0x03, 0x00,
		0x02, 0x01, 0x00, 0x00,
		0x02, 0x01, 0x00, 0x00,
		0x02, 0x01, 0x00, 0x00,
		0x02, 0x01, 0x00, 0x00,
		0x02, 0x01, 0x00, 0x00,
		0x02, 0x01, 0x03, 0x00,
		0x02, 0x01, 0x00, 0x00,
		0x02, 0x01, 0x00, 0x00,
		0x02, 0x01, 0x00, 0x00,
		0x02, 0x01, 0x00, 0x00,
		0x01, 0x00, 0x00, 0x00,
		0x01, 0x00, 0x00, 0x00,
		0x01, 0x00, 0x00, 0x00,
	])
};
```

Take a close look at the indices: While they're using a single byte each,
their actual data only takes *half* a byte (a 'nibble'), with the upper/MSB half being zero.

As long as we don't change a voxel-sample into a type not covered by any palette entry,
thus adding a new entry to the palette (which'd also require growing it),
this chunks palette will keep having four entries: our indices here don't *need* that upper half.

So... how do we get rid of it?

With **bit-packing!**

Assuming that our app only runs on 64-bit systems,
an unsigned 64-bit integer is the ideal type to pack bits into,
so just... try to bit-pack our indices?

```rust
struct Chunk_BitPacked {
	palette: Box<[PaletteEntry]>,
	indices: Box<[u64]>,
	// ^now using u64, and no longer fixed-size!
};

let my_pretend_chunk = Chunk_BitPacked {
	palette: Box::new([
		// Our 4 entries are sorted by refcount here,
		// but thats **not** a requirement!
		/*0x0*/PaletteEntry{voxel_type_id: AIR,    refcount: 33},
		/*0x1*/PaletteEntry{voxel_type_id: GRASS,  refcount: 16},
		/*0x2*/PaletteEntry{voxel_type_id: DIRT,   refcount: 13},
		/*0x3*/PaletteEntry{voxel_type_id: FLOWER, refcount: 2},
	]),
	indices: Box::new([
		// OMG SO TINY!1!!
		0x2100210021302100,
		0x2100210021002100,
		0x2130210021002100,
		0x2100100010001000,
	])
};
```

Were as before we had 4³ indices stored across 128 nibbles, now they're using 64,
with each index being a nibble which is the smallest possible bit-size to store them as.

Now check out what happens if we remove the 'dirt' and 'flowers',
replacing them with 'air' and 'grass', cutting the palette in half:

```rust
let my_pretend_chunk_2 = Chunk_BitPacked {
	palette: Box::new([
		/*0x0*/PaletteEntry{voxel_type_id: AIR,   refcount: 33},
		/*0x1*/PaletteEntry{voxel_type_id: GRASS, refcount: 31},
	]),
	indices: Box::new([
		// Using base-2 now, instead of base-16:
		// Each four-bit group is now one column of voxels,
		// all packed together into a single unsigned 64-bit integer.
		0b1100_1100_1110_1100_1100_1100_1100_1100_1110_1100_1100_1100_1100_1000_1000_1000
	])
};
```

Now we're using only 16 nibbles of memory!

Finally, if we went and removed all the 'dirt' now, leaving only air...

```rust
let my_pretend_chunk_3 = Chunk_BitPacked {
	palette: Box::new([
		/*0x0*/PaletteEntry{voxel_type_id: AIR, refcount: 64},
	]),
	indices: Box::new([
		// :)
	])
};
```

...has us at **zero bits** per voxel, letting us omit the storage, and heap-allocation, of indices entirely.

{% info_notice() %}
For a typical scene in a voxel game, unless there's floating islands,
all chunks above the general terrain and built structures will be like that.
{% end %}

Hopefully this makes sense so far, because... what if the bit-size doesn't fit perfectly?

```rust
let my_pretend_chunk_4 = Chunk_BitPacked {
	palette: Box::new([
		/*0x0*/PaletteEntry{voxel_type_id: AIR,    refcount: ...},
		/*0x1*/PaletteEntry{voxel_type_id: GRASS,  refcount: ...},
		/*0x2*/PaletteEntry{voxel_type_id: DIRT,   refcount: ...},
		/*0x3*/PaletteEntry{voxel_type_id: FLOWER, refcount: ...},
		/*0x4*/PaletteEntry{voxel_type_id: ......, refcount: ...},
		/*0x5*/PaletteEntry{voxel_type_id: ......, refcount: ...},
		/*0x6*/PaletteEntry{voxel_type_id: ......, refcount: ...},
		/*0x7*/PaletteEntry{voxel_type_id: ......, refcount: ...},
		// 8 entries... a bit-size of 3 ???
	]),
	indices: Box::new([
		// uuuuuuuuuh...???
	])
};
```

Given a palette with 8 entries, we'd get a bit-size of 3,
meaning the indices just don't perfectly fit-and-fill a single 64-bit integer.

Here there are three options to deal with this, in order of complexity:

1. **Don't:** Round bit-size up to the nearest power of two.
2. **Aligned:** Waste a bit or two in every 64-bit integer.
3. **Unaligned:** Pack indices as tightly as possible, complexity be damned.

For sake of simplicity (and my sanity),
the implementation section will be using the first option,
but we'll still go over them.




---

{% todo_notice() %} "dimensionality does not matter" hint {% end %}

---

### Implementation

{% todo_notice() %} implement {% end %}

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
	
	readonly int capacity; // How many elements this array holds.
	Varlen  length; // The current bit-length of the elements.
	uint[]? data;   // The compressed elements: capacity*length/32
	
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











