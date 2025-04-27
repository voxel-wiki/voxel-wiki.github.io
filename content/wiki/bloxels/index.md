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

Instead, let's talk about the most common mistake people make! ;D

### How NOT to (store) Bloxel

Due to the endemic of people learning [Object-Oriented Programming](https://en.wikipedia.org/wiki/Object-oriented_programming), without ever learning about [Data-Driven Programming](https://en.wikipedia.org/wiki/Data-driven_programming), a lot of people go-

> I know! Let's make `Bloxel` a class and inherit from that!

-which is an *absolutely terrible* idea.

Creating large arrays of heap-based objects doesn't seem like a problem at first, computers are *really fast* after all...

{% info_notice(float=true) %}
This is *one* of *the* major reasons why Minecraft's performance has been getting worse over the years.
{% end %}

But as the voxel volume grows and more bloxels are added, we eventually begin pulling *too many things*, over *too big a range* of memory into our [CPU cache](https://en.wikipedia.org/wiki/CPU_cache), invalidating it more and more, meaning we have to pull *even more* things from memory... and this costs [a lot of time](https://gist.github.com/jboner/2841832).

Noticing that this is happening is pretty hard, until it's too late,
so better not do it in the first place; your CPU and RAM will thank you!

<!--
---

So, how does one avoid these pitfalls and make things work?

You need to heed just one word: **Compression**
-->

### How to actually store Bloxels

**Compression** is the **bread and butter of voxels**, and thus bloxels.

Without it our worlds would be smol, our memory full, our CPU cache trashing, frame-time climbing, fans screaming... you get the idea.

So how, and how much, can we compress our bloxels?

Let's establish some rules-of-thumb:

- Bloxels are mostly static.
- Bloxels are mostly the same.
- Bloxels are mostly hidden.
- Bloxels tend to be 'piled up'.

<!--
So, let's start with the first thing: doing absolutely nothing!

#### Bloxels Are Mostly Unchanging

If you look at the average Minecraft gameplay video, you may have noticed that,
outside of (in)direct player interaction, all the visible bloxels are just *there*,
not doing *anything*, millions upon millions[^mc-block-count] of them!

This is not due to the developers being lazy or uninspired with making their bloxels *do* stuff,
but rather a very important optimization strategy: **doing nothing is highly performant**.
-->



{% todo_notice() %} Flyweight Pattern {% end %}
{% todo_notice() %} The Global Palette {% end %}
{% todo_notice() %} Chunking {% end %}
{% todo_notice() %} Chunk Management (TLAS) {% end %}
{% todo_notice() %} Chunk Palettes {% end %}



---
## Implementation





---
## References

{% todo_notice() %} References {% end %}

---

[^mc-block-count]: With a default view-distance of 12 chunks, there are approximately **+20 million _solid_ blocks** surrounding the player in Minecraft.
