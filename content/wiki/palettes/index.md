+++
title = "Palette Storage & Compression"
description = "Storing and compressing voxels via painting by numbers."
draft = true
[taxonomies]
categories = ["datastructures", "compression"]
tags = ["datastructures", "compression", "optimization", "instancing", "flyweight"]
+++

When dealing with voxels as discrete values (i.e.: bloxels) one will usually have a single **global palette**, indexed via integer, that defines all possible 'materials' that may occur...

<!-- more -->

{% figure(class="float clear-header", caption="**A Color Palette**", author="[Vincent Le Moign](https://twitter.com/webalys)", license="CC-BY-4.0") %}/wiki/palette-compression/600-artist-palette.svg{% end %}

...as such, a global palette is often declared as a static/constant `enum`, like this:

```rust
#[repr(u8)] // store as, and allow cast to, u8
pub enum VoxelType {
	Air = 0, // start at zero!
	Stone,
	Dirt,
	Grass
}
```

All voxel instances are then integers (commonly single bytes) that index into the global palette; all is good... but for how long?

## Motivation

Eventually, as the project grows, you add more materials. And more. Even **MORE**. ***MOA-***

`Compile Error: Cannot fit 257 enum variants in a byte.`

*-r*... ooooops.

Fitting 257 states in 8 bits is, unfortunately, mathematically impossible... so we've got to change our voxel instances to occupy the next largest data-type, which is... *checks notes*... a short.

Which is *two* bytes.

That'd make our voxels take up **twice** the memory as before... do we *really* have to do that?

*Of course not!*  Introducing: **Palette Storage!**

## Explanation

{% info_notice() %}
If you aren't already, use some form of [chunking](/wiki/chunking) to manage your voxel volume; this technique directly requires and expands upon it.
{% end %}

Let's assume, for arguments sake, that your chunks contain `8³` voxels; how many possible voxel variations (number of unique voxel types) can exist in such a chunk?

If you went and raised `8` to the power of `3`, and got `512`, you have a working calculator! So:

> A chunk can *always* only contain as many voxel variations as it's total volume size, **never more**. This is the *maximum entropy*[^entropy] of a chunk.

Obviously this poses a question: What is the *minimum* entropy of a chunk?

Well, if *all* the voxels are exactly the same, we have... one variant. So...

> The minimum entropy of a chunk, *regardless* of it's size, is **one**.

Just to drive the point home, what is a chunks entropy if it, say... only consists of `Air` and `Dirt`?

If you guessed **two**, you'd be right again!

> The *entropy* of a chunk is the *amount* of voxel variants contained in that chunk.

With all that said... why are we talking about this? What does entropy have to do with palettes? Good question! The answer is surprisingly simple:

> The amount of entropy in a chunk is the <small>(minimum)</small> **size** for that chunks **local palette**.

So, if you have a chunk with two voxel variants, like `Air` and `Dirt`, the chunks entropy is `2`, and as such the local palette has a size of `2`.

What does the local palette contain? Well `Air` and `Dirt` of course!

{% info_notice() %}
**Analogy: Painting by Numbers**

A good way to think of this, is to imagine the chunk as [paint by numbers](https://en.wikipedia.org/wiki/Paint_by_number) picture, where the parts are marked up with numbers, with a palette of numbered colors by the side.

To then 'paint' the chunk, all we have to do is take it's local palette and fill in the numbered parts with their correspondingly numbered colors!
{% end %}

Now then, I'd say it's time to implement palette storage, ain't it?

## Implementation

{% todo_notice() %} continue here {% end %}





## Palette Indices Bit Compression

{% info_notice() %} This is the technique commonly known as **Palette Compression**. {% end %}

> The first (and most impactful) optimization to implement for palettes is the use of bit-buffers.
> 
> That is, by reducing the bit-size of the voxels to the minimum amount of bits needed (eg: the amount of unique indices, which equates to the amount of palette entries), the amount of memory needed to store large low-entropy voxel volumes is *massively* reduced.

{% todo_notice() %} explain {% end %}

{% todo_notice() %} "dimensionality does not matter" hint {% end %}

### Implementation (PIBC)

{% todo_notice() %} implement {% end %}




## Single-Variant Volume Omission

> When you think about it, a palette with only a single entry, doesn't need to have a voxel volume allocated for it... which leads to a rather simple optimization, for when there are a lot of chunks filled with, say, only air!

{% todo_notice() %} explain {% end %}

### Implementation (SVVO)

{% todo_notice() %} implement {% end %}




## Tagged-Pointer Palette Entries

> Here's a question: How many bits does a single type of voxel (eg: a palette entry) take?
> 
> With palettes, it doesn't really matter! Since every palette entry represents all instances of a type in the associated voxel volume, it's perfectly fine to put them on the heap as their own objects... but, what if you wanted to *not* incur the cost of a heap allocation and the pointer-access?
> 
> The solution is to use [tagged pointers](https://en.wikipedia.org/wiki/Tagged_pointer)! A single bit can be used to indicate if a palette entries information is either **A)** stored on the heap as object or **B)** stored right in the pointer.
> 
> Given a 32-bit architecture which aligns allocations on 32-bit/4-byte boundaries (basically *all* 32-bit CPU's!), the two lowest bits in a pointer will always be zero (on 64-bit arch's it'll be the last three bits), meaning we can store whatever we want in these bits, as long as we mask them out when actually using the pointer as a pointer!
> 
> This gives you at minimum ***31 bits*** to encode a voxel type in (*63* bits on a 64-bit CPU!), which should be *way* more than enough for terrain (which tends to make up the majority of a voxel world by sheer volume), thus eliminating a *ton* of allocations and pointers!

{% todo_notice() %} explain {% end %}

### Implementation (TPPE)

{% todo_notice() %} implement {% end %}

## References

- [Wikipedia on Palettes in Computing](https://en.wikipedia.org/wiki/Palette_(computing))
- [Minecraft JE 1.13: The Flattening](https://minecraft.wiki/w/Java_Edition_1.13/Flattening)
- [Original Article](https://www.longor.net/articles/voxel-palette-compression-reddit)

---

[^entropy]: **entropy:** A measure of the disorder or randomness in a closed system.
