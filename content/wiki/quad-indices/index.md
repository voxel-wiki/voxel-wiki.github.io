+++
title = "Quad Indices"
description = "The basic pattern of indices for quads made of triangles."
[taxonomies]
categories = ["rendering"]
tags = ["meshing"]
+++

A **quadliteral** (also called **quad**, **tetragon** or **quadrangle**) is a four-sided polygon, with four corners/vertices and four edges/sides.

Unfortunately, GPUs/rasterizers generally only deal with triangles,
so we'll have to split each one of our quads into two triangles...
resulting in two of the vertices being duplicated.

Since we don't like pointless duplication, we ought to use an **element/index-buffer**,
which tells the GPU how to assemble two triangles from four vertices each.

But how do we assign/number/order the four vertices?

## Winding Orders

As triangles only have three vertices,
they've got exactly one winding order and it's inverse: **Clockwise** and **Counter-Clockwise**.

With quadliterals there's an extra pair: **Z-Order** and **N-Order**.

Pictures can say more than a thousand words, so let's visualize all four winding orders...

{% figure(caption="**Diagram of Winding Orders:** Clockwise, Counter-Clockwise, Z-Order, N-Order",author="Lars Longor K",license="CC0",class="full") %}/wiki/quad-indices/windings.svg{% end %}<br/>

We can also represent the windings as a table,
by writing out which corners map to which vertices,
always starting with the Top-Left:

| Vertices → <br/> Windings ↓ | `0` | `1` | `2` | `3` |
|---|---|---|---|---|
| Clockwise | Top-Left | Top-Right | Bottom-Right | Bottom-Left |
| Counter-Clockwise | Top-Left | Bottom-Left | Bottom-Right | Top-Right |
| Z-Order | Top-Left | Top-Right | Bottom-Left | Bottom-Right |
| N-Order | Top-Left | Bottom-Left | Top-Right | Bottom-Right |

Each of these orders is perfectly valid and, depending on use-case, may be more-or-less suitable.

## Index Sequences

The great thing about indexing vertices of quadliterals,
is that the sequence of indices can be precomputed ahead of time and stored in a buffer.

For example, for the clockwise winding order, the sequence of triangle indices is as follows:

```pseudocode
for n in range(0...):
	triangle_a = { (4n)+0, (4n)+1, (4n)+2 }
	triangle_b = { (4n)+0, (4n)+2, (4n)+3 }
```

Which, if expanded, gives us:

```csv
"QUAD", "A.0", "A.1", "A.2", "B.0", "B.1", "B.2"
0,  0,  1,  2,  0,  2,  3
1,  4,  5,  6,  4,  6,  7
2,  8,  9,  10, 8,  10, 11
3,  12, 13, 14, 12, 14, 15
4,  16, 17, 18, 16, 18, 19
5,  20, 21, 22, 20, 22, 23
...
```

Every line of triangle indices is just a copy of the last, with every index increased by 4.

Because of that, we can fill a rather large element/index-buffer with this pattern, upload it to the GPU,
then reuse it for *every single mesh* consisting solely of quadliterals.

So on start-up, we generate and upload the buffer:

```pseudocode
let elements_limit = 2**16;
let triangle_verts = 3
let quadlitr_verts = 2 * triangle_verts
let elements_buffer = Vec::new_with_capacity(elements_limit)

elements_buffer.map();
for n in 0..elements_limit {
	elements_buffer.push_all([
		(4n)+0, (4n)+1, (4n)+2,
		(4n)+0, (4n)+2, (4n)+3,
	])
}

elements_buffer_id = GPU.CreateElementBufferFrom(elements_buffer);
```

Then, during rendering, reuse it for every single mesh of quadliterals:

```pseudocode
GPU.BindIndexBuffer(elements_buffer_id)
for current_mesh in chunk_meshes {
	GPU.BindVertexBuffer(current_mesh)
	GPU.DrawElements( ... )
}
```

On some graphics cards,
combining this approach with [vertex pulling](/wiki/vertex-pulling)
may yield a few extra percent of performance.

## See Also

- [Vertex Pulling](/wiki/vertex-pulling)
- [Multi-Draw](/wiki/multi-draw)

## References

- <https://en.wikipedia.org/wiki/Quadrilateral>
