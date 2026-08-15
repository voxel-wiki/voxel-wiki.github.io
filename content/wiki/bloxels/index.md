+++
title = "Bloxels"
description = "A guide for the implementation of Block-shaped Voxels."
draft = true
[taxonomies]
categories = ["bloxels"]
tags = ["bloxels"]
+++

{% info_notice() %}
This is a advanced guide that'll walk you through the **theory** and **implementation** of *Block-shaped Voxels* (bloxels), as widely popularized by Minecraft.
{% end %}

<!-- more -->

{% warn_notice() %}
We assume you have read the [Introduction to Voxels](/wiki/introduction) beforehand.
{% end %}

{% warn_notice() %}
This article was written with an unfortunate amount of anger and sarcasm. We do not apologize.
{% end %}

## Introduction

> Pssst, hey, wanna clone Minecraft? Well, here you go!

Really, creating your own Bloxel game *appears* easy on the surface,
it's *just cubes* after all, so what could *possibly* be so hard about this?!

This guide will show just *how much* complexity is hidden behind the blocks,
breaks it down into digestible pieces, so that you, too, can create what you want,
but on solid foundations.

Let's get started!

---

## Getting Started

Most guides & tutorials would start with setting up a window and rendering cubes;
we won't do that here as it has been done a thousand times over (that horse has been beaten into pulp!), thus well covered elsewhere.

---

Instead, let's talk about *the* first and single most common mistake(s) people make! ;D

### How NOT to (store) Bloxel

Due to the endemic of people learning {{ref(id="wikipedia-oop")}}, without ever learning about {{ref(id="wikipedia-data-driven-programming")}}, the complex limits and interplay of computation and caching, or even how computers *actually work* on the lowest levels (<small>ever heard of an ALU[^ALU]? or what a BUS[^BUS] is?</small>), a lot of people go-

> I know! Let's make `Bloxel` a <small>(boxed)</small> class and inherit from that!
>
> \**proceeds to create a bajillion `Bloxel` instances*\*

-which is an <span style="color:red;font-weight:bold">absolutely terrible</span> idea.

Creating large arrays of individually heap-allocated objects doesn't seem like a problem at first, computers are *really fast* after all...

{% info_notice(float=true) %}
This is *one* of the major reasons why Minecraft's performance has been getting worse over the years.

Thankfully, advances in GC technology and the ever evolving JVM, *do* make this less of a problem.
{% end %}

But as the voxel volume grows and more bloxels are added, we eventually begin pulling *too many things*, over *too big a range* of memory into our {{ref(id="wikipedia-cpu-cache")}}, invalidating it more and more, meaning we have to pull *even more* things from memory... which costs {{ref(id="latency",body="a lot of time")}}.  
<small style=";font-size:0.6em">And that's *without* taking Garbage Collection into account.</small>

Noticing that this is happening is pretty hard, until it's too late,
so better not do it in the first place; your CPU and RAM will thank you!

### How to properly store Bloxels

<!--
**Compression** is the **bread and butter of voxels**, and thus bloxels.

Without it our worlds would be smol, our memory full, our CPU cache trashing, frame-time climbing, fans screaming... <small>you get the idea.</small>

So how, and how much, can we compress our bloxels?
-->

Let us first establish some general assumptions:

- **Bloxels are Voxels:**  
  This means they very much *should* be stored in [chunks](/wiki/chunking), and *not* have an explicit position as part of their data.

- **Bloxels are mostly static:**  
  Unless one is building something, blowing things up, actively flooding a valley, or messing with some insane Redstone contraption, bloxels just don't *do* anything on their own.

- **Bloxels are mostly the same:**  
  Even if a scene looks very complex, chances are that if one picks *any* visible bloxel, there will many duplicates of that bloxel around, <small>ignoring variations due to rendering and lighting</small>.

- **Bloxels are mostly hidden:**  
  Given an average scene of earthly terrain, the vast *vast* majority[^mc-block-count] of bloxels will be hidden below the surface and behind other bloxels.

- **Bloxels tend to be 'piled up':**  
  Aside from some truly silly scenarios, bloxels are clumped/clustered together as terrain, flora, structures, etc.

