+++
title = "Data Structures"
description = "The many ways to structure and manage voxels in memory."
path = "wiki/datastructures"
[taxonomies]
categories = ["datastructures"]
tags = []
+++

Storing voxels in a plain array is perfectly fine for small scenes...
but as we increase the size (`ℕ`) of our scene, our volume gets exponentially larger (because its `ℕ³`); as such, we will inevitably run into various limits, like the size[^typicalram] and [bandwidth](https://en.wikipedia.org/wiki/Memory_bandwidth) of our RAM!

<!-- more -->

To avoid running out of memory (or bandwidth), we'll need to be able to *load* and *purge* parts of our volume from it. This is done by splitting our volume into [chunks](/wiki/chunks), and storing them in some data structure that allows for fast insertion/lookup/removal, without resizing/changing its backing storage.

---

## Example: Hashgrid

The easiest structure to use here is a *hashgrid*,
<small>backed by a *hashmap*</small>,
using the scaled positions of our chunks as keys:

```c#
// A world-space position divided by Chunk.SIZE:
struct ChunkPosition { int X; int Y; }

// A fixed-size/finite chunk of our world volume.
class Chunk {
	const int SIZE = 32;
	ChunkPosition Position;
}

// Our world-volume, holding the loaded chunks.
class World {
	Dictionary<ChunkPosition, Chunk> Chunks = [];
	/* ... */
}
```

Then, any time the *chunk* position of our camera/player changes,
we loop over all the potentially visible chunk *positions*:

- If the position is within our render distance, load the chunk.
- If the position is right outside our render distance, *keep it*.
- If the position is outside *plus one*, unload the chunk.

{{ todo_notice(body="Extend code example.") }}

---

## Example: [Sliding Window](/wiki/sliding-window)

{{ todo_notice(body="Sliding Window") }}

---

## Data Structure Listing

{{ todo_notice(body="Add datastructures; table? list?") }}
{{ todo_notice(body="Compare datastructures?") }}

---

{{ todo_notice(body="Coordinate-hashing vs -indexing?") }}
{{ todo_notice(body="Explain complexity trade-offs? Table/diagram?") }}
{{ todo_notice(body="Top- and bottom-level acceleration structures?") }}

## References

- [https://0fps.net/2012/01/14/an-analysis-of-minecraft-like-engines/](https://0fps.net/2012/01/14/an-analysis-of-minecraft-like-engines/)

---

[^typicalram]: Typical RAM sizes range from 4 to 32 gigabytes on desktop/tower computers (4 to 12 GB on smartphones); check the latest [Steam Hardware Survey](https://store.steampowered.com/hwsurvey) for up-to-date figures.
