+++
title = "3D Raycasting"
description = "Traveling through 3D grids in a straight line."
path = "/wiki/raycasting"
# aliases = ["/wiki/dda", "/wiki/amanatides-woo", "/wiki/bresenham"]
[taxonomies]
categories = ["algorithms"]
tags = ["algorithms", "math", "raycasting", "raytracing"]
[extra]
chapters = true
chapter_prev = false
chapter_next = {text = "Raytracing", link = "/wiki/raytracing"}
+++

The **Amanatides-Woo Algorithm**,
is *exactly* the thing one needs to travel along a line (or a ray) through a grid of voxels...

<!-- more -->

## Theory

{{ stub_notice(kind="section") }}

## Pseudocode

{{ todo_notice(body="Explain???") }}

```rust
// The algorithm works in any dimension,
// so lets define N-dimensional vectors!
type  Array<T,N> = T[N];
type Vector<T,N> = Array<T, N> as {X,Y,Z,W,..};
type  vecN = Vector<number, N>;
type ivecN = Vector<integer, N>;
type bvecN = Vector<boolean, N>;
type  dirN = Vector<(-1.0 .. +1.0), N>;
type idirN = Vector<(-1 | 0 | +1), N>;

// The necessary constants and variables
// for the Amanatides-Woo Algorithm to work.
struct amanatides_woo_state {
  // These will stay constant:
  const ray_origin:     vecN,
  const ray_direction:  vecN,
  const diff_boundary:  vecN,
  const diff_voxelpos: ivecN,
  // These will change each step:
  next_voxelpos:     ivecN,
  next_boundary:      vecN,
  max_boundary_mask: bvecN,
};

// Initializes the constants and variables necessary
// for the Amanatides-Woo Algorithm to work.
fn amanatides_woo_init(
  ray_origin: vecN,
  ray_direction: vecN
) -> amanatides_woo_state {
  // Figure out which voxel we are in...
  let ray_origin_grid:    vecN = ray_origin.floor();
  let ray_origin_grid_i: ivecN = ray_origin.floor() as ivecN;
  // ^ each component is rounded down to an integer.
  // ^ needed both as floats and integers.
  
  // ...and where within that:
  let ray_in_cell_pos: vecN = ray_origin_grid - ray_origin;
  // ^ each component is in range: 0.0 .. 1.0
  
  // Ensure ray direction has no `0` components...
  ray_direction = ray_direction.signed_max(EPSILON);
  // for COMP in VECTOR:
  //   if (COMP == +0) COMP = +EPSILON
  //   if (COMP == -0) COMP = -EPSILON
  
  // ...then make sure it's still normalized.
  ray_direction = ray_direction.normalize();
  
  // Get the inverse of the ray direction...
  let ray_dir_inv:   vecN = 1.0 / ray_direction;
  // ^ This is why the components MUST NOT be zero!
  
  // ...which gives the boundary differential:
  let diff_boundary: vecN = ray_dir_inv.abs();
  // ^ each component is in range: 0.0 .. 1.0
  
  // Get the signs of the rays direction...
  let ray_sign:      vecN = ray_direction.signum();
  // ^ each component is one of: -1.0 | 0.0 | +1.0
  
  // ...which gives the voxelpos differential:
  let diff_voxelpos: ivecN = ray_sign as ivecN;
  // ^ each component is one of: -1 | 0 | +1
  
  // Finally, calculate the current/next boundary...
  let next_boundary := (
    (ray_sign * ray_in_cell_pos)
    + (ray_sign * 0.5)
    + 0.5
  ) * diff_boundary;
  
  // ...then bundle up and return!
  return amanatides_woo_state {
    ray_origin,
    ray_direction,
    diff_boundary,
    diff_voxelpos,
    next_voxelpos: ray_origin_grid as ivecN,
    next_boundary,
    max_boundary_mask: bvecN(false),
  };
}

// Perform a single step of the algorithm,
// returning some hit information.
fn amanatides_woo_step(self: &mut amanatides_woo_state) -> ... {
  // --- To perform a step we...
  
  // ...determine which boundary component is the largest...
  self.max_boundary_mask = self.next_boundary.pick_maximum_component();
  // ^ largest component is TRUE, all others FALSE; i.e.:
  // IF (X > Y) && (X > Z): bvec(TRUE,FALSE,FALSE)
  // IF (Y > X) && (Y > Z): bvec(FALSE,TRUE,FALSE)
  // IF (Z > X) && (Z > Y): bvec(FALSE,FALSE,TRUE)
  // ^ requires that no component is zero or infinite.
  
  // ...and use that as multiplicative mask,
  // to add the differentials to the next boundary and voxelpos,
  // giving us the current boundary and voxelpos.
  self.next_boundary += self.diff_boundary * self.max_boundary_mask;
  self.next_voxelpos += self.diff_voxelpos * self.max_boundary_mask;
  
  // --- ...that's it, step complete!
  
  // Now, to get the distance to the current hit,
  // we get the 'current' boundary, which is at `NEXT - DIFF`,
  // multiplied by our current mask of the largest component...
  let hit_boundary = (self.next_boundary - self.diff_boundary) * self.max_boundary_mask;
  
  // ...then just sum/add the resulting components together.
  // (which is the same as picking its only non-zero component)
  let hit_distance = hit_boundary.element_sum();
  
  // To get the exact *global* position of the hit,
  // just mul-add with the ray as per usual:
  let hit_position = self.ray_origin + (self.ray_direction * hit_distance);
  
  // ...and/or, if you need the position of the hit voxel:
  let hit_voxelpos = self.next_voxelpos.copy();
  
  // To get the direction/face of the hit,
  // multiply the negated voxelpos differential by the largest component mask:
  let hit_direction = (self.diff_voxelpos.negate() as vecN) * self.max_boundary_mask;
  
  // ...and finally, to get the *local* position of the hit,
  // subtract the current voxelpos from the global hit position:
  let hit_localpos = hit_position - (hit_voxelpos as vecN);
  
  return {
    hit_distance: number,// Distance to hit.
    hit_position:  vecN, // Position of hit.
    hit_voxelpos: ivecN, // Voxel that was hit...
    hit_localpos:  vecN, // ...where it was locally hit.
    hit_direction: vecN, // ...which face of it was hit.
  }
}

fn MY_GAME_UPDATE() {
  // Get player data, somehow...
  let player_position: vecN = ...;
  let player_rotation: quat = ...;
  
  // Calculate camera position and direction...
  let camera_position:  vecN = player_position + EYE_OFFSET;
  let camera_direction: vecN = player_rotation * EYE_FORWARD_DIR;
  
  // Initialize the algorithms ray/voxel iterator...
  let awa_iterator = amanatides_woo_init(
    camera_position,
    camera_direction
  );
  
  // ...and start walking!
  loop {
    let hit = amanatides_woo_step(&mut awa_iterator);
    if (WORLD_GET_VOXEL_AT(hit.hit_voxelpos).is_solid()) {
      // Do whatever you want here with the hit info.
      // Just don't forget to break the loop!
      break;
    }
  }
}

```

