+++
title = "Raytracing"
description = "Rendering images via raycasting."
path = "/wiki/raytracing"
[taxonomies]
categories = ["algorithms"]
tags = ["rendering", "raytracing", "raycasting"]
[extra]
chapters = true
chapter_prev = {text = "Raycasting", link = "/wiki/raycasting"}
chapter_next = false
+++

Rendering images via raycasting, be it on the CPU or GPU, is a powerful method, *especially* when it comes to voxels.

<!-- more -->

## Motivation

{% todo_notice() %} Why raytrace voxels? {% end %}

## History

In 1987, a paper called `A Fast Voxel Traversal Algorithm for Ray Tracing`[^1987-AFVTAFRT] was published by <i>Amanatides and Woo</i> that, as the name implies, paved the way for fast voxel raytracing:

> **Abstract:** A fast and simple voxel traversal algorithm through a 3D space partition is introduced. Going from one voxel to its neighbour requires only two floating point comparisons and one floating point addition. Also, multiple ray intersections with objects that are in more than one voxel are eliminated.

{% todo_notice() %} More history? Necessary? {% end %}

## Implementation

To initially implement voxel raytracing, you will want to look at the aforementioned *Fast Voxel Traversal* paper[^1987-AFVTAFRT] (see [raycasting](/wiki/raycasting)), which forms the basis (!) for most other algorithms and architectures.

For very basic & small voxel scenes (below say, ~`128^3`), this *may* already be enough. <small>But it's never enough, is it?</small>

After that comes accelerating ray-traversal and reducing memory consumption, the key to both of which is ***sparsity***: If an area of voxels consists of the same type/value of voxels, it should be possible to both compress it's memory representation and, if the area is 'empty', skip across the whole area.

This is done via **Brickmaps** [^2015-RTRTAEOLVS] [^2022-NEBFRTRT] (generally recommended), **Sparse Voxel Octrees** [^2010-ESVO-AEAI], or **Sparse Voxel Directed Acyclic Graphs** [^2017-SSVDAGs] [^2020-IMCSVR].

Each method has various trade-offs in terms of tracing performance, editing/update speeds and memory footprint. Please carefully read each paper and compare implementations, if possible.

{% info_notice() %}
In regards to games, you'll want to have various dynamic objects and repeated elements that are *not* directly part of the 'primary' voxel volume, so it might make sense to have something like a **Bounding Volume Hierarchy** [^2021-ASOBVHFRT] to raytrace these.
{% end %}

<!-- Finally, keep in mind that you can mix-and-match different architectures and acceleration structures, like having your terrain in a Brickmap for fast/efficient streaming and edits/updates, while dynamic objects may use an SVO. -->

## References

[^1987-AFVTAFRT]: (1987) A Fast Voxel Traversal Algorithm for Ray Tracing - <i>Amanatides, John & Woo, Andrew</i>

[^2015-RTRTAEOLVS]: (2015) Real-time Ray Tracing and Editing of Large Voxel Scenes - <i>Wingerden, Thijs van</i>

[^2022-NEBFRTRT]: (2022) Novel Extended Brickmap for Real-Time Ray Tracing - <i>Hjerpbakk, Aksel</i>

[^2010-ESVO-AEAI]: (2010) Efficient Sparse Voxel Octrees; Analysis, Extensions, and Implementation - <i>Laine, Samuli & Karras, Tero</i>

[^2017-SSVDAGs]: (2017) Symmetry-aware Sparse Voxel DAGs (SSVDAGs) for compression-domain tracing of high-resolution geometric scenes - <i>Jaspe-Villanueva, Alberto & Marton, Fabio & Gobbetti, Enrico</i>

[^2020-IMCSVR]: (2020) Interactively Modifying Compressed Sparse Voxel Representations - <i>Careil, V. & Billeter, M. & Eisemann, Elmar</i>

[^2021-ASOBVHFRT]: (2021) A Survey on Bounding Volume Hierarchies for Ray Tracing - <i>Meister, Daniel & Ogaki, Shinki & Benthin, Carsten & Doyle, Michael J. & Guthe, Michael & Bitner, Jiri</i>

### Related Papers

Here are some more interesting and cool papers you might like to read too; some aren't directly related to voxel raytracing, we just think they're nice:

[^2010-VBTFRTVS]: (2010) Voxel-Based Terrain for Real-Time Virtual Simulations - <i>Lengyel, Eric</i>

[^2011-FHATEOTG]: (2011) Fast Hydraulic and Thermal Erosion on the GPU - <i>Jako, Balazs</i>

[^2011-Gigavoxels]: (2011) GigaVoxels_ A Voxel-Based Rendering Pipeline for Efficient Exploration of Large and Detailed Scenes - <i>Crassin, Cyril</i>

[^2015-GFOOCVTSVOOG]: (2015) Grid-free out-of-core voxelization to sparse voxel octrees on GPU - <i>Pätzold, Martin & Kolb, Andreas</i>

[^2016-FVBHE]: (2016) Fast Voxel-Based Hydraulic Erosion - <i>Weiss, Sebastian</i>

[^2016-LSTGFTUAFE]: (2016) Large Scale Terrain Generation from Tectonic Uplift and Fluvial Erosion - <i>Cordonnier, Guillaume & Braun, Jean & Cani, Marie-Paule & Benes, Berich & Galin, Eric & Peytavie, Adrien & Guerin, Eric</i>

[^2017-SVGF]: (2017) Spatiotemporal Variance-Guided Filtering (SVGF) - <i>Schied, Christoph & Kaplanyan, Anton & Wyman, Chris & Patney, Anjul & Chaitanya, Chakravarty</i>

[^2018-HDPFLVW]: (2018) Hierarchical Dynamic Pathfinding for Large Voxel Worlds - <i>Alain, Benoit</i>

[^2020-RESTIR]: (2020) ReSTIR: Spatiotemporal Reservoir Resampling for Real-time Ray Tracing with Dynamic Direct Lighting - <i>Bitterli, Benedikt & Wyman, Chris & Pharr, Matt & Shirley, Peter & Lefohn, Aaron & Jarosz, Wojciech</i>

[^2021-RESTIR-GI]: (2021) ReSTIR GI: Path Resampling for Real-Time Path Tracing - <i>Ouyang, Y. & Liu, S. & Kettunen, M. & Pharr, M. & Pantaleoni, J.</i>
