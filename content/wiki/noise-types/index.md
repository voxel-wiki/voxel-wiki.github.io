+++
title = "Types of Noise"
description = "Types of noise commonly used for procedural generation."
[taxonomies]
categories = ["procgen"]
tags = ["math", "noise", "sampling"]
+++

There are many types of noise one can use for procedural generation.

Types of noise that are good to use as-is:
- Simplex
- OpenSimplex(2)(S)
- [Cellular](https://thebookofshaders.com/12/)/Voronoi Noise

Other types of noise may require rotating the noise in a higher dimension (ex: for 2D noise, rotate in 3D) and then taking a slice out of it, to ensure that no *square bias* artifacts are visible:
- Perlin
- Value
- Value-Cubic

## Noise Composition

Using a single type of noise might be a bit *boring* so, usually, one combines multiple layers of noise through mathematical formulas.

Common ways to modify noise are:

- **Spline Mapping**, wherein the noise is passed trough a non-constant curve function.
- **Ridged Noise**, which is the flipped absolute value of noise (`1 - abs(v)`).
- **Billow Noise**, which is simply the absolute value (`abs(v)`) of the output.
- **Flat Middle Noise**; `smoothstep( ℝ>0 , ℝ<1 , v)`.
- **Fractal Brownian Motion**, which is... [a bit more complicated](https://thebookofshaders.com/13/).
- **Domain Warping**: the warping of noise coordinates with more noise -- perhaps a specialized vector-outputting implementation.

## References

- [https://thebookofshaders.com/11/](https://thebookofshaders.com/11/)
- [https://www.bit-101.com/blog/2021/07/perlin-vs-simplex/](https://www.bit-101.com/blog/2021/07/perlin-vs-simplex/)
- [OpenSimplex2](https://github.com/KdotJPG/OpenSimplex2) Library
- [FastNoise2 (`C++`)](https://github.com/Auburn/FastNoise2) Library
- [psrdnoise (`GLSL`)](https://github.com/stegu/psrdnoise/) Library
