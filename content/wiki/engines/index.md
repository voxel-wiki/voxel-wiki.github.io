+++
title = "Engines"
description = "Using an existing engine or writing a new one is a hard question; this article might help."
[taxonomies]
categories = ["engines"]
+++

{% quote(author="[Wikipedia](https://en.wikipedia.org/wiki/Game_engine)") %}
A **game engine** is a software framework primarily designed for the development of video games [..]
{% end %}

Using an existing engine or writing a new one is, unfortunately, a hard question depending on many factors.

This article is split into two sections, one for [using an existing game engine](#using-an-existing-game-engine),
the other for [creating a new game engine](#creating-a-new-game-engine) from scratch, to help you decide what to do.

## Using an existing Game Engine

If you want to make a game and get something playable & distributable within a... *reasonable* time-frame... using an existing game engine is **strongly recommended**.

The most commonly used game engines are as follows:

- [Unity Engine](https://unity.com/) (C#)
- [Unreal Engine](https://www.unrealengine.com/) (C++, Blueprints)
- [Godot Engine](https://godotengine.org/) (C, C++, C#, VisualScript, GDScript)

{% todo_notice() %} Create one article for each engine. {% end %}

## Creating a new Game Engine

> **Disclaimer:**  
> If you wish to *learn* how game engines works, creating one is a good way of approaching the issue.  
> After all, everyone has to learn to walk before they can run!

Following are a few things you must keep in mind and be aware of **before** you begin:

1. You must have the concrete want (motivation) and will (discipline) to do so.
2. It is a *massive* amount of work, potentially spanning over years of your life.
3. Having several years of programming experience is a must; nobody will hold your hand in this endeavour.
4. All the tooling for asset-, level- and gameplay-creation? You'll have to make them.
5. Running into driver bugs and various platform/OS differences will eat a lot of time and cause premature balding.

The above list might make you question *"Why would anyone do this?!"*, to which most of [us](/wiki/community) will say... because it's fun! :D

A more concrete reason is that, by writing both the high- and low-level code, you can gain *a lot* of performance (that'd otherwise be left on the table) *and* the freedom to make some truly awesome things.

But with that said, keep in mind that *creating a game* is still best done with an existing engine.

If you're still here, [let's get started](/wiki/engine-creation), shall we?
