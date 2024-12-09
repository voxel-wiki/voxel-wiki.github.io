+++
title = "Choosing a Language"
description = "Which language to choose?"
path = "/wiki/introduction/language"
[taxonomies]
categories = ["introduction"]
[extra]
chapters = true
chapter_prev = {text = "Introduction", link = "/wiki/introduction"}
chapter_next = {text = "Basic Storage", link = "/wiki/introduction/storage"}
+++

In many fields of programming, the choice of language is quite open... even interpreted[^interpreted] languages are often acceptable and outright preferred!

But with voxels? Things will get out of hand *real fast*... and darn slow.

<!-- more -->

{% info_notice() %}
**Note:**  
When your active/loaded volume of voxels is relatively small (roughly up to ~`256³`), things will be *plenty* fast and *any* language (even interpreted ones!) will be just fine, so feel free to use whichever language you are comfortable with!
{% end %}

## High-ish-Performance Computing

> NASA called; they want their supercomputer back!

Welcome to the world of (reasonably) high-performance computing,
where numbers are crunched en-masse, memory bandwidth is gobbled up
and chasing pointers becomes your biggest fear.

There is a variety of things that your language of choice ***should*** be capable of,
if you want the highest possible performance, along with some things that can
(and will) actively make it harder to get there...

Let's get into it!

### Pedal to the (bare) metal

Interpreted languages are *neat*:  
You can quickly prototype logic, glue things together and explore your possibility space...
but in exchange, your CPU *must* spend time and memory translating abstract code into machine instructions.

To reduce these costs, great minds came up with [Just-In-Time compilation](https://en.wikipedia.org/wiki/Just-in-time_compilation),
where abstract code is translated into machine code, just in time for being evaluated; this allows writing reasonably performant[^somejit] code in a high-level language.

{% info_notice(summary="**FFI:** Why not both?") %}
And if that ain't fast enough, we can make use of [FFIs](https://en.wikipedia.org/wiki/Foreign_function_interface),
keeping our gameplay logic in a high-level language, while the number-crunching is left to a low-level language.

Unfortunately, that presents a lot of busywork you might not want to do, especially when just starting out...
{% end %}

That doesn't mean you can use *any* language however;
there are some requirements for getting the best performance...

### Bits & Bytes & Structs

First things first: You *need* to be able to define and use flat data containers/aggregates/compounds,
commonly called structs, and the ability to tightly pack them in memory (e.g.: as arrays).

Without them, you'll have to manually read/write data from raw buffers of bytes/ints,
which is both a colossal pain in the behind and a *massive* source of bugs.

{% info_notice(summary="**Memcopy is (not) your friend.**") %}
Some languages make it *really* easy to accidentally copy/clone things around,
which is fine for tiny structures (i.e.: up to ~512 bytes), to the point of being zero-cost.

But with voxels? Volumes occupy, by their very nature, a lot of memory;
try to copy around volumes every frame, and your available memory bandwidth will go to zero real fast.
Which is *very* bad.
{% end %}

### Data Structures

Moving data about is easy; structuring it in a sensible manner? *Oof*.

At the very minimum, you will need lists, maps and queues, both ordered
and unordered, just to get started and be able to use common algorithms.
Defining your own orderings and hash functions for these standard structures
can also help a lot.

Sometimes there will be the need to create custom data-structures,
either by gluing existing ones together, or doing funny things with pointers!

{% todo_notice() %} Something is missing here... but what? {% end %}

{% todo_notice() %} Pointers pointing at pointers pointing at things. {% end %}

### SIMD Processing

{% todo_notice() %} Write section. {% end %}

### GPUs are your frienemy

{% todo_notice() %} Write section. {% end %}

### Multithreading complex be can

Yes, you read that heading right.

Multithreading is, partly due to the immense complexity of modern CPUs,
but mostly cause of process/task-scheduling,
utterly **non-deterministic** by default:
there is *no* order to operations happening between two threads,
and any such perceived order *is an illusion*, unless there are synchronization
primitives (atomics, mutices, semaphores, barriers, etc.) in place enforcing it.

This *may* seem like a minor thing, but it very much is not.

We (humans) are inherently incapable of mentally dealing with multiple concurrent tasks:
we quite literally cannot comprehend this stuff without heaps of training and tools to assist us.
Anybody that says otherwise is either a liar or a robot.

So, take all the help you can (debuggers and tracers!),
use existing threading and synchronization primitives,
and remember that queues are your most reasonable friend.

## Profile. Profile. Profile.

Using profilers is a ***must*** to get accurate pictures of your performance woes.

While trusting your (hopefully sharply honed :wink:) programming wisdom is a good-ish thing,
it can only get you so far before *actively hindering you*...
so acquiring more knowledge via profiling is your best bet.

Thankfully, most common <abbr title="Integrated Development Environments">IDEs</abbr>
(such as Microsoft's Visual Studio, various JetBrains products, the Eclipse family, etc.)
have profilers, or integrations with them, built right into them, making profiling your software relatively straight forward...

Of course, learning how to use and interpret the data a profiler outputs is a whole 'nother topic,
on which entire books have been written, so we won't get into that here.

Again, remember: **Profile. Profile. Profile.**

## Your Choice

In the end, it is your choice to pick a language that best fits your future goals,
personal experience and current (cap-)abilities.

We hope this article helps you come to a decision!

For **this guide**, we will be using `Rust`,
without its more advanced concepts (async, lifetimes, etc),
as its a (*authors opinion*) good choice.

<!--

## Requirements for performant Voxels

While a combination of [Chunking](/wiki/chunking), [compression](/wiki/compression) and various acceleration structures can go a long way to alleviate these issues, you *will* eventually need the ability to manage memory on both fine and large scales.

// As such, there are some rather strong **requirements** when choosing a language:
// 
// 1. Tightly packing data, via structs and continuous arrays.
// 2. Processing large arrays/lists of numbers at bare-metal speed.
// 3. Creation of complex, nested, but performant, data-structures.
// 4. No copying or cloning of data unless requested.
// 5. Access to graphics hardware acceleration.
// 6. Multithreading.

This effectively cuts out *all* languages that are interpreted[^interpreted] instead of compiled[^system-level]; using these languages is *not* recommended for anything but higher level (i.e.: gameplay) scripts.

{% info_notice() %}
**Note:** Using JIT-compiled[^JIT] interpreted languages is fine, but you'll have to be ***very*** careful with managing memory, and will have to deal with heaps of leaky abstractions and non-idiomatic[^idiom] code.
{% end %}

## Your Choices

Unfortunately, there aren't many programming-languages that make writing high-performance code a reasonable affair, so your choices are quite limited ***if*** you want a whole hecc of a lot of voxels...

This (*very* incomplete) table is roughly ordered by time to learn/get-started.

-->

## Next

Storing Voxels In Memory!

---

[^interpreted]: Languages that are executed ["from source code"](https://en.wikipedia.org/wiki/Interpreter_(computing)).

[^somejit]: Some JIT-compiled languages are *a hell of a lot* faster than their brethren, with *only* a ~1.5-4x slowdown compared to system-level languages, due to literal hundreds of years of total work to *make* them fast; mainly the `JVM`, `CLR`, `V8` and `LuaJIT` runtimes.

[^system-level]: [Higher-level System-level Languages](https://en.wikipedia.org/wiki/System_programming_language#Higher-level_languages).

[^idiom]: 'Normal' or 'Natural', see <https://en.wiktionary.org/wiki/idiomatic>.
