+++
title = "Engine Creation"
description = "How does one create a new game engine?"
draft = true
+++

{% warn_notice() %} Please carefully read the [article on engines](/wiki/engines) before this one. {% end %}

{{stub_notice()}}

On the surface of things, creating an engine *appears* to be a straight forward task:

1. Create a **window** with a **gameloop**.
2. Have it process a users **inputs**.
3. **Update** the virtual world.
4. **Render** the virtual world.
5. Goto 2.
6. ???
7. Profit.

But that's just the surface; what exactly *makes* a game engine?

{% quote(author="[Wikipedia](https://en.wikipedia.org/wiki/Game_engine)") %}
The core functionality typically provided by a game engine may include a **rendering engine** ("renderer") for 2D or 3D graphics, a **physics engine** or collision detection (and collision response), **sound**, **scripting**, **animation**, **artificial intelligence**, **networking**, **streaming**, **memory management**, **threading**, **localization** support, **scene graphs**, and video support for **cinematics**.
{% end %}

Well, that ain't really helpful now, is it? Let's try a different approach...

## Core Concepts

The core of a game engine is (similar to an operating system) an abstraction for managing resources, generally & conceptually consisting of...

- The Core Lifecycle
- The Task Manager
- The Data/Asset Model
- The Scene Structure
- The Extension Mechanism

{% info_notice() %}
**Note:** Since *everything else* is built on top of these, some serious thought should be put into their design.
Rebuilding/replacing them at a later time is considered a Bad Idea™, as they influence every part of the engine.
{% end %}

While the following sections will explain each concept on its own, do keep in mind that they're highly intertwined.

---

### The Core Lifecycle

{{todo_notice(body="Create simple lifecycle example image?")}}

{{stub_notice(kind="section")}}

### The Task Manager

{{stub_notice(kind="section")}}

### The Data/Asset Model

{{stub_notice(kind="section")}}

### The Scene Structure

{{stub_notice(kind="section")}}

### The Extension Mechanism

{{stub_notice(kind="section")}}
