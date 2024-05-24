+++
title = "Bloxels"
description = "A guide for the implementation of Block-shaped Voxels."
draft = true
[taxonomies]
categories = ["bloxels"]
tags = []
+++

{% info_notice() %}
This is a advanced guide that'll walk you through the **theory** and **implementation** of *Block-shaped Voxels*, as widely popularized by Minecraft.
{% end %}

<!-- more -->

{% warn_notice() %}
We assume you have read the [Introduction to Voxels](/wiki/introduction) beforehand.
{% end %}

## Introduction

> Wanna clone Minecraft? Well, here you go!

Really, creating your own Bloxel game *appears* easy on the surface,
it's *just cubes* after all, so what could *possibly* be so hard about this?!

This guide will show just how much complexity is hidden behind the blocks,
break it down into digestible pieces, so that you too can create what you want,
but on solid foundations.

Let's get started!

---

## Getting Started

Most guides & tutorials would start with setting up a window and rendering cubes;
we won't do that here as it has been done a thousand times over, thus well covered elsewhere.

Instead, let's talk about the most common mistake people make! ;D

### How NOT to (store) Bloxel

Due to the endemic of people learning [Object-Oriented Programming](https://en.wikipedia.org/wiki/Object-oriented_programming), without ever learning about [Data-Driven Programming](https://en.wikipedia.org/wiki/Data-driven_programming), a lot of people go-

> I know! Let's make `Bloxel` a class and inherit from that!

-falling into one of two traps that are hard to get out of...

---

**The first trap** is that of creating large arrays of (pointers/references to) objects.
It doesn't seem like a problem at first, computers are *really fast* after all...

<div class=float></div>
{% info_notice() %}
This is **one** of the major reasons why Minecraft's performance has been getting worse over the years.
{% end %}

But as the voxel volume grows and more bloxels are added, we eventually begin pulling *too many things*, over *too big a range* of memory into our [CPU cache](https://en.wikipedia.org/wiki/CPU_cache), invalidating it more and more, meaning we have to pull *even more* things from memory... and this costs [a lot of time](https://gist.github.com/jboner/2841832).

Noticing that this is happening is pretty hard, until it's too late.

---

And then there's **the second trap**:

> I know! Let's have *one* small struct that can represent *all the bloxels*...

So we have a single struct, that takes two-to-four 32-bit integers of space, repeated for all of the bloxels across the volume... and this is actually fine! Until you remember [the scaling problem](/wiki/introduction#the-scaling-problem) from the introduction.

Let's do the math again, shall we?

1. Think of how far into the distance you want to 'see', in meters/voxels.
2. Using that distance, calculate `(D*2)³` to get the visible volume.
3. Assume our small struct takes 64 bits, i.e. 8 bytes of space...
4. ...so multiply the volume by 8 bytes.
5. Divide by `1024` to get it as kilobytes.
6. Divide by `1024`, again, for megabytes.
   - Divide again to get gigabytes, if needed.
7. Stare in shock at the amount of memory used.

{{ volume_memory_calc(id="calculator") }}

Thanks to the scaling problem, memory usage is *cubic* in relation to view distance...

---

So, how does one avoid these pitfalls and make things work?

You need to heed just one word: **Compression**

### How to actually store Bloxels





---
## Implementation





---
## References

