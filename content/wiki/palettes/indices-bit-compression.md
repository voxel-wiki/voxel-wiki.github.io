+++
title = "Palette Storage: Indices Bit-Compression"
description = "Compressing voxels below one byte."
[taxonomies]
categories = ["datastructures", "compression"]
tags = ["datastructures", "compression", "optimization", "instancing", "flyweight"]
[extra]
chapters = true
chapter_prev = {text = "Palette Storage", link = "/wiki/palettes"}
chapter_next = false
#{text = "Tagged-Pointer Palette Entries", link = "/wiki/palettes/tagged-pointer-palette-entries"}
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
is *exactly equal* to the palette entry counts *ceiled base-2 logarithm*.

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

Assuming our app is intended for 64-bit systems,
we can use machine-word-sized (64-bit) unsigned integers as **cells**,
packing as many of our bit-indices per integer cell as we can.

Given the previous palette of 4 entries, our bit-size will be `2`,
letting us visualize the layout of cells as bit-patterns...

```bits
[ BYTE ][ BYTE ][ BYTE ][ BYTE ][ BYTE ][ BYTE ][ BYTE ][ BYTE ]
----------------------------------------------------------------
aabbccddeeffgghhiijjkkllmmnnooppqqrrssttuuvvwwxxyyzzaabbccddeeff
gghhiijjkkllmmnnooppqqrrssttuuvvwwxxyyzzaabbccddeeffgghhiijjkkll
mmnnooppqqrrssttuuvvwwxxyyzz...                    ...and so on!
```

