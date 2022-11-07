+++
title = "Procedural Generation"
description = "Automated generation of content."
aliases = ["/wiki/procgen"]
[taxonomies]
categories = ["procgen"]
tags = ["procgen", "design", "gamedev"]
+++

{{ stub_notice() }}

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
