+++
title = "Types of Noise"
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

Using a single type of noise might be a bit *boring* so, usually, one takes one (or more!) type(s) of noise and uses that as input for another function, to modify and compose it with *even more* noise.

Common ways to modify noise are:

- **Ridged Noise**, where one takes the absolute value (`abs(v)`) of the output.
- **Billowy Noise**, which is the opposite of ridged noise (`1 - abs(v)`).
- **Flat Middle Noise**; `smoothstep( ℝ>0 , ℝ<1 , v)`.
- **Fractal Brownian Motion**, which is... [a bit more complicated](https://thebookofshaders.com/13/).
- ...

## References

- [https://thebookofshaders.com/11/](https://thebookofshaders.com/11/)
- [https://eev.ee/blog/2016/05/29/perlin-noise/](https://eev.ee/blog/2016/05/29/perlin-noise/)
- [https://github.com/KdotJPG/OpenSimplex2](https://github.com/KdotJPG/OpenSimplex2)
- [https://github.com/Auburn/FastNoise2](https://github.com/Auburn/FastNoise2)
