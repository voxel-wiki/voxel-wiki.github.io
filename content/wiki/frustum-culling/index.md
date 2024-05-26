+++
title = "Frustum Culling"
description = "Removal of geometry that is outside the cameras view region."
[taxonomies]
categories = ["culling"]
tags = ["rendering", "culling", "optimization"]
+++

{{ stub_notice() }}

**Notes:**
- A [view frustum](https://en.wikipedia.org/wiki/Viewing_frustum) is defined as four-plus-two [planes](https://en.wikipedia.org/wiki/Euclidean_planes_in_three-dimensional_space) attached to a camera.
  - An inwards facing plane for each edge of the window/viewport.
    - Simply referred to as `top`, `right`, `bottom` and `left`.
    - Built from the cameras position and field-of-view.
  - A plane facing into the screen called the `near`-plane, at some close distance `depth_near`/`zNear`.
  - A plane facing the camera called the `far`-plane, at some far distance `depth_far`/`zFar`.
- Pieces of geometry (like meshes and chunks) have *bounding volumes*.
- Generally an *axis-aligned bounding box*, defined as a pair of `min` & `max` 3d vectors, is used.
- A [chunk](/wiki/chunking) of voxels has an *implicit* bounding-box that fully encases it.
- A chunk *may* have an explicit bounding-box encasing *only* the visible voxels.

## References

- [Learn OpenGL: Frustum Culling](https://learnopengl.com/Guest-Articles/2021/Scene/Frustum-Culling)
- [Frustum calculation and culling, HOPEFULLY demystified](http://davidlively.com/programming/graphics/frustum-calculation-and-culling-hopefully-demystified/)
- [View Frustum Culling Tutorial](https://cgvr.cs.uni-bremen.de/teaching/cg_literatur/lighthouse3d_view_frustum_culling/index.html) ([alt-link](http://www.lighthouse3d.com/tutorials/view-frustum-culling/))
- [Frustum Culling](https://bruop.github.io/frustum_culling/)
- [View-Frustum Culling Using Axis-Aligned Bounding-Boxes](https://medium.com/@ktstephano/view-frustum-culling-using-axis-aligned-bounding-boxes-23368881ce0f)
- [More (Robust) Frustum Culling](https://bruop.github.io/improved_frustum_culling/)
- [(AABB) CPU Side Frustum Culling](https://www.braynzarsoft.net/viewtutorial/q16390-34-aabb-cpu-side-frustum-culling)