Changing our chunk structure to use 64-bit integers
<small>(not using `usize` for clarity)</small> as cells,
and writing out the indices in the new scheme, we get this:

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
		// Using base-2 now, instead of base-16:
		// Each pair of bits is one index.
		0b10_01_00_00_10_01_00_00_10_01_11_00_10_01_00_00_10_01_00_00_10_01_00_00_10_01_00_00_10_01_00_00,
		0b10_01_11_00_10_01_00_00_10_01_00_00_10_01_00_00_10_01_00_00_01_00_00_00_01_00_00_00_01_00_00_00,
	])
};
```

Wereas before 4³ indices got stored across 64 bytes (512 bits),
now they're using just 16 bytes (128 bits), four times less,
with each index taking only a quarter of a byte,
the smallest possible bit-size to store them as.

Now removing the 'dirt' and 'flowers', replacing them with 'air' and 'grass',
once again cutting the palette in half, we get this layout per cell...

```bits
[ BYTE ][ BYTE ][ BYTE ][ BYTE ][ BYTE ][ BYTE ][ BYTE ][ BYTE ]
----------------------------------------------------------------
abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijkl
mnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwx
yzabcdefghijklmnopqrstuvwxyz...                    ...and so on!
```

...and also re-applying that to the code:

```rust
let my_pretend_chunk_2 = Chunk_BitPacked {
	palette: Box::new([
		/*0x0*/PaletteEntry{voxel_type_id: AIR,   refcount: 33},
		/*0x1*/PaletteEntry{voxel_type_id: GRASS, refcount: 31},
	]),
	indices: Box::new([
		// Using base-2 now, instead of base-16:
		// Each four-bit group is now an entire column of voxels,
		// all packed together into a single unsigned 64-bit integer.
		0b1100_1100_1110_1100_1100_1100_1100_1100_1110_1100_1100_1100_1100_1000_1000_1000
	])
};
```

We're using only 64 bits of memory, exactly one cell,
one pit per index, matching our 4³ volume. Perfect!

Finally, removing all the 'dirt' now, leaving only air...

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

...has us at **zero bits** per voxel, letting us entirely omit the storage, and heap-allocation, of our indices.

{% info_notice() %}
For a typical "earth-like" scene in a voxel game, unless there's floating islands,
all chunks above the general terrain and built structures will be like that.
{% end %}

Hopefully this makes sense so far, because...

### Bit-Sizes that aren't a Power-Of-Two

...what if the bit-size does **not** fit perfectly?

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
a number that 64 is, unfortunately, not cleanly divisible by.

So if we try to lay out the bits...

```bits
[ BYTE ][ BYTE ][ BYTE ][ BYTE ][ BYTE ][ BYTE ][ BYTE ][ BYTE ]
----------------------------------------------------------------
aaabbbcccdddeeefffggghhhiiijjjkkklllmmmnnnooopppqqqrrrssstttuuuv
#                                                              ▲
#                                         woops, it's cut off! ┛
```

...we clearly see the impossibility of perfectly filling a single 64-bit integer.
But that doesn't mean we can't try!

There's three options here to deal with this, by rising complexity:

#### **Option 1:** Don't bother, just round up.

The simplest method is to just not let it happen in the first place!
So we take whatever the bit-size is, round it up to the nearest power-of-two,
and use that instead.

Writing that out for all palette sizes up to 256, we get this:

| Palette Size | Bit Size |
|---:|:---|
| `1` | `0` |
| `2` | `1` |
| `3 .. 4` | `2` |
| `5 .. 16` | `4` |
| `17 .. 256` | `8` |
| `257 .. 65535` | `16` |

But what does that actually look like?

Given a palette size of 8, whose ideal bit-size is 3,
the table says we should use 4 instead, so that's what we use:

```bits
[ BYTE ][ BYTE ][ BYTE ][ BYTE ][ BYTE ][ BYTE ][ BYTE ][ BYTE ]
----------------------------------------------------------------
aaa0bbb0ccc0ddd0eee0fff0ggg0hhh0iii0jjj0kkk0lll0mmm0nnn0ooo0ppp0
qqq0rrr0sss0ttt0uuu0vvv0www0xxx0yyy0zzz0aaa0bbb0ccc0ddd0eee0fff0
ggg0hhh0iii0jjj0kkk0lll0mmm0nnn0ooo0ppp0qqq0rrr0sss0ttt0uuu0vvv0
# ...and so on
```

That doesn't look too bad; only fifteen wasted bits! Now let's try a bit-size of 5...

```bits
[ BYTE ][ BYTE ][ BYTE ][ BYTE ][ BYTE ][ BYTE ][ BYTE ][ BYTE ]
----------------------------------------------------------------
aaaaa000bbbbb000ccccc000ddddd000eeeee000fffff000ggggg000hhhhh000
iiiii000jjjjj000kkkkk000lllll000mmmmm000nnnnn000ooooo000ppppp000
# ...and so on
```

**Twenty-four** wasted bits per cell... that's not great.

So while this option sure makes things simple, it'll also waste *a lot* of bits.

*Next!*

#### **Option 2:** Aligned Per-Cell Storage

Using this method,
we treat the 64-bit integers that serve as the underlying indices storage as 'cells',
packing as many indices as can actually fit in each cell,
leaving only the remaining highest/most-significant bits zeroed.

Once again, writing that out for the palette sizes up to 256...

| Palette Size | Bit Size |
|:---:|:---|
| `1` | `0` |
| `2` | `1` |
| `3 .. 4` | `2` |
| `5 .. 8` | `3` |
| `9 .. 16` | `4` |
| `17 .. 32` | `5` |
| `33 .. 64` | `6` |
| `65 .. 128` | `7` |
| `129 .. 256` | `8` |

...and, of course, visualizing it for a bit-size of 3:

```bits
[ BYTE ][ BYTE ][ BYTE ][ BYTE ][ BYTE ][ BYTE ][ BYTE ][ BYTE ]
----------------------------------------------------------------
aaabbbcccdddeeefffggghhhiiijjjkkklllmmmnnnooopppqqqrrrssstttuuu0
vvvwwwxxxyyyzzzaaabbbcccdddeeefffggghhhiiijjjkkklllmmmnnnoooppp0
qqqrrrssstttuuuvvvwwwxxxyyyzzzaaabbbcccdddeeefffggghhhiiijjjkkk0
# ...and so on
```

Only a single wasted bit, hooray! What about a bit-size of 5?

```bits
[ BYTE ][ BYTE ][ BYTE ][ BYTE ][ BYTE ][ BYTE ][ BYTE ][ BYTE ]
----------------------------------------------------------------
aaaaabbbbbcccccdddddeeeeefffffggggghhhhhiiiiijjjjjkkkkklllll0000
mmmmmnnnnnooooopppppqqqqqrrrrrssssstttttuuuuuvvvvvwwwwwxxxxx0000
yyyyyzzzzzaaaaabbbbbcccccdddddeeeeefffffggggghhhhhiiiiijjjjj0000
# ...and so on
```

Five bits wasted... though compared to the first options twenty-four,
this is clearly better.

But is it the *best*?

#### **Option 3:** Unaligned Cross-Cell Storage

Here we pack the bits of the indices as tightly as possible,
without any gaps/padding in between, by doing a bunch of extra bit-twiddling.

Given a bit-size of 3, indices would then be packed like this:

```bits
[ BYTE ][ BYTE ][ BYTE ][ BYTE ][ BYTE ][ BYTE ][ BYTE ][ BYTE ]
----------------------------------------------------------------
aaabbbcccdddeeefffggghhhiiijjjkkklllmmmnnnooopppqqqrrrssstttuuuv
vvwwwxxxyyyzzzaaabbbcccdddeeefffggghhhiiijjjkkklllmmmnnnooopppqq
qrrrssstttuuuvvvwwwxxxyyyzzzaaabbbcccdddeeefffggghhhiiijjjkkklll
# ...and so on
```

Packing indices this way leaves not a single bit wasted,
making it the best method. *In theory.*

In practice, we've now got to touch *two* integers per read/write access,
for which determining the bit-offsets and -masks is... quite involved.

This ends up costing us a surprising amount of precious clock cycles,
making this very much *not* the best method.

Though using it for persistence and transmission will be just fine,
as there the bit-masks and -offsets are incrementally walked/visited during (de)serialization.

---

So...

For sake of simplicity (and this authors sanity),
the implementation section will be using the second option,
which turns out to be the optimal method, trade-offs wise, as it:
(A) wastes barely any bits,
(B) isn't much work to implement and
(C) has no performance penalty.

Let's begin!

---

## Implementation

First off, let's remind ourselves of what, exactly, we ended up with as data structures,
at the previous chapters implementation section...

```c#
class Chunk {
	public const int EDGE_SIZE = 32;
	public const int VOLUME_SIZE = EDGE_SIZE * EDGE_SIZE * EDGE_SIZE;
	
	PaletteEntry[] palette;
	byte[] indices; // <-- TARGET ACQUIRED!
}

struct PaletteEntry {
	ushort voxel_type_id;
	int refcount = 0;
}
```

{% todo_notice() %}
Writeup of implementation using [`./alignedcells.cs`](./alignedcells.cs).
{% end %}

---

## References

- [Bit-Twiddling](https://graphics.stanford.edu/~seander/bithacks.html)
- Rust implementations of variable-integer buffers:
  - [compactvec](https://crates.io/crates/compactvec) (rounds up to bytes)
  - [packedvec](https://crates.io/crates/packedvec) (unaligned)
  - [unthbuf](https://crates.io/crates/unthbuf) (aligned & unaligned)
  - [compvec](https://crates.io/crates/compvec) (multiple methods)
  - [compressed-intvec](https://crates.io/crates/compressed-intvec) (multiple methods)
- ...

{{ todo_notice(body="Add more references; guides, tutorials, videos, etc.") }}
{{ todo_notice(body="Add implementations in other languages, when found.") }}
