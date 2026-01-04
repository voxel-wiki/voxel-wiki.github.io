+++
title = "Procedural Generation"
description = "The art of procedural generation is an extremely powerful method to reduce the amount of work needed to create levels and assets."
aliases = ["/wiki/procgen", "/wiki/proc-gen"]
[taxonomies]
categories = ["procedural-generation"]
tags = ["procedural-generation", "design", "gamedev"]
+++

{% quote(author="[Wikipedia](https://en.wikipedia.org/wiki/Procedural_generation)") %} In computing, **procedural generation** (sometimes shortened as **proc-gen**) is a method of creating data algorithmically as opposed to manually, typically through a *combination* of *human-generated* assets and algorithms coupled with *computer-generated* randomness and processing power. {% end %}

<!-- more -->

The art&thinsp;(!) of **procedural generation** is an extremely powerful method to reduce the amount of work needed to create levels and assets.

It's quite common for game engines, frameworks and editors to provide artists with a large variety of proc-gen tools, from basic object placement to generating entire levels/worlds. As such, a ludicrous number of games use procedural generation, in one form or another, for a variety of purposes such as:

- Object Placement
- Level Generation
- Terrain Generation
- Plant/Foliage Generation
- Texture Generation
- Sound Generation
- ...

If we tried listing all the ways proc-gen is used, we'd be here all week!

{% info_notice() %}
Note that procedural generation is **not** limited to just *games*; far from it! It's used basically *anywhere* anyone needs to create *chaos*, *repetition* and large-scale *patterns* without spending days (if not weeks or months!) being bored out of their mind[^boredom].
{% end %}

Some common algorithms used for procedural generation are:

- Coherent [Noise](/wiki/noise)
- [Cellular Automata](/wiki/cellular-automata)
- [Phased Generation](/wiki/phased-generation)
- Lindenmayer Systems
- Voronoi Diagrams
- Neural Networks
- Markov Chains
- Wang Tiles
- Random Walks
- Mersenne Twister
- XORShift

{{ todo_notice(body="Create articles for the above?") }}

{{ todo_notice(body="Add more explainers? Guides?") }}

## References

{{ todo_notice(body="Add **more** references.") }}

**General:**
- [Wikipedia: Procedural Generation](https://en.wikipedia.org/wiki/Procedural_generation)
- [Procedural Content Generation Wiki: Algorithms](http://pcg.wikidot.com/category-pcg-algorithms)
- [aparis69: Learn Procedural Generation](https://aparis69.github.io/LearnProceduralGeneration/)
- [/r/ProceduralGeneration](https://www.reddit.com/r/proceduralgeneration/)

**Pseudorandom Numbers:**
- [Wikipedia: Pseudorandom Number Generator](https://en.wikipedia.org/wiki/Pseudorandom_number_generator)
- [Wikipedia: Pseudorandom Number Sampling](https://en.wikipedia.org/wiki/Non-uniform_random_variate_generation)
- [Wikipedia: Mersenne Twister](https://en.wikipedia.org/wiki/Mersenne_Twister)
- [Wikipedia: XORShift](https://en.wikipedia.org/wiki/Xorshift)

**Noise:**
- [Wikipedia: Gradient Noise](https://en.wikipedia.org/wiki/Gradient_noise)
- [Wikipedia: Colors of Noise](https://en.wikipedia.org/wiki/Colors_of_noise)

**Wang Tiles:**
- [Wikipedia: Wang Tiles](https://en.wikipedia.org/wiki/Wang_tile)
- [Wang Tiles: edge and corner matched tilesets](https://www.boristhebrave.com/permanent/24/06/cr31/stagecast/wang/intro.html)
- [Some Interesting Examples of Wang Tilings](https://web.williams.edu/Mathematics/sjmiller/public_html/hudson/Zeltzer_Wang_Tilings.pdf)

**Lindenmayer Systems:**
- [Wikipedia: Lindenmayer Systems](https://en.wikipedia.org/wiki/L-system)
- [XNA Procedural LTrees](https://web.archive.org/web/20180126135353/http://ltrees.codeplex.com/)

**Markov Chains:**
- [Experiments in Map Generation using Markov Chains (2014)](http://fdg2014.org/papers/fdg2014_paper_29.pdf)
- [A Hierarchical Approach to Generating Maps Using Markov Chains (2020)](https://cdn.aaai.org/ojs/12708/12708-52-16225-1-2-20201228.pdf)

**Misc.:**
- [Wikipedia: Stochastic Process](https://en.wikipedia.org/wiki/Stochastic_process)
- [Wikipedia: Tessellation](https://en.wikipedia.org/wiki/Tessellation)
- [Wikipedia: Fractals](https://en.wikipedia.org/wiki/Fractal)
- [Wikipedia: Poisson Distribution](https://en.wikipedia.org/wiki/Poisson_distribution)
- [Wikipedia: Voronoi Diagram](https://en.wikipedia.org/wiki/Voronoi_diagram)
- [Wikipedia: Roguelike](https://en.wikipedia.org/wiki/Roguelike)
- [Wikipedia: Sandbox Game](https://en.wikipedia.org/wiki/Sandbox_game)
- [Wikipedia: Games using Proc-Gen](https://en.wikipedia.org/wiki/List_of_games_using_procedural_generation)

---

[^boredom]: This doesn't mean it can't be fun manually doing what procedural generation can do automatically; for some people *being* a procedural generator is a genuine form of relaxation!
