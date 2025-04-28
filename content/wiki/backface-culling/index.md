+++
title = "Back Face Culling"
description = "Removal of geometry not facing the camera."
[taxonomies]
categories = ["culling"]
tags = ["rendering", "culling", "optimization"]
+++

> Removal of geometry not facing the camera.

{{ stub_notice() }}

**Notes:**

- Faces have a *winding order*:
  - Clockwise
  - Counter-Clockwise
- Faces have a *surface normal*.
- Cameras have a *view direction*.
- The dot-product of a surface-normal and view-direction indicates
  if a face is facing the camera, or not.
- GPU rasterizers have built-in back-face culling.
- Vertices (and thus faces) can be *discarded*,
  by setting them to `NaN` in the vertex shader.

## References

- [Wikipedia: Back-Face Culling](https://en.wikipedia.org/wiki/Back-face_culling)
- [OpenGL Wiki: (Back)Face Culling](https://www.khronos.org/opengl/wiki/Face_Culling)
- [LearnOpenGL: (Back)Face Culling](https://learnopengl.com/Advanced-OpenGL/Face-culling)
- [Fine-grained Backface Culling by *zeux*](https://zeux.io/2023/04/28/triangle-backface-culling/)
- [Back Face Culling by *jonshiach*](https://jonshiach.github.io/graphics-book/files/4.3_Backface_culling.html)
- [Back Face Culling by *karan*](https://www.dgp.toronto.edu/~karan/courses/csc418/fall_2002/notes/cull.html)
