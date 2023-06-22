+++
title = "Voxels in Videogames"
description = "A introduction to voxels in videogames."
path = "/wiki/intro-to-videogames"
[taxonomies]
categories = ["introduction"]
+++

So you want to create a videogame using voxels?

<!-- more -->

Then you'll have to first decide whether you want to start [from scratch](/wiki/engines/from-scratch)
or use an existing [game-engine](/wiki/engines/).

{% warn_notice() %}
    **Warning:**  
    Starting from scratch requires knowledge about *many* different areas of programming.
    If you don't have *any* experience with 3D computer-graphics,
    or simply don't want to invest *literal years* of your
    [*very finite life*](https://www.youtube.com/watch?v=JXeJANDKwDc),
    it might be best to start with a [game engine](/wiki/engines) instead.
{% end %}

Here are some questions you should ask yourself from the get-go...

---

&mdash; What should your voxels **look like** to the player?

- Plain coloured cubes?
- Textured cubes?
- Smooth terrain?
- Realistic?

&mdash; **How big** will the **individual voxels** be, in relation to the player?

Too small, you loose the ability to easily build stuff;
too big, there won't be enough detail for the mind to fill in.

Note that this directly plays into what your voxels look like!

&mdash; **How big** do you want **the world**, that the player exists in, to be?

Keep in mind that, even if you procedurally generate an *entire* planet,
you will *still* have to fill it with interesting content; best start small!

&mdash; Will players be able to **play together**?

If you start with just singleplayer and then try to add multiplayer on top...
you will be in for a *colossal* world of pain. Plan ahead for this.

&mdash; Do you want your voxels to be **destructible** by the player?

Some optimizations can only be done during development-time, instead of runtime,
due to the soft realtime constraints of videogames;
making the switch later is *very* annoying.

---

## Minecraft Clone?

If you *do* intend to create a voxel-based videogame,
there is something you should be *immediately* and *acutely* aware of:

> No matter what you do, your game **will** inevitably be compared to Minecraft... and that's okay!

Copying and [remixing](https://www.youtube.com/watch?v=MZ2GuvUWaP8) other peoples ideas
has been happening for quite literally *thousands of years* across ***all*** creative disciplines!

*Nothing* these days is truly original, so don't worry about it and just create what *you* like!

As a matter of fact, Minecraft is strongly inspired (read: a 'clone') of an earlier game: [Infiniminer](https://en.wikipedia.org/wiki/Zachtronics#Infiniminer).

{% warn_notice() %}
*Having said that*, **Copyrights** and **Trademarks** are very real things,
so don't go using assets from Minecraft (or other games for that matter!) in your own project... unless you want to get sued.

Always check that the things you use have the [proper](https://choosealicense.com/) [license](https://tldrlegal.com/).

You have been warned!
{% end %}
