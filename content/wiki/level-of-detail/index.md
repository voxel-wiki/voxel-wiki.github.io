+++
title = "Level Of Detail"
description = "Replacement of geometry that is too small with lower detail geometry."
aliases = ["/wiki/lod"]
[taxonomies]
categories = ["rendering"]
tags = ["rendering", "level-of-detail", "lod", "meshing", "optimization"]
+++

Under [perspective projection](https://en.wikipedia.org/wiki/3D_projection#Perspective_projection), as the distance to any visible object increases, it'll occupy/cover less and less pixels on the screen, so the geometric features or *details* of the object become ever smaller too. Because of this, it makes sense to reduce the **level of detail** an object has at large distances.

<!-- more -->

{% info_notice() %}
**Note:** The *highest* and *most-detailed* level, when represented or expressed as an index, is generally defined to be `0`, with higher numbers indicating *less* detail, not more.  
<small>Yes, this is confusing, we've all been there.</small>
{% end %}

---

{{ stub_notice() }}

{{ todo_notice(body="Note on the difficulty of LOD'ing bloxels.") }}
{{ todo_notice(body="Explain various level of detail techniques?") }}
{{ todo_notice(body="Explain super-sampling and under-sampling?") }}
{{ todo_notice(body="Explain moiré artifacts?") }}
{{ todo_notice(body="Find fitting references.") }}

## References

- [Wikipedia: Level of detail (computer graphics)](https://en.wikipedia.org/wiki/Level_of_detail_(computer_graphics))
- [Wikipedia: Moiré Pattern](https://en.wikipedia.org/wiki/Moir%C3%A9_pattern)
