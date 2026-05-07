+++
title = "Acceleration Structures"
description = "Acceleration structures are data structures, specialized for improving the spatial lookup/query performance of objects in a scene, by subdividing said scene into smaller volumes.."
path = "/wiki/accelerationstructures"
aliases = ["/wiki/tlas", "/wiki/blas"]
[taxonomies]
categories = ["datastructures"]
tags = ["spatial-acceleration", "TLAS", "BLAS"]
+++

**Acceleration structures** are [data structures](/wiki/datastructures), specialized for improving the spatial lookup/query performance of objects in a scene, by subdividing said scene into smaller volumes.

<!-- more -->

## Motivation

Imagine a scene with a ground-plane, a few cubes and a [Stanford Dragon](https://en.wikipedia.org/wiki/Stanford_dragon); performing a query/lookup against this scene, like casting a ray, is quick and simple:

Iterate all the objects, cheaply check if the ray hits their respective [bounding volume](https://en.wikipedia.org/wiki/Bounding_volume) <small>(usually AABBs, OOBs or spheres)</small>, then do a finer check against the objects mesh. If the ray finds a hit on the mesh, the search is done... but if it doesn't, it *must* continue iterating all the objects, until no candidates are left. 

For a few objects, this is fine, so imagine taking the dragon, and making *tens of thousands of copies*... the previously, reasonably fast, raycast now takes *milliseconds* to run; `O(n)` strikes again!

If that somehow doesn't sound bad, try the same but with, say, all the dragons bouncing around and colliding with each other. Now you've got `O(n²)` checks to run, and your computer is on fire.

This is, of course, unacceptable.

To optimize this, and put out the fire, we employ **acceleration structures**, whose sole purpose is to make lookups/queries against a scene, cheap to perform again.

## Explanation

...
{{ stub_notice(kind="section") }}

### Space Partitioning

...
{{ stub_notice(kind="section") }}

### Top- and Bottom-Level

In the context of (but not exclusive to) raytracing and physics, acceleration structures tend to be split into a *top* and a *bottom* level, referred to as TLAS and BLAS respectively.

This is because construction of a BLAS can, depending on the structure and algorithm used, be extremely time/memory intensive, to the point of being almost impossible to run in realtime.

The **TLAS** covers the largest (loaded) area of a space/scene, coarsely splitting it up into "contains stuff" and "is empty", with the latter usually not being stored at all.

On the other end the **BLAS**, of which there exists as many as the "contains stuff"-areas do, is much finer than the TLAS. It will (preferably *very*) tightly fit the contained 'stuff', such that if a lookup/query enters it, chances are it'll hit something and finish/return.

The specifics of the TLAS/BLAS split, and exactly what the 'stuff' is that they contain, depends heavily on the use-case. For example, in a mostly entity-based engine, the TLAS commonly stores *instances of meshes*, which in turn refer/point to a pre-generated BLAS for the *unique mesh*.

{% info_notice() %}
For yet more fun, consider that it is possible for both the TLAS and BLAS to be internally split into their own TLAS and BLAS.
{% end %}

### Spatial Queries and Lookups

...
{{ stub_notice(kind="section") }}

{% todo_notice() %} Traces? {% end %}
{% todo_notice() %} Sweeps? {% end %}
{% todo_notice() %} Separating-Axis Theorem? {% end %}

---

## Implementations

...
{{ stub_notice(kind="section") }}

## References

{% todo_notice() %} Add references to non-wikipedia sources. {% end %}

- **Wikipedia Articles:**
  - [Bounding Volume](https://en.wikipedia.org/wiki/Bounding_volume)
  - [Intersection (geometry)](https://en.wikipedia.org/wiki/Intersection_(geometry))
  - [Collision Detection](https://en.wikipedia.org/wiki/Collision_detection)
  - [Big-O Notation](https://en.wikipedia.org/wiki/Big_O_notation)
  - [Space Complexity](https://en.wikipedia.org/wiki/Space_complexity)
  - [Space-Filling Curve](https://en.wikipedia.org/wiki/Space-filling_curve)
  - [Space Partitioning](https://en.wikipedia.org/wiki/Space_partitioning)
    - [Grid](https://en.wikipedia.org/wiki/Grid_(spatial_index))
    - [Z-Order Curve](https://en.wikipedia.org/wiki/Z-order_curve)
    - [Quadtree](https://en.wikipedia.org/wiki/Quadtree) and [Octree](https://en.wikipedia.org/wiki/Octree)
    - [Binary Space Partitioning](https://en.wikipedia.org/wiki/Binary_space_partitioning)
    - [Bounding Volume Hierarchy](https://en.wikipedia.org/wiki/Bounding_volume_hierarchy)
    - [K-D Tree](https://en.wikipedia.org/wiki/K-d_tree)
  - [Spatial Database](https://en.wikipedia.org/wiki/Spatial_database)
