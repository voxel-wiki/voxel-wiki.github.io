+++
title = "Persistence"
description = "Serializing voxels to disk, to keep them safe and sound."
#path = "/"
aliases = ["/serialization"]
[taxonomies]
categories = ["persistence"]
tags = ["serialization", "persistence", "storage"]
+++

**Persistence** is the result of **serializing**-and-writing data to a **storage device**,
such as a Hard-Disk-Drive (HDD) or Solid-State-Drive (SSD),
and being able to later load-and-**deserialize** it from there.

<!-- more -->

## Motivation

The purpose of persistence is, mainly, to allow closing/exiting an application,
without losing the applications state (and thus a users data/progress),
but also to keep it safe across crashes, power-failures, unexpected restarts, etc. etc.

Or, as **Murphy's Law** ever-so joyfully states...

> Anything that can go wrong, will go wrong.

...so we'll have to, somehow, **persist** our voxel volumes, no matter what,
in a way that let's us load and restore/hydrate data back into a usable state.

## Versioning

First off: **Versioning** data is a ***must***, since not doing so will inevitably lead
to backwards- & forwards-compatibility issues which, without versioning information,
are supremely annoying to fix.

As luck would have it, the simplest way to version data is to attach a **version number**,
that is incremented with every set of changes to the data structure, layout, format, etc. etc. ...

For example, when serializing camera/player-data as, say, a bunch of JSON,
versioning is pretty straightforward:

```json
{
	// JSON files should indicate their schema,
	// so we can define a custom URI scheme,
	// which just happens to also include a version number.
	// ;)
	"schema": "my_app://playerdata/v1",
	
	// Also, keep the actual data in a sub-object!
	// DO NOT MIX VERSIONING INFO WITH ITS DATA.
	"playerdata": {
		"position": [0, 0, 0],
		"rotation": [0, 0],
		"inventory": [/*...*/],
		// etc. etc.
	}
}
```

If this feels like a waste of time to you, or somehow seems too complicated:
it very much isn't, don't be an idiot, *just do it*.
Your future self will thank you.

## Orthogonality

{% info_notice() %}This section is optional reading and can be skipped.{% end %}

Depending on the complexity of data(-structures) at runtime,
it may be possible to make persistence "transparent" or **orthogonal**,
by either making data be (almost) exactly the same, down to the bytes,
both at runtime and in offline storage,
or by building all application state out of basic "atoms",

