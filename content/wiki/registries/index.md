+++
title = "Registries Architecture"
description = "A structured approach to architecting the definitions, types, variants and behaviours of things that can exist in a game-world."
#path = "/"
aliases = ["/registry"]
draft = true
[taxonomies]
categories = ["architecture"]
tags = ["architecture", "datastructures", "instancing", "data-driven"]
+++

A **Registries Architecture** is a structured approach to architecting the **definitions**, **types**,
**variants** and **behaviours** of *things* that can exist in a game,
allowing for complex resolution of references, while still providing efficient access.

<!-- more -->

They are conceptually related to **Entity-Component-Systems**
<small>(both deriving from relational databases)</small>,
being a sort-of *mirror* of them for (semi-)static data,
and may serve as the basis for, or just an extension to, their implementation.

{{ stub_notice() }}

## Motivation

{{ todo_notice(body="Motivate") }}

## Theory

At it's most basic, a registry is just a **table** of "one type of" things...

```c#
interface Registry<T> {
	T GetByNumeric(uint ID);
	T GetByNominal(string ID);
}
```

But trying to implement them like ^that^, prevents us from doing some... *interesting* things with them,
such as thread-safety, hot-reloading, recursive access, namespacing, multi-tagging, etc.&nbsp;etc.
...you get the idea.

{{ todo_notice(body="Theorize") }}

## Implementation

{{ todo_notice(body="Implement") }}

## References

{% todo_notice() %} References {% end %}
