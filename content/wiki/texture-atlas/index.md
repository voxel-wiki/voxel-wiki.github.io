+++
title = "Sprite & Texture Atlas"
description = "Packing a whole lot of differently sized sprites into one large texture."
path = "/texture-atlas"
aliases = ["/sprite-atlas"]
draft = true
[taxonomies]
categories = ["rendering"]
tags = ["textures", "algorithms"]
+++

**INSERT INTRO BLURB HERE.**

<!-- more -->

{{ stub_notice() }}

## How To

1. Define some large rectangle (like, 256²) and create an image of the same size.
1. Create a list of rectangles sorted by increasing size; add the big rectangle to it.
1. For each sprite, find and take the first large enough rectangle in the queue.
1. If the rectangle is the same size as the sprite, draw it to the image.
1. If the rectangle is bigger, split it into 2-4 smaller rectangles, using one as the previous step, adding the rest to the queue.
1. If the queue is empty, or no fitting rectangle can be found, expand the size of the image, add new rectangles covering the now empty space to the queue, then try again.
1. Repeat until all sprites are in the image atlas.
2. ???
3. PROFIT!

## References

- <https://lisyarus.github.io/blog/posts/texture-packing.html>