[Blender](https://www.blender.org/) is an application that mainly does the former:
It directly writes most runtime state-and-data to disk as a `.blend` file,
without any transformation or translation, using minimal framing,
versioning and reflection data [^blenddna], making saving hella fast.

Loading such a file is, however, anything but simple;
there is quite a lot of type-reflection and -migration machinery built into blender,
all deeply tied into the software.

So, while complete orthogonality sounds great on paper / as a concept,
it'll also fully expose your applications internal layouts of data,
for all data that must be persisted...

...meaning deserialization requires an unfortunate amount of low-level shenanigans, deep type/layout introspection,
manual restoration of pointers/references and shuffling data around.

{{ todo_notice(body="Missing a paragraph here...?") }}

The latter orthogonality method, building an application out of primitive atoms,
is used surprisingly often in web-applications: Parse some JSON from a web-server,
work directly on the parsed data, then write and send it back as, again, JSON.
Though the data may still be transformed for storage on the server-side,
the client (web-app) stays orthogonal.

## Depth

When persisting data there's a question which,
while it sounds simple, is surprisingly hard to answer:

> **What**, exactly, do you persist?

For our voxel volumes, the answer is *obviously* that we want to store our voxels,
so we grab the array of bytes our volume is stored as, write it to disk and load it back in.
So far, so good!

Now let's add some new materials, add a new sub-state there, maybe remove som-
...oh, hey, when did all our tree leaves become crafting tables?

At first glance, this issue can be prevented by versioning our data;
after all, we just gotta increment the version, and write *new* data with the *new* version!

Oh, but what's supposed to happen to *old* data stored using the *old* version?
How do we restore it? How do we *know __what__ it was*?

Let's restate the previously simple question, but more nuanced:

> How many layers of structures and abstraction must be dissolved, both in code and across time,
> into bits'n'bytes that can be persisted, and later restored, into a usable state?

For voxel volumes, the answer depends on the kind of voxel we're working with:
[continuous or discrete](/wiki/introduction#continuous-or-discrete).

### Continuous Voxels

**Continuous** voxel volumes are the simple case;
since their voxel samples are not "unique"[^continuity],
storing *what* they are can be done at the [chunk](/wiki/chunking) level.
Assuming such chunks are made of several layers/channels of continuous voxels,
it might look something like this:

```pseudocode
#[repr(C, packed)]
struct Chunk {
	position: ChunkPos AS Vec3i,
	channels: Array<ChunkChannel>,
}

#[repr(C, packed)]
struct ChunkChannel {
	channel_id: VoxelChannel AS String,
	sample_type: VoxelFormat AS String,
	sample_data: Array<*sampletype>
}
```

{{ todo_notice(body="Create and use a diagram instead, here?") }}

Now, you might wanna ask <q>why use strings???</q>, which would be the wrong question!
No, what's more important is <q>why *not* strings?</q>. Is it...

* **Memory?** Nope: Voxel volume data is *way* larger.
* **Parsing?** Nah, not needed, just compare the bytes.
* **Bandwidth?** Chunks should be compressed anyway!

...and so on. Using strings to store ID metadata, on the level of chunks,
has such a tiny cost that it simply *doesn't matter*, relative to everything else.

### Discrete Voxels

**Discrete** voxel volumes are slightly more complicated, since their voxels/samples are unique
and must be processed individually, possibly having no common properties, at all, between any two neighbouring samples.

{{ todo_notice(body="Explain depth of discrete voxel persistence.") }}

---

## Indexing & Sparsity

In the simplest case, of a small non-sparse voxel volume
(<small style="white-space:nowrap">of size `N³` where `N` up to ~`2^16`</small>),
the whole thing could be written-to and read-from a single compressed file,
thus not require any indexing at all...

And if RAM were infinite, that'd be perfectly fine! But it isn't,
even with page swapping (<small>which tends to *annihilate* performance</small>).

To allow the volumes chunks being loaded and stored "on the fly", we've got to make it **sparse**,
which precludes decompressing the entire file at once, so compression must happen *per chunk* instead[^mustcompress].

Of course, that also means we no longer know where, exactly, chunks are located in the file,
since their blobs can have vastly different sizes (<small>from a few dozen bytes, to multiple kilobytes</small>).

Accessing the file as if it were a plain linear array, won't work anymore... so we've got to ask:

> How is the chunked voxel volume **indexed**?

##### Index Chunks by Filenames

Having a world split into chunks, or larger chunks-of-chunks (regions),
presents us with a rather simple indexing method: filenames.

By defining a fixed pattern that can convert chunk locations into filenames and back,
like `±X_±Y_±Z.chunk`, chunks can just be persisted as files in some directory.

A directory layout for a "world" using that method, may then look something like this:

```
<world>/
├── world-info.json
├── player-data.json
┆
└── chunks/
    ├── 0_0_0.chunk
    ├── 1_0_0.chunk
    ├── 0_1_0.chunk
    ├── 1_1_0.chunk
    ┆
```

Loading chunks is then a matter of trying to read their respective files,
as named after the position:

```cs
class World {
	...
	DirectoryInfo ChunksDir = /* "/<WORLD>/chunks/" */;
	...
	
	private Chunk? TryLoadChunk(ChunkPosition chunk_pos) {
		string chunk_pos_str // position to string
			= $"{chunk_pos.x}_{chunk_pos.y}_{chunk_pos.z}.chunk";
		
		string chunk_path // string to path
			= Path.Combine(ChunksDir.FullName, chunk_pos_str);
		
		// Reading may fail for *many* reasons,
		// we've got to use a try-block here:
		try {
			byte[] chunk_bytes = File.ReadAllBytes(chunk_path);
			return Chunk.DeserializeFromBytes(chunk_bytes);
		} catch {
			// Couldn't read the chunk for whatever reason...
			// Generate it?
			return null;
		}
	}
	
	...
}
```

And for a while, that works mostly fine.

Unfortunately, especially on operating systems of the Windows family,
this method performs *really* badly as more files are created (starting, roughly, at a few thousand),
while consuming a surprising amount of disk-space due to how filesystems work[^fsindexing].

To get around this issue, we're forced to group chunks into larger chunks-of-chunks (regions),
then storing and indexing *these* instead, leading us to...

##### Index Regions by Filenames

<!--
This issue can be worked around, by storing larger "regions" of blobs in archive-like files,
keeping a sub-index of which blobs are where, all in the same (region)file.
-->

{{ stub_notice(kind="section") }}

##### Use An Existing Solution
Instead of doing all the work yourself, why not make use of **Free Open Source Software**?

{{ stub_notice(kind="section") }}

## Databases
Wouldn't it be nice if someone already figured out all the nitty-gritty details,
of correctly and safely writing and reading indexed data,
and made it work across effectively every platform known to man?

...

Oh look, it's [databases](https://en.wikipedia.org/wiki/Database)!

Or, more specifically: *embedded* databases.

{{ todo_notice(body="Explain why databases.") }}

##### SQLite
> [SQLite](https://www.sqlite.org/)... ***the*** most commonly used embeddable database software in the world,
> bar none, by several magnitudes.

{{ stub_notice(kind="section") }}

##### Key/Value Stores
{{ stub_notice(kind="section") }}

---

## References

- [Wikipedia: File System](https://en.wikipedia.org/wiki/File_system)
- [Seed Of Andromeda: Creating A Region File System](https://web.archive.org/web/20150910104522/https://www.seedofandromeda.com/blogs/1-creating-a-region-file-system-for-a-voxel-game)
- [Minecraft Wiki: Anvil File Format](https://minecraft.wiki/w/Anvil_file_format)
- [Minecraft Wiki: Region File Format](https://minecraft.wiki/w/Region_file_format)
- ...

---

[^blenddna]: A `.blend` files DNA chunk contains reflection information,
  of all in-memory types/structures defined and used by the version of blender that wrote the file;
  it's what allows these files to stay compatible across many versions,
  even with changes to the layout/structure of data.
  See the [blender manual](https://developer.blender.org/docs/features/core/dna/),
  ["mystery of the blend"](https://fossies.org/linux/blender/doc/blender_file_format/mystery_of_the_blend.html)
  and <https://www.atmind.nl/blender/blender-sdna-256.html> for more info.

[^continuity]: That is, they have some kind of [partial](https://en.wikipedia.org/wiki/Partially_ordered_set)
  or [total](https://en.wikipedia.org/wiki/Total_order) order
  and can be [up/down-sampled](https://en.wikipedia.org/wiki/Sample-rate_conversion),
  without having to be transformed/converted. Sample types like colors and normal-vectors, among many others, belong to this group.

[^mustcompress]: The largest performance bottleneck of modern SSDs, CPUs and GPUs
  is **memory-capacity** and **-bandwidth**, both of which can only be meaningfully reduced by compressing data;
  so forgoing or forgetting to compress volumetric data, is a *really bad idea*.

[^fsindexing]: Filesystems also have to keep an index around,
  to know which files exist in a given directory.
  As more files are added to a given directory,
  reading and modifying that index will slow down more and more.
  Add a systems antivirus live protection to that mix, and it get's oh-so-much worse.
