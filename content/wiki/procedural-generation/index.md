+++
title = "Procedural Generation"
description = "Automated generation of content."
aliases = ["/wiki/procgen"]
[taxonomies]
categories = ["procgen"]
tags = ["procgen", "design", "gamedev"]
+++

If you are designing a large world, chances are that you will have to offload work to the computer...

### Noise

{% figure(class="float", caption="From Wikipedia; License is CC-BY-2.0") %}[![Pink/Red Liquid using Perlin Noise](https://upload.wikimedia.org/wikipedia/commons/9/9a/Pink_red_liquid_using_perlin_noise_%2B_bump_%2B_coloring_%282415197699%29.png)](https://en.wikipedia.org/wiki/File:Pink_red_liquid_using_perlin_noise_%2B_bump_%2B_coloring_(2415197699).png){% end %}

The most common and useful approach when procedurally generating *anything*, is to use **noise**: randomly generated numbers.

Of course, purely random numbers are kind of useless to us,
as we need to be able to test things (i.e.: [reproducibility](https://en.wikipedia.org/wiki/Reproducibility)),
so we tend to use **[Pseudorandom Number Generators](https://en.wikipedia.org/wiki/Pseudorandom_number_generator)**
that take some kind of *seed* and give us *seemingly random* numbers in return.

Noise can be used in many, *many*, ***many*** ways, such as...

- Generating textures from scratch
- Generating terrain by interpreting noise as height
- Generating terrain via voxel density volumes
- Creating interesting visual effects
- Enhancing existing textures with graininess;  
  e.g to make it look old/used/worn.
- etc. etc.

That said, all uses of noise begin with a *noise function*,
which is a function that accepts some sort of *position*,
with one-or-more dimensions, and returns a *sample*,
a number in the range `[-1, +1]`.

We call this _sampling the noise function_.

{% info_notice() %}**Note:**<br>While most libraries return numbers in the `[-1, +1]`-range, some may use the `[0, +1]`-range, or something else entirely even; read the documentation, or code, to make sure! {% end %}

<!--
* The individual noise values are interpreted in various ways,
  * Such as interpreting the random noise values as colors.
    * Either by combining 3 black-and-white single-valued noise textures into an RGB triplet for each pixel,
    * Or by using a **transfer function**, which is an arbitrary function that interprets a number to a color. A simple transfer function can be a simple 1D texture that maps a number (such as the random number in the noise texture) to a color.
  * Or interpreted as heights (in a heightmap),
  * Or interpreted as _densities_ or _distances_ or something similar, in voxel volumes, depending on the volume type combined with the rendering method used.
-->

Now with all that out of the way, let's proceed to the actual **noise functions**!

#### White Noise & Value Noise

{% figure(class="float", caption="White Noise, from Wikipedia") %}[![White Noise](https://upload.wikimedia.org/wikipedia/commons/3/30/256x256_Dissolve_Noise_Texture.png)](https://commons.wikimedia.org/wiki/File:256x256_Dissolve_Noise_Texture.png){% end %}

If you have ever seen a Television that receives it's video as [analog signals](https://en.wikipedia.org/wiki/Analog_signal)
via an antenna, you *might* have seen what happens when the antenna isn't receiving anything: The screen becomes a sea of [noise](https://en.wikipedia.org/wiki/Noise_(video)); commonly referred to as **white noise**.

**White noise** by itself is completely random, with no discernible patterns between/across the samples, which isn't really useful by itself.

However, take that very noise and scale it up/zoom into it, [linearly interpolating](https://en.wikipedia.org/wiki/Linear_interpolation) between the individual samples, and it will begin to resemble something more interesting: **value noise**.

<!-- Linear interpolation produces a poorer resulting texture, so alternatively, there is the option of **cubic value noise**, which uses **cubic interpolation**. -->

Unfortunately, while value noise tends to be extremely fast to generate, it's *quality* isn't particularly great due to *linear artifacts*. When used for terrain generation, these artifacts will cause strange patterns to emerge, which is absolutely *not* what one wants, so we will have to find something better than value noise...

#### Perlin Noise

{% figure(class="float", caption="Perlin Noise, from Wikipedia") %}[![White Noise](https://upload.wikimedia.org/wikipedia/commons/8/88/Perlin_noise_example.png)](https://commons.wikimedia.org/wiki/File:Perlin_noise_example.png){% end %}

Now, again, **value noise** is extremely simple and fast to generate, but unfortunately has linear artifacts... which is where **[Perlin noise](https://en.wikipedia.org/wiki/Perlin_noise)** comes in!

Invented in the early 1980s by [Ken Perlin](https://en.wikipedia.org/wiki/Ken_Perlin), Perlin noise improves on value noise by interpolating between randomly generated *gradients* on a grid, instead of plain random values.

{% info_notice() %}Explaining the exact algorithm is, (un)fortunately, out-of-scope for this article; since there are *many* implementations of it, finding one should not be a problem.{% end %}

<!--
  * So, instead of generating random pixels, Ken generated random vectors on a grid. Vectors are arrows with a magnitude (arrow length).
  * He placed each random arrow on a corner in the grid, and treated them as black-and-white gradients.
  * Then, for any pixel inside a grid box, he interpolated between the 4 surrounding gradients to get the final color.
  * ... (what am I missing?)
  * This reduced some of the linear artifacts.
-->

#### Simplex Noise

Now, is Perlin noise perfect? Sadly, no:
It too has artifacts, caused by the sampling being done on a regular grid,
making values appear to be axis-aligned and/or biased on the diagonal.

<!--There are two ways to fix this issue: Either by *rotating the domain* or using a *different noise algorithm*.
We will cover the latter here.-->

Thankfully, Ken Perlin noticed the issue circa 2001 and remedied this by coming up with **simplex noise**.

The solution is surprisingly simple: Instead of sampling and interpolating the random numbers in a *square* grid, he used a *triangular* ('simplex') grid, which has several advantages:

1. The artifacts are no longer *visible*, due to the grid of pixels no longer being aligned with the grid of gradient positions.
2. A triangle is the smallest polygon enclosing an area of two dimensional (or higher) space,
   so the algorithm only needs to evaluate and interpolate between *three* corners,
   instead of *four*, which is much faster!
3. The algorithm can be extended into higher dimensions (3D, 4D, 5D, and higher!),
   without having to evaluate exponentially more corners, unlike Perlin noise,
   making it *even faster* in this case!

{% info_notice() %}
If you are interested in the inner workings and actual reasons behind these artifacts,
we *highly recommend* reading KdotJPG's excellent blog post [The Perlin Problem: Moving Past Square Noise](https://noiseposti.ng/posts/2022-01-16-The-Perlin-Problem-Moving-Past-Square-Noise.html) for more!
{% end %}

Due to patent shenanigans, simplex noise was not possible to freely implement for quite some time,
leading to the creation of **open simplex noise**. Thankfully, the patent has run out, so go forth and code!

## References

{{ todo_notice(body="Add more references.") }}

### Noise Libraries

Writing correct noise-generating code can be quite hard, so it is generally recommended to try using a library first...

* **[libnoise](https://libnoise.sourceforge.net)**  
  [Great documentation](https://libnoise.sourceforge.net/glossary/index.html), but quite old, slow and licensed under LGPL, which is a no-go for most projects.
  Notable because it has the best documentation for organizing/conceptualizing noise primitives and various operations on noise, so it's a good idea to browse through the [various modules](https://libnoise.sourceforge.net/docs/modules.html).
* **[OpenSimplex2](https://github.com/KdotJPG/OpenSimplex2)**  
  Various improvements over Perlin Noise and under a CC0 license.
* **[FastNoiseLite](https://github.com/Auburn/FastNoiseLite)**  
  Fast noise generation with implementations in several languages, several kinds of noise and a GUI to preview noise.
* **[FastNoise2](https://github.com/Auburn/FastNoise2)**  
  Newer version of *FastNoiseLite*, by the same author, written entirely in C++. One of the, if not *the*, fastest noise generation libraries.

### Explainer Videos

* [Value Noise Explained!](https://www.youtube.com/watch?v=zXsWftRdsvU)
* [How to turn a few Numbers into Worlds (Perlin Noise)](https://www.youtube.com/watch?v=ZsEnnB2wrbI)
* [The Absurd Usefulness of Noise in Game Development](https://www.youtube.com/watch?v=sChQCdbLdHE)
* ...
