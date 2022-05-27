+++
title = "Coordinate Systems"
description = "The importance of correct coordinate systems cannot be understated."
path = "wiki/coordinates"
+++

## Motivation

When dealing with voxels (and math in three-dimensional space in general), it is extremely important to get your coordinate systems and the conversions between them right. Even slightly wrong conversions can (and will) lead to *massive* headaches and horrible debugging sessions.

As such, it is a good idea to do one or more of these:

- Add the coordinate-system being used to every position, rotation and scale value.
- Restrict the mixing of coordinate-systems, by using a type-system that let's you create [new types](https://www.worthe-it.co.za/blog/2020-10-31-newtype-pattern-in-rust.html) from existing types.
- Document the coordinate-systems of function parameters.

## Terminology

Now then, let's get to the various coordinate systems!

**TODO:** Add descriptive diagrams to the space definitions.

### World Space

<img src="/favicon-32x32.png" width=32></img>
The global coordinate system that is the entire scene.

### Chunk Space

<img src="/favicon-32x32.png" width=32></img>
The local coordinate system of an [individual chunk](/wiki/chunking) or object.

### Voxel Space

<img src="/favicon-32x32.png" width=32></img>
The inner coordinate system of an *individual voxel*.
