+++
title = "Texture Atlas"
description = "Packing a whole lot of differently sized sprites into one large texture."
path = "/wiki/texture-atlas"
aliases = ["/wiki/sprite-atlas", "/wiki/spritesheet"]
[taxonomies]
categories = ["rendering"]
tags = ["textures", "algorithms"]
[extra]
chapters = true
chapter_prev = false
chapter_next = {text = "Dynamic/Virtual Atlas", link = "/wiki/virtual-texture-atlas"}
+++

A **texture atlas** (also called a **spritesheet**) is an image containing a
multitude of smaller images (sprites), usually tightly packed together so as
to reduce wasted space, that is used during rendering by various models,
materials, shaders and renderpasses.

<!-- more -->

Creation of an atlas generally happens:

- By hand in an image editor during *development*.
- Via some tool during *development or packaging*.
- By the engine while the game is *starting* or *loading*...
- ...or in the background, while the game is *running*.

In the latter case, the atlas is referred to as *runtime* or *virtual* texture atlas.

## Motivation

Until relatively recently, GPUs did not allow arbitrary fetching of textures
by address/pointer in shaders (called **bindless textures**),
so anyone that needed large amounts of tiny textures (like sprites and glyphs),
had to package them into a texture atlas.

## Atlas Generation

A basic algorithm for generating a texture atlas is as follows:

1. Define some large rectangle - like `256²px` - and create an empty image of the same size.
2. Create a list of rectangles always sorted by increasing size; add the big rectangle to it.
3. **For each sprite**, find and take the first large enough rectangle in the queue and:
    - If the rectangle is the same size as the sprite, draw it to the image and save where it was drawn.
    - If the rectangle is bigger, split it into 2-4 smaller rectangles given the sprites size, using one to perform the previous step and adding the rest to the queue.
    - If the queue is empty, or no fitting rectangle can be found, double the size of the image either horizontally or vertically, add rectangles covering the new empty space to the queue, then try again.
4. **Repeat** until all sprites are in the image atlas, or the GPUs maximum texture size is reached.
5. ???
6. PROFIT!

## Multi(layer) Atlas

By giving an atlas multiple layers, and uploading it to the GPU as texture array,
more channels can be added and used for various effects, bump-mapping and physically based rendering.

Note that this will eat quite a lot of texture memory, so it's best to use as few layers as possible.

Alternatively, if the percentage of sprites that need additional textures/channels is low enough, create a separate texture atlas (*not* as a layer) with said textures and add another texture coordinate attribute to your geometry.

## References

- [Wikipedia: Texture Atlas](https://en.wikipedia.org/wiki/Texture_atlas)
- [Nvidia: Improve Batching Using Texture Atlases](https://download.nvidia.com/developer/NVTextureSuite/Atlas_Tools/Texture_Atlas_Whitepaper.pdf)
- <https://lisyarus.github.io/blog/posts/texture-packing.html>

On bindless rendering:
- <https://jorenjoestar.github.io/post/vulkan_bindless_texture/>
- <https://henriquegois.dev/posts/bindless-resources-in-vulkan/>
- <https://alextardif.com/Bindless.html>
- <https://vulkan.org/user/pages/09.events/vulkanised-2023/vulkanised_2023_setting_up_a_bindless_rendering_pipeline.pdf>
