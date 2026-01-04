+++
title = "Phased Generation"
description = "By splitting world generation into phases, the entire process can be made both faster and simpler."
alias = "/wiki/phasegen"
[taxonomies]
categories = ["procedural-generation"]
tags = ["procedural-generation", "algorithms"]
+++

**Phased generation** is a process wherein world generation is separated into specialized *phases*,
each only doing 'one thing', caching the result, and feeding into the *next* phase,
on and on until some final 'completed' phase is reached.

<!-- more -->

{% figure(class="float aspect", caption="Phased Generation, as visualized by Minecraft when <a href=https://minecraft.wiki/w/Loading_world_screen>opening a world.</a>", author="By [Unavailablehoax](https://minecraft.wiki/w/User:Unavailablehoax)") %}/wiki/phased-generation/20250204210519!Chunk_colormap.gif{% end %}

This can happen both **globally**, when a world is initially created,
and **locally** as [sections](/wiki/chunking) of the world need to
be realized into actual voxel volumes for simulation/play.

For example, phased generation can roughly look like this:

1. Generate base terrain: only the 'ground', 'fluid' and 'air'.
2. Generate structures that may change the terrain on a large scale,
   such as rivers, paths, craters, megaflora, cities, etc.
3. Derive terrain slopes/gradients and sky visibility/occlusion.
4. Generate the surface layers (i.e.: grass/soil) of the terrain.
5. Generate structures that don't change the terrain (but affect large foliage),
   such as ruins and city buildings.
6. Generate large scale decoration (trees and boulders).
7. Generate small scale decoration (bushes, flowers, rocks).
8. Build acceleration structures and initial lighting.

Each of these phases requires less and less scale, and thus active volume, to take into account.

{{ todo_notice(body="Explain more?") }}
{{ todo_notice(body="Explain phase dependencies?") }}
{{ todo_notice(body="Explain determinism?") }}
{{ todo_notice(body="Explain caching?") }}
{{ todo_notice(body="Example implementation?") }}

## References

- <https://minecraft.wiki/w/World_generation>
