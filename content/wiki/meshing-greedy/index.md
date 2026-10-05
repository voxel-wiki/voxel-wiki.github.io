+++
title = "Greedy Voxel Meshing"
description = "Merging faces across voxels to reduce triangle counts."
#path = "/"
#aliases = ["/"]
[taxonomies]
categories = ["meshing", "rendering"]
tags = ["meshing", "rendering", "bloxels"]
+++

> Merging faces across voxels to reduce triangle counts...

<!-- more -->

{{ stub_notice() }}

## Motivation

{{ todo_notice(body="Fewer Triangles Are Better...?") }}
{{ todo_notice(body="Larger Triangles Are Better...?") }}
{{ todo_notice(body="Welding Vertices Is Good...?") }}

## Theory

{{ todo_notice(body="Pros And Cons") }}

{{ todo_notice(body="When Greedy Meshing Fails") }}

## Implementation

{{ todo_notice(body="Basic Implementation") }}

{{ todo_notice(body="The Dreadful T-Junction Issue (and ways to fix it)") }}

{{ todo_notice(body="Binary Greedy Meshing") }}

<!--
AUTHOR NOTE: As (J) noted, a pro/cons comparison would be better; tis' be much too heavy handed!

{% warn_notice() %}
***EXTREMELY IMPORTANT WARNING:***  
**Greedy Meshing** works best with **simple solid color** voxels,
as more complex meshes/styles or just plain *variation*, will *annihilate*
any and all (oft perceived) benefits the technique has,
while also exposing the dreadful [T-Junction Issue](/wiki/t-junction).

Please try implementing [multi-draw](/wiki/multidraw) first,
then combine it with [vertex packing](/wiki/vertex-packing) and its derived methods;
GPUs care less about triangle-counts than you'd think!
{% end %}
-->

## See Also

- Parent article: [**Surface Extraction**](/wiki/surface-extraction)
- [Naïve Voxel Meshing](/wiki/meshing-naive)
- [Baked Voxel Meshing](/wiki/meshing-baked)
- [Interior Culling](/wiki/interior-culling)
- [Quad Indices](/wiki/quad-indices)
- [T-Junction](/wiki/t-junction)
- [Multi-Draw](/wiki/multi-draw)
- [Vertex Packing](/wiki/vertex-packing)

## References

- https://0fps.net/2012/06/30/meshing-in-a-minecraft-game/
- https://github.com/cgerikj/binary-greedy-meshing
- ...

{% todo_notice() %} References {% end %}
