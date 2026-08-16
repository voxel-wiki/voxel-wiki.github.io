+++
title = "Persistence"
description = "Serializing voxels to disk, to keep them safe and sound."
#path = "/"
aliases = ["/serialization"]
draft = true
[taxonomies]
#categories = []
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
since their voxel samples are not "unique",
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

When it comes to **discrete** voxel volumes...
{{ todo_notice(body="Continue here...") }}

---

## ???

<!--
## Indexing And Blobs

No matter the method of persistence you end up choosing,
there will always be some kind of **index**,
that resolves a given 2D/3D position into a reference to some **blob**,
which then contains the serialized volume at that position.

##### Filenames as Index

**For example**, one could use the local filesystem itself as index,
with blobs stored as individual files, named after their position,
like `chunks/x10y20z30.blob`...
unfortunately, this performs *really* badly as more blobs are created,
and tends to waste an obscene amount of disk-space on top of that.

This issue can be worked around, by storing larger "regions" of blobs in archive-like files,
keeping a sub-index of which blobs are where, all in the same (region)file.
-->

{{ stub_notice(kind="section") }}

## References

{% todo_notice() %} References {% end %}

---

[^blenddna]: A `.blend` files DNA chunk contains reflection information, of all in-memory types/structures defined and used by the version of blender that wrote the file; it's what allows these files to stay compatible across many versions, even with changes to the layout/structure of data.
  See the [blender manual](https://developer.blender.org/docs/features/core/dna/), <https://fossies.org/linux/blender/doc/blender_file_format/mystery_of_the_blend.html> and <https://www.atmind.nl/blender/blender-sdna-256.html> for more info.
