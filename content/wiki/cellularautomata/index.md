+++
title = "Cellular Automata"
description = "A set of rules applied to a grid of cells with finite states."
path = "/wiki/cellularautomata"
aliases = ["/wiki/cellular-automata", "/wiki/cellularautomaton", "/wiki/cellular-automaton", "/wiki/ca"]
[taxonomies]
categories = ["cellular-automata"]
tags = ["simulation", "gameplay", "physics"]
+++

{% figure(class="float cover", caption="A glider from <a href='https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life'>Conway's Game of Life</a>.", author="Lars Longor K", license="CC0") %}/wiki/cellularautomata/CellularAutomata.drawio.svg{% end %}

A **cellular automaton** <small>(plural: *automata*)</small>, like *Conway's Game of Life*, is a set of rules that are repeatedly applied to a grid of cells, or a graph of nodes and edges, with finite states.

<!-- more -->

Since voxels are, [by definition](/wiki/introduction), cells in a grid,
we can implement various automata to create *a whole lot* of different behaviours
that act across/between voxels.

Not adding any automata to a voxel game is a *terrible* shame,
as they're part of the special sauce[^specialsauce] that makes voxel games so great!

## Common Uses

Since there are entirely too many ways to implement and make use of cellular automata, we'll list just a few of the most common ones:

- Falling sand, gravel, grain, etc.
- Simulation of fluids like water, lava and gas.
- Growth and spread of plants, like grass and trees.
- Electricity and digital logic, like [redstone](https://minecraft.wiki/w/Redstone_mechanics).
- ...

{% todo_notice() %} Articles for each of the above? {% end %}

## References

- [Wikipedia: Cellular Automaton](https://en.wikipedia.org/wiki/Cellular_automaton)
- [Wikipedia: Conway's Game of Life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life)
- [Stanford Encyclopedia](https://plato.stanford.edu/entries/cellular-automata/)
- [EBSCO Article](https://www.ebsco.com/research-starters/science/cellular-automata)
- [Wolfram MathWorld](https://mathworld.wolfram.com/CellularAutomaton.html)

---

[^specialsauce]: The other parts are user-driven creation & destruction.
