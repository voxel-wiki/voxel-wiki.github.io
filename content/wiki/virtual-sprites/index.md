+++
title = "Virtual Texture Atlas"
description = "Dynamically building an atlas of sprites at runtime."
path = "/wiki/virtual-texture-atlas"
aliases = ["/wiki/dynamic-atlas", "/wiki/virtual-sprites"]
[taxonomies]
categories = ["rendering"]
tags = ["rendering", "texturing"]
[extra]
chapters = true
chapter_prev = {text = "Texture Atlas", link = "/wiki/texture-atlas"}
chapter_next = false
+++

By dynamically building (and uploading/keeping on the GPU) a texture atlas *with* a lookup-table of its contained sprites, both a variety of interesting effects and dynamic loading of textures/sprites can be achieved.

<!-- more -->

{{ warn_notice(body="**Disclaimer:** This article covers an experimental/unproven technique.") }}

{{ todo_notice(body="This article is **incomplete**.") }}

## Motivation

{{ todo_notice(body="Convert to paragraphs? Explain better?") }}

- Building a texture atlas at start-up of *all* the sprites is quite the expensive process.
- Array textures are limited to ~2048 layers and require all sprites to have the same size.
- Both a normal atlas and array-textures have trouble with animated textures.
- Uploading small textures/sprites to the GPU is surprisingly fast and easy.
- Chunk meshes depend on their used sprites, so doing this allows persisting them to disk.
- Being able to dynamically create new sprites at runtime as needed is neat.
- Being able to let sprites have special effects/projections is neat.
- Surprisingly this is doable, though slower, with older OpenGL versions!
  <small>(older GPUs don't do well with random memory access, iirc)</small>

Silly things one can do with this technique:

- Unlimited sprite permutations.
- Sprites animated per-instance.
- Sprites with multiple layers.
- Weird texture projections.
- User-generated sprites.
- Font glyphs and emoji.

Drawbacks:

- An additional buffer lookup in the vertex shader.

## Implementation

{{ todo_notice(body="Create a (minimal) implementation?") }}

```glsl
#version 460 core

struct SpriteDef {
	float uv[4];
};

layout(binding = 0, std430) readonly buffer ssbo_sprites {
	SpriteDef sprites[];
};

struct Facelet {
	int data0; // position, dimensions, rotation
	int data1; // colortint, corner-ao, ...
	int data2; // spriteref, spritearg, ...
}

layout(binding = 1, std430) readonly buffer ssbo_faces {
	Facelet facelets[];
};

struct Meshlet {
	mat4 transform;
	int facelets_start;
	int facelets_count;
}

layout(binding = 2, std430) readonly buffer ssbo_meshlets {
	Meshlet meshlets[];
};
```

---

{{ todo_notice(body="Recommended: Face Pulling") }}
{{ todo_notice(body="Requirement: SSBOs or BufferTextures") }}

## See also

- [Face Pulling](/wiki/face-pulling)
- [Vertex Pooling](/wiki/vertex-pooling)

## References

- [SSBOs](https://ktstephano.github.io/rendering/opengl/ssbos)
