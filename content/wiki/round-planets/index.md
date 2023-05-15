+++
title = "Planets"
description = "How to make planets out of voxels"
aliases = ["/wiki/planets"]
[taxonomies]
categories = ["gameplay"]
tags = ["planets", "math", "rendering"]
+++

Similar to the problem of map projection, creating planets shows a fundamental problem with voxels: As they are [regular grids](https://en.wikipedia.org/wiki/Regular_grid), shaping the actual grid into a planet, without distortions or discontinuities, is mathematically *impossible*. As such, we need to employ different methods depending on what we ultimately want to achieve.

<!-- more -->

Here are some considerations when choosing a method:

1. **Perpendicularity.**  
   Whether building on the surface will be perpendicular along the voxel grid.
2. **Distortion.**  
   A good approach should reduce distortion. How distortion is valued depends on the game. There are a few considerations with distortion:
    - Distortion at the centre of the planet.
    - Distortion very far away from the planet.
    - Distortion on the surface of the planet in specific areas,  
      such as poles and 'corners'.

---

The following sections show *some* of the possible solutions...

## Faked
One can fake the appearance of a spherical planet, by visually curving the rendered blocks 'downwards', the further away from the camera they are, creating the illusion of a sphere. The downside being, of course, that one cannot go to space and observe the planet as a whole.

## Naïve
A naïve approach is to generate the entire planet within a single enormous voxel grid; when rendering the voxels as smooth(-ish) surfaces, this causes no significant issues and can work rather well, as the game [Astroneer](https://astroneer.space/) shows.

For cube-like voxels on the other hand, parts of the map will become jagged, due to gravity pointing to the centre of the planet; this can and will create severe disorientation for the player, making for quite a terrible experience.

Example: [Creating Voxel Planet](https://hiteshkrsahu.medium.com/generating-voxel-planet-using-3d-simplex-noise-3ab011fd88ec).

{% info_notice() %}
While this method *is* called 'naïve', it is the *only* method that creates truly continuous planets, making the name quite the misnomer.
{% end %}

## Torus
By wrapping around/repeating the coordinates of a flat voxel grid in the cardinal directions (North/East/South/West), a torus-shaped planet is formed, creating the illusion of a planet.

While this does not create continuity issues, it is still a torus, meaning:

- Moving in a straight line along any cardinal direction, will put the player right back where they started.
- There are no poles.

## Plates / Pyramids
By creating a small-ish set of interlocked 'plates', shaped like [regular polygons](https://en.wikipedia.org/wiki/Regular_polygon), each being an independent voxel grid, all oriented outwards from a central point, a planet-like shape can be approximated.

While this does work well for cubic voxels, it has discontinuities at *all* plate intersections, across which one cannot build continuous structures.

The game [StarMade](https://www.star-made.org/) uses this method with it's unreleased 'universe update'; see [Video of Caves](https://drive.google.com/file/d/15TjUH68W4wEQ3GoMO0lCPyd3oMwxNzjQ/view?usp=sharing).

## Inflated Cube
The inflated cube consists of six independent voxel grids, one per face of the cube; by (visually) normalizing the planes, a very-close to sphere-like shape is created.

Although this approach creates distortions near the corners, it is a good approach for cube-shaped voxels; see for example: [Seed of Andromeda](https://www.youtube.com/watch?v=bJr4QlDxEME).

## See also
- [Coordinate Systems](/wiki/coordinate-systems)
