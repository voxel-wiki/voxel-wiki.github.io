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


---

## Prerequisites

Let's go over a few prerequisites that you should know / be aware of / have,
before jumping into the rabbit hole!

### Gaming

> You probably didn't expect this to be a requirement.

This is a rather... strange, soft and subjective prerequisite.

If you've never played Minecraft, Vintage Story, Hytale, Terraria or similar survival-sandbox games,
it's strongly recommended that you go and play most of these, for some days-to-weeks, each.

Gone and done that? Good.

Wrote some notes? No? Well, back at it, this is homework!

The important thing here is that, as you play these games,
you'll eventually get thoughts along the lines of...

- <q>Wouldn't it be cool/nice/neat if...?</q>
- <q>How the hell is this supposed to work...?</q>
- <q>This feels bad/boring/grindy/annoying...?</q>
- <q>Why is there no pay-off/reward for...?</q>
- <q>That [...] doesn't feel fair...?</q>
- <q>Where's this supposed to go...?</q>
- <q>Do I really have to do this again...?</q>
- <q>Why is there no hint/visual/guide for that...?</q>
- ...
- <q>What exactly do I do now...?</q>

...and you should ***write these down*** because, as it turns out,
designing a game is *all about* such sudden ideas and questions!

{{ todo_notice(body="Explain why.") }}

{% info_notice() %}
It doesn't matter if it's digital or analog, in a diary, notebook, or an endlessly growing post-it collection;
expecting yourself to remember these fleeting thoughts is just silly.
{% end %}

That does mean you've got to avoid immediately acting on them (even if it'll only "take a minute"!),
which may be quite difficult if you're "in the flow", and make sure to ask:

1. Can this be done later?
2. Does this fit into the projects vision?
3. Are there any required, but missing, systems & tooling?
4. Is it worth the *effort* and *cost* to implement?

### Constraints

This is a series of questions that, when combined,
create a set of hard(-ish) **constraints** for a voxel-based videogame,
so it's best to have (mostly) clear answers here from the get-go...  
&nbsp;

&mdash; What should your voxels **look like** to the player?

- Plain coloured cubes?
- Textured ("pixel art") cubes?
- Smooth terrain of plain colors?
- Smooth terrain with "retro" textures?
- Realistic terrain?
- A mix of the above?

&mdash; **How big** will the **individual voxels** be, relative to the player?

Too small, you loose the ability to easily build stuff;
too big, there won't be enough detail for the mind to fill in.

- The scale may be anywhere from ~1/50th to ~2x the player size.
- It directly plays into what your voxels look and feel like!
- Don't change the relative scale further into development.

&mdash; **How big** do you want **the world**, that the player exists in, to be?

Keep in mind that, even if you procedurally generate an entire planet,
you'll *still* have to fill it with interesting content; best start small!

&mdash; Will players be able to **play together**?

If you start with just singleplayer and then try to add multiplayer on top...
you will be in for a colossal world of pain. Do plan ahead for this.
At the very least, ensure that simulation and rendering is separated.

&mdash; Do you want your voxels to be **destructible** by the player?

Some optimizations can only be done during development-time, instead of runtime,
due to the soft realtime constraints of videogames;
making the switch later is quite annoying.

&mdash; Can players build with voxels? And how? At what scale?

Voxels are obviously great for building,
but you might still want to provide *some* tools to make building, especially of larger structure, straight forward.
Giving players chronic [RSI](https://en.wikipedia.org/wiki/Repetitive_strain_injury)
does not spark joy in the long term.

&mdash; Will your game to be **extensible** via user-content / mods?

Depending on the base-language you to work with,
implementation of a modding system or API may be anywhere from laughably easy,
to merely mildly painful... all the way to horrendously difficult.
And that's without even taking multiplayer into account!

### Knowledge

{{ stub_notice(kind="section") }}

### Prototyping

> Nothing is more permanent then a temporary fix.

You **must** accept that a lot of the code you're about to write, now and in the future,
won't make it into the published application: It *will* be thrown away, eventually.

{{ stub_notice(kind="section") }}


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
