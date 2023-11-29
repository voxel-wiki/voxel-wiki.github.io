+++
title = "3D Raycasting"
description = "Traveling through 3D grids in a straight line."
path = "/wiki/raycasting"
[taxonomies]
categories = ["algorithms"]
tags = ["algorithm", "math", "raycasting", "raytracing"]
[extra]
chapters = true
chapter_prev = false
chapter_next = {text = "Raytracing", link = "/wiki/raytracing"}
+++

The [Digital Differential Analyzer](https://en.wikipedia.org/wiki/Digital_differential_analyzer_(graphics_algorithm)) (`DDA`) algorithm,
adapted to 3D, is *exactly* the thing one needs to travel along a line (or a ray) through a grid of voxels.

<!-- more -->

{{ stub_notice() }}

## Building Rays
With raycasting or raytracing, we need to construct a ray for each pixel on the screen, represented by the camera. The following implementation is based on [this library](https://github.com/dps/rust-raytracer/tree/main/raytracer). It should be noted, that this is mostly for demonstration pourposes, and its probably not going to be that fast in compareison to other ray generation algorithms.
```rs
use glam::Vec3; // https://docs.rs/glam/latest/glam/

#[derive(Clone, Copy)]
struct Camera
{
    eye: Vec3,
    target: Vec3,
    fov: f32,
}

#[derive(Clone, Copy)]
pub struct Ray 
{
    pub origin: Vec3,
    pub dir: Vec3
}

impl Ray 
{
    pub fn new(origin: Vec3, dir: Vec3) -> Self 
    {
        Self 
        { 
            origin, 
            dir
        }
    }
}

// `x` and `y` are the pixel indexes of the output image with x+ being right and y+ being up
// `width` and `height` are the width and height of the output image
fn create_ray(x: u32, y: u32, width: u32, height: u32, camera: Camera) -> Ray 
{
    let aspect = width as f32 / height as f32; // get the aspect ratio of the image
    let theta = camera.fov.to_radians();
    let half_height = (theta / 2.0).tan();
    let half_width = aspect * half_height;

    let w = (camera.eye - camera.target).normalize(); // the cameras forward direction
    let u = Vec3::Y.cross(w).normalize(); // the vector horizontal to the cameras view
    let v = w.cross(u); // the vector horizontal to the cameras view

    let origin = camera.eye;
    let lower_left_corner = origin - (u * half_width) - (v * half_height) - w;
    let horizontal = u * 2.0 * half_width;
    let vertical = v * 2.0 * half_height;

    let x = x as f32 / width as f32;
    let y = y as f32 / height as f32;
    let dir = (lower_left_corner + (horizontal * x) + (vertical * y) - origin).normalize();

    Ray 
    { 
        origin: camera.eye, 
        dir
    }
}
```
Here is an example of how you would use this function:
```rs
let camera = Camera {
  eye: Vec3::ZERO,
  target: Vec3::NEG_Z,
  fov: 60.0,
};

let mut image = ...;

for x in 0..image.width
{
  for y in 0..image.height
  {
    let ray = get_ray(x, y, image.width, image.height, camera);
    let color = some_object.intersect(ray);
    image[x][y] = color;
  }
}
```

## Intersecting Rays with Voxels

The following implementation was written in `GLSL`,
but should be simple enough to be ported to any language one may choose...

{{ embed_text(file="dda.glsl", lang="glsl") }}

## References

- [Wikipedia](https://en.wikipedia.org/wiki/Digital_differential_analyzer_(graphics_algorithm))
- Paper: [A Fast Voxel Traversal Algorithm for Ray Tracing (1987)](http://www.cse.yorku.ca/~amana/research/grid.pdf)
- [Voxel Rendering Using Discrete Ray Tracing](https://castingrays.blogspot.com/2014/01/voxel-rendering-using-discrete-ray.html)
- [Cast ray to select block in voxel game](https://gamedev.stackexchange.com/a/49423)
- [Lode's Raycasting Tutorial](https://lodev.org/cgtutor/raycasting.html)
- Various Implementations:
  - For [`C`](https://webdocs.cs.ualberta.ca/~graphics/books/GraphicsGems/gemsiv/vox_traverse.c)
  - For [`C++`](https://gist.github.com/garymacindoe/895430c1e53a6e50cb35)
  - For [`GLSL`](https://www.shadertoy.com/view/XddcWn):
    - [Branchless](https://www.shadertoy.com/view/4dX3zl)
    - [Branchless & Textured](https://www.shadertoy.com/view/7dK3D3)
    - [With Sub-Objects](https://www.shadertoy.com/view/7stXzn)
    - [Octree Variant](https://www.shadertoy.com/view/4sVfWw)
