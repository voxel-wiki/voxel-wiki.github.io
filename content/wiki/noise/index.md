+++
title = "Noise"
description = "Fields of pseudorandom numbers."
aliases = ["/wiki/noise", "/wiki/noise-types"]
[taxonomies]
categories = ["procedural-generation", "math"]
tags = ["procedural-generation", "design", "math", "noise"]
+++

{% figure(id="fig-1", class="float", caption="Pink/Red Liquid using Perlin Noise", author="[Simon Strandgaard](https://www.flickr.com/people/12739382@N04)", license="[CC-BY-2.0](https://en.wikipedia.org/wiki/File:Pink_red_liquid_using_perlin_noise_%2B_bump_%2B_coloring_(2415197699).png)") %}https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Pink_red_liquid_using_perlin_noise_%2B_bump_%2B_coloring_%282415197699%29.png/240px-Pink_red_liquid_using_perlin_noise_%2B_bump_%2B_coloring_%282415197699%29.png{% end %}

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
- And so, *so*, *much*, ***more***...  
  <small>Seriously, we couldn't list them, even if we tried!</small>

Noise-based generation generally happens via a **noise pipeline**, consisting of three parts:

- An initial [noise function](#noise-functions).
- Any number of [noise operations](#noise-operations).
- Final [noise interpretation](#noise-interpretation).

{% info_notice() %}
This is just a *basic framework* to get the concept across;
it can be changed and extended in a variety of ways once understood.
<br>There are no hard rules... be creative!
{% end %}

## Noise Functions

All uses of noise begin with a **noise function**.

That is, a function taking an ℕ-dimensional **sample position**
and returning a **noise sample** in the `[-1, +1]`-range.

```rust
/// An abstract noise function.
/// 
/// - Takes a position.
/// - Returns a number.
/// - May contain math.
/// - A *lot* of math.
fn noise(position: Vecℕ) -> f32;
```

Calling such a function means **to sample the noise function**.

{% info_notice(id="number-ranges") %}
**A note on number ranges:**

While most libraries return numbers in the `[-1, +1]`-range, some may use the `[0, +1]`-range, or something else entirely even; read the documentation, or code, to make sure!

Thankfully, conversions are usually rather easy; for example:

- To turn `[0, +1]` into `[-1, +1]`:  
  Multiply by two and subtract one: `v * 2 - 1`

- To turn `[-1, +1]` into `[0, +1]`:  
  Add one and divide by two: `(v + 1) / 2`  
  <small>Mind the parenthesis!</small>
{% end %}

Now with that preface out of the way, let's proceed to the actual **noise functions**!

### White Noise & Value Noise

{% figure(class="float", caption="White Noise", author="Spamrakuen", license="[CC0](https://commons.wikimedia.org/wiki/File:256x256_Dissolve_Noise_Texture.png)") %}https://upload.wikimedia.org/wikipedia/commons/3/30/256x256_Dissolve_Noise_Texture.png{% end %}

If you have ever seen a Television that receives it's video as [analog signals](https://en.wikipedia.org/wiki/Analog_signal)
via an antenna, you *might* have seen what happens when the antenna isn't receiving anything: The screen becomes a sea of [noise](https://en.wikipedia.org/wiki/Noise_(video)); commonly referred to as **white noise**.

**White noise** by itself is completely random, with no discernible patterns between/across the samples, which isn't really useful by itself.

However, take that very noise and scale it up/zoom into it, [linearly interpolating](https://en.wikipedia.org/wiki/Linear_interpolation) between the individual samples, and it will begin to resemble something much more interesting: **value noise**.

<!--{% info_notice() %}
Linear interpolation produces a texture of poor quality; so alternatively, there is the option of **cubic value noise**, which uses **cubic interpolation**.
{% end %}-->

Unfortunately, while value noise tends to be ludicrously fast to generate, it's *quality* isn't particularly great due to *linear artifacts*. When used for terrain generation, these artifacts will cause strange patterns to emerge, which is absolutely *not* what one wants, so we will have to find something better than value noise...

### Perlin Noise

{% figure(class="float", caption="Perlin Noise", author="[Lord Belbury](https://commons.wikimedia.org/wiki/User:Lord_Belbury)", license="[CC0](https://commons.wikimedia.org/wiki/File:Perlin_noise_example.png)") %}https://upload.wikimedia.org/wikipedia/commons/8/88/Perlin_noise_example.png{% end %}

Now, again, **value noise** is extremely simple and fast to generate, but unfortunately has linear artifacts... which is where **[Perlin noise](https://en.wikipedia.org/wiki/Perlin_noise)** comes in!

Invented in the early 1980s by [Ken Perlin](https://en.wikipedia.org/wiki/Ken_Perlin), Perlin noise improves on value noise by interpolating between randomly generated *gradients* on a grid, instead of plain random values.

<div style="clear:both"></div>

{% info_notice() %}
Explaining the exact algorithm is, (un)fortunately, out-of-scope for this article;
since there are [*many*](https://github.com/topics/perlin) implementations of it, finding one should not be a problem.
{% end %}

<!--
  * So, instead of generating random pixels, Ken generated random vectors on a grid. Vectors are arrows with a magnitude (arrow length).
  * He placed each random arrow on a corner in the grid, and treated them as black-and-white gradients.
  * Then, for any pixel inside a grid box, he interpolated between the 4 surrounding gradients to get the final color.
  * ... (what am I missing?)
  * This reduced some of the linear artifacts.
-->

The 'blobby' nature of Perlin already makes it perfect for many use cases, though if one looks closely there appear to be... straight lines? Let's keep going!

### Simplex Noise

Now, is Perlin noise perfect? Sadly, no:
It too has artifacts, caused by the sampling being done on a regular grid,
making values appear to be axis-aligned and/or biased on the diagonal.

This is visible in the top left of the previous example image as a straight 'hill'.

{% info_notice(id="artifacts") %}
If you are interested in the inner workings and actual reasons behind these artifacts,
we *highly recommend* reading KdotJPG's excellent blog post [The Perlin Problem: Moving Past Square Noise](https://noiseposti.ng/posts/2022-01-16-The-Perlin-Problem-Moving-Past-Square-Noise.html) for more!
{% end %}

<!--There are two ways to fix this issue: Either by *rotating the domain* or using a *different noise algorithm*.
We will cover the latter here.-->

Thankfully, Ken Perlin noticed the issue circa 2001 and remedied this by coming up with a new noise function: **simplex noise**!

The solution is surprisingly simple: Instead of sampling and interpolating the random numbers in a *square* grid, he used a *triangular* ('simplex') grid, which has several advantages:

1. The artifacts are no longer *visible*, due to the grid of pixels no longer being aligned with the grid of gradient positions.
2. A triangle is the smallest polygon enclosing an area of two dimensional (or higher) space,
   so the algorithm only needs to evaluate and interpolate between *three* corners,
   instead of *four*, which is much faster!
3. The algorithm can be extended into higher dimensions (3D, 4D, 5D, and higher!),
   without having to evaluate exponentially more corners, unlike Perlin noise,
   making it *even faster* in this case!

Due to patent shenanigans, simplex noise was not possible to freely implement for quite some time,
leading to the creation of **open simplex noise**. Thankfully, the patent has run out, so go forth and code!

### Cellular Noise

<small>[The book of shaders](https://thebookofshaders.com/12/) has an *awesome* article for this one.</small>

Yet another method to generate noise is **Cellular Noise** (also called *Voronoi Noise*, or *Voronoise*),
which has the benefit of being incredibly simple:

- Have an imaginary grid of cells, with a point in every cell.
- Each point has a pseudo-random value and position in its cell.
- The random generator uses the cells index/coordinate as seed.
- To then sample the noise at some location:
  - Figure out which cell the sample location is in.
  - Loop over neighbouring cells <small>(3 in 1D, 9 in 2D, 27 in 3D, ...)</small>.
  - Find the cell whose point is the closest to the sample location.
  - Use that closest points distance and/or value.

---

With that we have seen enough noise functions, for now... on to noise operations!

## Noise Operations

{% info_notice() %}
This section uses the definitions/concepts of the [libnoise](https://libnoise.sourceforge.net) library.
{% end %}

Since using a single type of noise might be just a smidge boring,
one usually combines multiple layers of noise through various **noise operators**.

Noise operators are functions that accept **noise modules** (which are noise-functions *and -operators*), creating new noise modules from them. This allows for the creation of *much* more complex/detailed noise.

They are split into these four categories:

- [**Modifiers**](#modifier-operations)
  change the output of a noise module.

- [**Combiners**](#combiner-operations)
  mix the output of several noise modules.

- [**Selectors**](#selector-operations)
  mix the output of several noise modules,  
  controlled by *another* noise module.

- [**Transformers**](#transformer-operations)
  work with the **sample positions** going *into* the modules.

### Modifier Operations
<!-- Unary operations, like abs() can be run on the noise. -->

Even with just one noise sample, we can do *many* things... for example:

- **Shift** its value range by adding/subtracting.
- **Multiply** it to scale its amplitude.
- Change its **slope** with `pow(v, …)`.
- Make it **billow** by removing the sign (`abs(v)`).
- Make it **ridged** by doing the same and flipping (`1-abs(v)`).
- **Flatten its middle** via `smoothstep( ℝ>0 , ℝ<1 , v)`.
- Put it through a **spline** or **easing function**.
- **Convert** it to other [number ranges](#number-ranges).
- etc. etc.

Here is an example of a *cubic easing modifier*, written in Rust:

```rust
// Assuming we already have a noise function...
// - `p` is the *sample position*
// - `v` is the *noise sample*, here in the [-1, +1]-range
let mut v: f32 = noise(p);

// With help from <https://github.com/prideout/par/blob/master/par_easings.h>,
// let's apply a cubic-easing function to our noise sample!

// This one takes values in the [0, +1]-range...
fn ease_cubic(mut t: f32, b: f32, c: f32, d: f32) {
  t /= d / 2.0;
  if t < 1.0 {
    return c / 2.0 * t * t * t + b;
  }
  
  t -= 2.0;
  return c / 2 * (t * t * t + 2) + b;
}

// ...so we first have to convert our sample from [-1, +1] to [0, +1]...
v = (v + 1.0) / 2.0;

// ...and then we can apply the function!
v = ease_cubic(v, 0, 1, 1);
```

You *might* notice that we did not define what the sample position `p` is, or where the result goes... and this is on purpose!

Modifiers are *independent* of each other, so you can mix-and-match them however you like; there are no limits to your creativity here!

{{ stub_notice(kind="section") }}

### Combiner Operations
<!-- Binary operation: Noise can be combined with other noise, in a binary operation, like addition, subtraction, multiplication etc. -->

{{ stub_notice(kind="section") }}

### Selector Operations
<!-- Selection: You can generate multiple noise textures of wildly different looks, and use a 3rd noise texture to select between them. For example, for each pixel in the **selector**, any noise value higher than 0, might mean to select from the first texture, and any noise value lower than 0 might mean to select from the second. -->

{{ stub_notice(kind="section") }}

### Transformer Operations
<!-- Noise can be zoomed in; this usually changes the **frequency** of the noise.
  * More zoom => lower frequency. Frequency here roughly means "detail". High frequency noise has a lot of sharp edges and detail. Low frequency noise is blurred, smoothly varying. -->

**Transformer operations** are applied to sample positions *before* they're passed into a noise-function:

```pseudocode
let sample_value = noise_function(
  TRANSFORM( sample_position )
);
```

Transformations can be as simple as:

- Adding to a position, shifting the noise function.
- Multiplying a position by a constant, changing the noise frequency / zooming in or out.
- Rotating the position, to break up possible [artifacts in the noise](#artifacts).

#### Domain Warping

But the transformations can also be controlled by *yet more noise*, which brings us to **domain warping**:

By sampling a different noise function and using its sampled values to apply a transformation operation (the *warp*), like adding or multiplying, to the position input (the *domain*) of a second noise function... quite interesting patterns can emerge, as can be seen in [the first image](#fig-1).

### Field Operations
<!-- Operations that work on *fields* of noise samples, instead of individual samples.

- **Caching** takes the output *field* of a noise function and stores it.
- **Subsampling** takes a cached field and samples from within it.-->

{{ stub_notice(kind="section") }}







## Noise Interpretation

<!--
* The individual noise values are interpreted in various ways,
  * Such as interpreting the random noise values as colors.
    * Either by combining 3 black-and-white single-valued noise textures into an RGB triplet for each pixel,
    * Or by using a **transfer function**, which is an arbitrary function that interprets a number to a color. A simple transfer function can be a simple 1D texture that maps a number (such as the random number in the noise texture) to a color.
  * Or interpreted as heights (in a heightmap),
  * Or interpreted as _densities_ or _distances_ or something similar, in voxel volumes, depending on the volume type combined with the rendering method used.
-->

Once you've obtained a final value from your noise evaluation, you will need to **interpret** it.

Usually this means either putting the sample through a [**transfer function**](#transfer-function), [**thresholding**](#thresholding) it or using it directly as-is.

{{ stub_notice(kind="section") }}

### Transfer Function

{{ stub_notice(kind="section") }}

### Thresholding

{{ stub_notice(kind="section") }}




<!--
## Designing Noise

Noise is very hard to shape to the way you envision it. Therefore, it might be useful to use an existing UI or make your UI to quickly see what the noise looks like and iterate.


### Fractal Brownian Motion
You can add an interesting amount of detail to a noise texture, by zooming into it to varying levels, and then combining the levels. Each zoomed noise texture is called an **octave**. Typically, you'd zoom in powers of 2, so 1x zoom for the original sampling of the noise function, 2x zoom-out for the second octave, 4x zoom-out for the third octave, and so on. Typically, you'd also temper the higher frequency (zoomed-out, higher detail) octaves by scaling down their values by the same amount that it was zoomed out. This technique is called fractal Brownian motion or `fBm`.

{{ stub_notice(kind="section") }}

### Large Terrain: Use Multiple Scales of Noise

Heightmaps then volumes: If you are designing a large world that has terrain, use multiple scales. For example, consider generating coarse heightmaps first, then embellishing them, and only then generating 3D volumes near the ground.

Generate noise more sparsely: Games like Minecraft only generate noise sparsely, and then interpolate between the generated noise. Because noise evaluation is expensive.

Next section discusses separating the world into biomes for ease of design, separation of concerns, and performance.

### Biomes

While designing a large world, you may be tempted to create a huge hierarchy of operations on noise (combining, selecting, etc.) discussed earlier, and you may be able to generate complex terrain, however, you will find that **A.** it becomes more and more difficult to design varying terrain with a single hierarchy of noise operations, and/or **B.** the function will become so complex, that it will become very slow; further, if you think about it, often many parts of the noise operations hierarchy will not be used as they will not be selected and/or they will be multiplied by 0.

As a result, designers often opt for explicitly making **biomes** first class. A biome, is a region of the terrain that has a terrain _type_, e.g Mountainous Tropical, or Tundra Plains, or Mountainous Rocky, Hilly Prairie etc.

You can on a first pass, generate some kind of coarse regular or irregular grid that that will define the boundaries of various biomes regions, and then based on some rules, assign each region a predefined biome type that you design, name, and create a noise operations hierarchy for. Then within each biome, you evaluate the relevant noise hierarchy that you hand tuned to generate that biome. Since the noise operations hierarchies are now separate, they can be made much simpler.


### Noise Zoo

* Primitives:
  * Value noise.
  * Perlin (don't use this anymore).
  * Simplex (prefer over Perlin).
  * Voronoi.
  * ...
* Fractal Brownian Motion (`fBm`).
* Noise Operations.
  * Modifiers/Combinations/Transformations/Selectors: See [LibNoise modules documentation](https://libnoise.sourceforge.net/docs/modules.html).
* Erosion?

{% todo_notice() %} END OF UNEDITED CONTENT {% end %}
-->

## References

{{ todo_notice(body="Add more references.") }}

- [The Book Of Shaders: Noise](https://thebookofshaders.com/11/)
- [The Book Of Shaders: Cellular Noise](https://thebookofshaders.com/12/)
- [The Book Of Shaders: Fractal Brownian Motion](https://thebookofshaders.com/13/)
- [libnoise: What is coherent noise?](https://libnoise.sourceforge.net/coherentnoise/index.html)
- [libnoise: Generating coherent noise](https://libnoise.sourceforge.net/noisegen/index.html)
- [libnoise: Glossary](https://libnoise.sourceforge.net/glossary/index.html)
- [Terrain from Noise](https://www.redblobgames.com/maps/terrain-from-noise/)
- [3D Cube World Level Generation](https://accidentalnoise.sourceforge.net/minecraftworlds.html)
- [C# Perlin Noise](http://lotsacode.wordpress.com/2010/02/24/perlin-noise-in-c/)
- [Perlin vs Simplex](https://www.bit-101.com/blog/2021/07/perlin-vs-simplex/)
- [Simplex Noise Demystified (PDF)](https://web.archive.org/web/20230310204125if_/https://webstaff.itn.liu.se/~stegu/simplexnoise/simplexnoise.pdf)
- [Goodbye Perlin noise in 2D, hello Perlin noise in 3D!](https://web.archive.org/web/20151122204631/https://blog.movingblocks.net/2011/06/11/goodbye-perlin-noise-2d-perlin-noise-3d/)
- [Voxel Terrain](http://www.terathon.com/lengyel/Lengyel-VoxelTerrain.pdf)

### Noise Libraries

Writing correct noise-generating code can be quite hard, so it is generally recommended to try using a library first...

* **[libnoise](https://libnoise.sourceforge.net)**  
  [Great documentation](https://libnoise.sourceforge.net/glossary/index.html), but quite old, slow and licensed under LGPL, which is a no-go for most projects.
  Notable because it has the best documentation for organizing/conceptualizing noise primitives and various operations on noise, so it's a good idea to browse through the [various modules](https://libnoise.sourceforge.net/docs/modules.html).
  * [Java Implementation](https://github.com/Sleaker/jlibnoise)
* **[OpenSimplex2](https://github.com/KdotJPG/OpenSimplex2)**  
  Various improvements over Perlin Noise and under a CC0 license.
* **[FastNoiseLite](https://github.com/Auburn/FastNoiseLite)**  
  Fast noise generation with implementations in several languages, several kinds of noise and a GUI to preview noise.
* **[FastNoise2](https://github.com/Auburn/FastNoise2)**  
  Newer version of *FastNoiseLite*, by the same author, written entirely in C++. One of the, if not *the*, fastest noise generation libraries.
* **[psrdnoise](https://github.com/stegu/psrdnoise/)**  
  A library implementing tiled simplex noise for GLSL.

### Explainer Videos

* [Value Noise Explained!](https://www.youtube.com/watch?v=zXsWftRdsvU)
* [How to turn a few Numbers into Worlds (Perlin Noise)](https://www.youtube.com/watch?v=ZsEnnB2wrbI)
* [The Absurd Usefulness of Noise in Game Development](https://www.youtube.com/watch?v=sChQCdbLdHE)
* ...
