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

In many fields of programming, the choice of language is quite open... even interpreted languages are often acceptable and outright preferred!

But with voxels? Well... The Square-Cube Law: Electric Boogaloo!

<!-- more -->

## Requirements for performant Voxels

Remember that section from the [Introduction](/wiki/introduction) article...?
Well, here's where it rears it's cubic head!

When your active volume is in the range of `16³` to ~`256³`, things will be *plenty* fast and any language (even interpreted ones!) will be just fine.

But, going beyond that, you will quickly encounter the square-cube law: Increasing the size of the volume will consume *cubically* more and more memory, all while making computations *horrendously* expensive.

While a combination of [Chunking](/wiki/chunking), [compression](/wiki/compression) and various acceleration structures can go a long way to alleviate these issues, you *will* eventually need the ability to manage memory on both fine and large scales.

As such, there are some rather strong **requirements** when choosing a language:

1. Tightly packing data, via structs and continuous arrays.
2. Processing large arrays/lists of numbers at bare-metal speed.
3. Creation of complex, nested, but performant, data-structures.
4. No copying or cloning of data unless requested.
5. Access to graphics hardware acceleration.
6. Multithreading.

This effectively cuts out *all* languages that are interpreted[^interpreted] instead of compiled[^system-level]; using these languages is *not* recommended for anything but higher level (i.e.: gameplay) scripts.

{% info_notice() %}
**Note:** Using JIT-compiled[^JIT] interpreted languages is fine, but you'll have to be ***very*** careful with managing memory, and will have to deal with heaps of leaky abstractions and non-idiomatic[^idiom] code.
{% end %}

## Your Choices

Unfortunately, there aren't many programming-languages that make writing high-performance code a reasonable affair, so your choices are quite limited ***if*** you want a whole hecc of a lot of voxels...

This (*very* incomplete) table is roughly ordered by time to learn/get-started.

| Language | Notes |
|---|---|
| `C#` <br><small>(7.2+)</small> | JIT-compiled; can never be used on game consoles. |
| `Java` | JIT-compiled; harder to optimize well as project grows; can never be used on game consoles. |
| `Go` | Garbage-Collector will cause issues as project grows. |
| `Swift` | TBD |
| `Rust` | Advanced concepts may take a few tries to learn. |
| `Zig` | Completely manual memory management. |
| `C++` | May have to bring your own standard library. |
| `C` | Unless you know what you're doing: *Don't*. |

For this guide we will be using *basic* `Rust`, without its more advanced concepts (async, lifetimes, etc).

## Next

Storing Voxels In Memory!

---

[^interpreted]: Languages that are executed ["from source code"](https://en.wikipedia.org/wiki/Interpreter_(computing)), such as `Python`, `JavaScript`, `PHP`, `Lua`, `Perl` and `Ruby`.

[^system-level]: [Higher-level System-level Languages](https://en.wikipedia.org/wiki/System_programming_language#Higher-level_languages).

[^JIT]: [Just-In-Time Compiled](https://en.wikipedia.org/wiki/Just-in-time_compilation), such as `Java` and `C#`.

[^idiom]: 'Normal' or 'Natural', see <https://en.wiktionary.org/wiki/idiomatic>.