## Implementation

{{ stub_notice(kind="section") }}
{{ todo_notice(body="Expand pseudocode into actual code here?") }}
{{ todo_notice(body="Provide implementation for multiple languages?") }}

## References

- [A Fast Voxel Traversal Algorithm for Ray Tracing (1987).pdf](http://www.cse.yorku.ca/~amana/research/grid.pdf)
- [Wikipedia: DDA Algorithm](https://en.wikipedia.org/wiki/Digital_differential_analyzer_(graphics_algorithm))
- [Wikipedia: Bresenhams Algorithm](https://en.wikipedia.org/wiki/Bresenham%27s_line_algorithm)
- [Voxel Rendering Using Discrete Ray Tracing](https://castingrays.blogspot.com/2014/01/voxel-rendering-using-discrete-ray.html)
- [Cast ray to select block in voxel game](https://gamedev.stackexchange.com/a/49423)
- [Lode's Raycasting Tutorial](https://lodev.org/cgtutor/raycasting.html)
- Various Implementations:
  - For [`C`](https://web.archive.org/web/20111007033849/https://webdocs.cs.ualberta.ca/~graphics/books/GraphicsGems/gemsiv/vox_traverse.c)
  - For [`C++`](https://gist.github.com/garymacindoe/895430c1e53a6e50cb35)
  - For [`C#`](https://web.archive.org/web/20121024081332/www.xnawiki.com/index.php?title=Voxel_traversal)
  - For [`Rust`](https://github.com/bitshifter/glam-rs/discussions/564)
  - For [`GLSL`](https://www.shadertoy.com/view/XddcWn):
    - [Branchless](https://www.shadertoy.com/view/4dX3zl)
    - [Branchless & Textured](https://www.shadertoy.com/view/7dK3D3)
    - [With Sub-Objects](https://www.shadertoy.com/view/7stXzn)
    - [Octree Variant](https://www.shadertoy.com/view/4sVfWw)
