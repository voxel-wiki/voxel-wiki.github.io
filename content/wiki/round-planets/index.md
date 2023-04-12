+++
title = "Round Planets"
description = "Solutions to the round planet problem"
aliases = ["/wiki/planets"]
[taxonomies]
categories = ["planets"]
tags = ["planets"]
+++

Similar to the problem of map projection, the formation of round planets provides a fundamental problem to many voxel engines. This page lists several approaches available. There are also several considerations when choosing a method:
1. **Perpendicularity.** Whether building on the surface will be perpendicular along the voxel grid.
2. **Distortion.** A good approach should reduce distortion. How distortion is valued depends on the game. There are a few considerations with distortion:
    - Distortion at the centre of the planet.
    - Distortion very far away from the planet.
    - Distortion on the surface of the planet in specific areas.

## Approaches

This is a list of several approaches.
- **Naive.** A naive approach is to generate the planet within a simple Euclidean voxel grid. For smooth meshes of voxel, this may not provide a significant issue. Although, for cube-like voxels, parts of the map may become jagged, and the gravity experienced by the player may be disorientating. Example: [Creating Voxel Planet](https://hiteshkrsahu.medium.com/generating-voxel-planet-using-3d-simplex-noise-3ab011fd88ec).
- **Inflated Cube.** The inflated cube considers 6 planes for the voxel grid. Each plane is normalised into a sphere-like shape. This approach creates distortions near the corners, although, may be an appropriate approach for smooth voxels. (see [Seeds of Andromeda](https://www.youtube.com/watch?v=bJr4QlDxEME)).
- **Torus.** The torus shape behaves similarly to a cube. Moving in each cardinal direction will put the player where they started.
- **Plates.** This approach forms several "plates" corresponding to an independent voxel grid. This approach works well for cubic voxels, although has distortion at the intersection of the plates. Within the plates there is no distortion, or perpendicularity issues. This approach is utilised in the game StarMade, with the unreleased universe update improving the method (see [Video of Caves](https://drive.google.com/file/d/15TjUH68W4wEQ3GoMO0lCPyd3oMwxNzjQ/view?usp=sharing)).
- **Faked.** For a normal voxel grid, the appearance of a sphere planet can be "faked" by curving the rendered blocks.

## See also
- [Coordinate Systems](/wiki/coordinate-systems)