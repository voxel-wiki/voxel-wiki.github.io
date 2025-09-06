+++
title = "Virtual Sprites"
description = "Dynamically building an atlas of used sprites at runtime."
draft = true
[taxonomies]
categories = ["rendering"]
tags = ["rendering", "texturing"]
+++

> Dynamically building an atlas and index of sprites at runtime...

{{ todo_notice(body="This article is incomplete and explains an experimental technique.") }}

## Motivation

{{ todo_notice(body="Convert to paragraphs? Explain better?") }}

- Building a texture atlas at start-up of *all* the sprites is quite the expensive process.
- Array textures are limited to ~2048 layers and require all sprites to have the same size.
- Both a normal atlas and array-textures have trouble with animated textures.
- Uploading small textures/sprites to the GPU is surprisingly fast and easy.
- As chunk meshes depend on their used sprites, we can't save/restore them to disk.
- Being able to dynamically create new sprites at runtime as needed is neat.
- Being able to let sprites have special projections and parameters is neat.
- Surprisingly this is doable, though slower, with older OpenGL versions!
  - (iirc, older GPUs/drivers don't like random-ish memory/texture reads?)

Silly things one can do with this technique:

- 'Environmental' sprites.
- User-generated sprites.
- Font glyphs and emoji.

Drawbacks:

- Whomst cares?

## Implementation

{{ todo_notice(body="Finish (minimal) implementation?") }}

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
