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

In many fields of programming, the choice of language is quite open... even interpreted languages are often acceptable!

But with voxels? Let's do a quick exercise, shall we...

<!-- more -->

## The Scaling Problem

1. Grab a calculator (we ain't monsters here)!
2. Think of how far into the distance you want to 'see', in meters/voxels.
3. Type that number into the calculator.
4. Double the number once.
5. Multiply the number, by *itself*, **twice**.
6. Look at the result.
7. Try this again, from step 2, with some other numbers...

{% info_notice() %}
Alternatively, you can use the formula `(D*2)³`,
were `D` is the initial number from step 2.
{% end %}

Unless you keep the range of the active volume *very* small (on the order of `16³` to `256³`), you will quickly realize that there is a *scaling problem*: Increasing the size of the volume will consume *cubically* more and more memory, making computations *horrendously* expensive.

## Requirements for performant Voxels

As such, there are some rather strong **requirements** when choosing a language:

1. Tightly packing data, via structs and continuous arrays.
2. Processing large arrays/lists of numbers at bare-metal speed.
3. Creation of complex, nested, but performant, data-structures.
4. No copying or cloning of data unless requested.
5. Access to graphics hardware acceleration.
6. Multithreading.

This effectively cuts out *all* languages that are interpreted[^interpreted] instead of compiled; unless you are fine with a *very* small volume size, using these languages is *not* recommended for anything but higher level scripts.

{% info_notice() %}
Using JIT-compiled[^JIT] languages is fine, but you'll have to be ***very*** careful with managing memory, and may be forced into non-idiomatic[^idiom] code.
{% end %}

While [Chunking](/wiki/chunking) and various acceleration structures go a long way to alleviate the issues posed by interpreted and JIT'd languages, you *will* eventually need the ability to manage memory on both fine and large scales.

## Your Choices

Unfortunately, all this restricts your choices to [system-level languages](https://en.wikipedia.org/wiki/System_programming_language#Higher-level_languages), such as `C++`, `Rust`, `Zig` or `Go`.

For this guide we will be using *basic* `Rust`; you do not need to know how lifetimes work, for now.

## Next

Storing Voxels In Memory!

---

[^interpreted]: Languages that are executed ["from source code"](https://en.wikipedia.org/wiki/Interpreter_(computing)), such as `Python`, `JavaScript`, `PHP`, `Lua`, `Perl` and `Ruby`.

[^JIT]: [Just-In-Time Compiled](https://en.wikipedia.org/wiki/Just-in-time_compilation), such as `Java` and `C#`.

[^idiom]: 'Normal' or 'Natural', see <https://en.wiktionary.org/wiki/idiomatic>.
