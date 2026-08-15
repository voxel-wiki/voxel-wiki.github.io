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

...so we'll have to *somehow* persist our voxel volumes, no matter what,
in a way that let's us restore/hydrate the data into a usable state.

## Versioning

First off: **Versioning** data is a **must**, as not doing will inevitably lead
to backwards- & forwards-compatibility issues, which are supremely annoying to fix.

As luck would have it, the simplest way to version data is to attach a version number,
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

If this seems like a waste of time to you,
or somehow find this too complicated:
it very much isn't, don't be an idiot, *just do it*.
Your future self will thank you.

## Orthogonality

{% info_notice() %}This section is optional reading and can be skipped.{% end %}

Depending on the complexity of data(-structures) at runtime,
it may be possible to make persistence "transparent" or **orthogonal**,
by either making data be (almost) exactly the same, down to the bytes,
both at runtime and in offline storage,
or by building all application state out of basic "atoms",

[Blender](https://www.blender.org/) is an application that does the former:
It directly dumps most of in-memory state to disk as a `.blend` file,
with minimal framing, versioning and a special 'DNA' blob,
which can then later be rapidly restored into memory.

Unfortunately, while this sounds great on paper / as a concept,
it also *permanently* freezes layouts/structures/internals, on the lowest levels,
of any data that must be persisted...

...meaning there *still* needs to be a deserialization step,
possibly requiring quite a lot of low-level shenanigans and deep type/layout introspection,
mostly around restoring pointers/references and shuffling data to-and-fro.

{{ todo_notice(body="Something's missing here...?") }}

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

Oh, but what's supposed to happen with *old* data stored using the *old* version?
How do we restore it? How do we *know __what__ it was*?

Let's restate the previously simple question, with more depth:

> How many layers of structures and abstraction must be dissolved, both in code and across time,
> into bits'n'bytes that can be persisted, and later restored, into a usable state?

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