Keeping ^these^ in mind is *very* important, else you'll spend a lot of time
thinking/planning for situations that *just don't happen*.
<small style=";font-size:0.6em">Disregarding players creating [tiny floating islands](https://minecraft.wiki/w/Tutorial:Skyblock) and [endless grids](https://modrinth.com/plugin/skygridx).</small>

That said, let's begin with...

#### The Global Palette

Whatever type of bloxel game you are building, you will almost certainly have a **Global Palette**: A collection of bloxel definitions/types that is used and referenced[^flyweight-pattern] *everywhere*.

```pseudocode
// Using classes and inheritance
// is perfectly fine here!
abstract class BloxelType:
	id: integer
	name: string
	// etc.

class AirBloxel extends BloxelType
class ThingBloxel extends BloxelType
class StuffBloxel extends BloxelType
// etc.

static GLOBAL_PALETTE: List<BloxelType> = [ ... ]
```

{% info_notice() %}
If you want to make the global palette data/config-driven, use a single `class BloxelType`, with fields and callbacks for *all* the attributes and behaviours your blocks can have, then create and define instances of `BloxelType` on start-up, by reading files from a directory/zip.
{% end %}

With our global palette at hand, we can now proceed to creating...

#### Chunks of Bloxels

A *chunk of bloxels* is nothing more than a fixed-size container,
for a small cubic volume of bloxels, sized somewhere between 8³ and 64³.

```pseudocode
/// A small fixed-size cubic volume,
/// representing a section of the world.
class BloxelChunk:
	const SIZE = 8 // any power-of-two >8 and <64
	const SLICE = SIZE * SIZE
	const VOLUME = SIZE * SIZE * SIZE
	
	/// SIZE-scale position of chunk in the world.
	position: (int,int,int)
	
	/// The backing storage of bloxels for this chunk.
	storage: BloxelStorage<VOLUME>
	
	/// Assert the coordinate-component is in bounds.
	limit(v:int): int
		=> match v:
			case v >= SIZE: throw OutOfBoundsError
			case v < 0: throw OutOfBoundsError
			case v: v
	
	/// Return index of bloxel in chunk by location.
	index(x:int, y:int, z:int): int
		=> limit(x)
		+ (limit(y) * SIZE)
		+ (limit(z) * SLICE)
	
	/// Return location of bloxel in chunk by index.
	locate(index:int): (x:int, y:int, z:int) {
		if index < 0: throw OutOfBoundsError
		if index >= VOLUME: throw OutOfBoundsError
		
		// (this can also be done via bit-twiddling!)
		let z = index % SIZE; index / SIZE;
		let y = index % SIZE; index / SIZE;
		let x = index % SIZE;
		(x, y, z)
	}
	
	/// Get a copy of the voxel at the given local position.
	get(x:int, y:int, z:int): BloxelState
		=> storage[index(x,y,z)]
	
	/// Replace the voxel at the given local position.
	set(x:int, y:int, z:int, state:BloxelState)
		=> storage[index(x,y,z)] = state
```

You may have noticed that the `storage` of voxels, is a [separate 'thing'](https://en.wikipedia.org/wiki/Separation_of_concerns) from the chunk itself. Recall how, from the [introduction](/wiki/introduction), that voxels don't have an explicit position?

Here, we make use of that fact to split how voxels are stored, from how they're accessed...

- Since only chunks need to know about coordinates,
  storage can use plain ol' integer indexing,
  both as interface/API and internally.

- With storage being abstracted behind an interface,
  it can be replaced with alternate implementations later and,
  if necessary, lets chunks swap between them at runtime.

- Voxel storage impls can be reused in other places,
  like for blueprints/schematics, which is neat!

{% info_notice(summary="**Zero-Cost Abstraction-ing-ish**") %}
If you're worried that splitting the storage is bad for performance, don't be!

Most languages will inline/embed the storage 'object' into the chunk anyway and, failing that, the reference pointing at the storage *is* stable/static, so memory prefetching should eliminate any access latency.
{% end %}


But, for now, to avoid involving too many concepts,
we will just directly store `BloxelState`'s in a plain ol' array,
to be replaced with a [palette compressed](/wiki/palette-compression) storage later...

```pseudocode
interface BlockStorage<const CAPACITY>:
	get(index: int): BlockState
	set(index: int, state: BlockState)

class ArrayBlockStorage implements BlockStorage:
	instances: [BlockState; CAPACITY]
	
	get(index: int)
		case index < 0 throw OutOfBoundsError
		case index >= CAPACITY throw OutOfBoundsError
		=> instances[index]
	
	set(index: int, state: BlockState)
		case index < 0 throw OutOfBoundsError
		case index >= CAPACITY throw OutOfBoundsError
		=> instances[index] = state
```

If you're wondering <q class=fancy>what the hecc is a `BloxelState`?!</q>, well...

## Bloxel States

Time for a quick thought experiment:
Let's define the properties of our terrains surface!
...or rather, all the grass covering it, to keep things trimmed.

So, what kind of properties could a patch of grass have...

- Moisture level?
- Temperature?
- Coverage?

If we assume that each of these properties has three possible values (or 'levels'),
we'd be looking at 27 states of grass, which *could* be stored in but a byte,
if we so desire.

For now, we'll instead write this down as a struct definition:

```pseudocode
@Derive(Equality)
struct GrassState:
	moisture:    AVERAGE | DRY | WET
	temperature: AVERAGE | FROZEN | HEATED
	coverage:    AVERAGE | BARE | DENSE
```

Now we've got a state definition! But... how do we use this?





---

{% todo_notice() %} Chunk Management (TLAS) {% end %}
{% todo_notice() %} Chunk Palettes {% end %}



---
## Implementation





---
## References

{% todo_notice() %} References {% end %}

---

[^ALU]: [*Arithmetic Logic Unit*](https://en.wikipedia.org/wiki/Arithmetic_logic_unit): The fundamental building block (<small>no pun intended</small>) of any integrated circuit capable of computation.

[^BUS]: [*BUS*](https://en.wikipedia.org/wiki/Bus_(computing)): The data highway that connects CPU, RAM, GPU and any/all hardware peripherals; see also [PCIe](https://en.wikipedia.org/wiki/PCI_Express) and [USB](https://en.wikipedia.org/wiki/USB).

[^mc-block-count]: With a default view-distance of 12 chunks, there are approximately **+20 million _solid_ blocks** surrounding the player in Minecraft.

[^flyweight-pattern]: {{ref(id="wikipedia-flyweight-pattern")}}: An enormously large collection of *simple things* is described by a *much* smaller set of *complex things*, reducing memory usage at the (utterly negligible) cost of a single indirection.
