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

{% info_notice() %} This is the technique commonly known as **Palette Compression**. {% end %}

> The first (and most impactful) optimization to implement for palettes is the use of bit-buffers.
> 
> That is, by reducing the bit-size of the voxels to the minimum amount of bits needed (eg: the amount of unique indices, which equates to the amount of palette entries), the amount of memory needed to store large low-entropy voxel volumes is *massively* reduced.

{% todo_notice() %} explain {% end %}

{% todo_notice() %} "dimensionality does not matter" hint {% end %}

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











