+++
title = "Coordinate Systems"
description = "The importance of correct coordinate systems cannot be understated."
path = "/wiki/coordinate-systems"
aliases = ["/wiki/coordinates"]
[taxonomies]
categories = ["math"]
tags = ["math"]
+++

When dealing with voxels (and math in three-dimensional space in general), it is extremely important to get your coordinate systems and the conversions between them right. Even slightly wrong conversions can (and will) lead to *massive* headaches and horrible debugging sessions.

<!-- more -->

As such, it is a good idea to do one or more of these:

- Add the coordinate-system being used to every position, rotation and scale value.
- Restrict the mixing of coordinate-systems, by using a type-system that let's you create [new types](https://www.worthe-it.co.za/blog/2020-10-31-newtype-pattern-in-rust.html) from existing types.
- Document the coordinate-systems of function parameters.

## Terminology

Now then, let's get to the various coordinate systems!

{% todo_notice() %} Add descriptive diagrams to all definitions. {% end %}

### World Space

The global coordinate system that is the entire scene. This is where almost all the (gameplay-related) math will occur.

Depending on the software you are using, this can vary *wildly*...

![World-Space Coordinate Systems by Freya Holmér](./coordinate-systems.png)
> Cheat Sheet made by [Freya Holmér](https://twitter.com/FreyaHolmer/status/1325556229410861056) © 2020  
> Wiki license exception: Copyright belongs to artist.  
> Copy embedded here [with permission](https://twitter.com/FreyaHolmer/status/1530167901436649472).

### Chunk/Object/Local Space

<img src="/favicon-32x32.png" width=32></img>
The local coordinate system of an [individual chunk](/wiki/chunking) or object.

### Voxel Space

<img src="/favicon-32x32.png" width=32></img>
The inner coordinate system of an *individual voxel*.

### NDC Space

<img src="/favicon-32x32.png" width=32></img>
The global coordinate system, as seen by a camera with some projection applied.

### View Space

<img src="/favicon-32x32.png" width=32></img>
The global coordinate system, as seen by a camera, with *no* projection applied.

## References

- [Wikipedia](https://en.wikipedia.org/wiki/Coordinate_system)
- [Learn OpenGL](https://learnopengl.com/Getting-started/Coordinate-Systems)
- [Freya Holmér's Cheat Sheet](https://twitter.com/FreyaHolmer/status/1325556229410861056)
- [WebGPU Specification](https://gpuweb.github.io/gpuweb/#coordinate-systems)
