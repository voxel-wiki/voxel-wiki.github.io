+++
title = "Sliding Window"
description = "Having a window of active elements over a larger field is useful in many situations."
path = "/wiki/sliding-window"
[taxonomies]
categories = ["algorithms", "datastructures"]
tags = ["algorithms", "data-structures", "architecture"]
+++

A **sliding window** represents a movable view/slice of a larger dataset/field, to make accessing data-elements both faster and more convenient; they can be implemented in several ways...

<!-- more -->

{% warn_notice() %}
This article is *not* about the [Sliding Window **Algorithm**](https://favtutor.com/blogs/sliding-window-algorithm).
{% end %}

## Motivation

When dealing with voxels, we often can't keep the entire worlds volume in memory (it might be terabytes, if not *petabytes*, in size!), so we make use of [chunking](/wiki/chunking) to only keep a small *window* into our world loaded and *slide* it around with the player/camera.

But how *exactly* do we do that?

1. We could use a **list** of chunks,  
   but we'd have to search thru it when looking up a voxel.
2. We could use a **hashmap** of chunks,  
   but we'd have to check all the keys when (un)loading chunks.
3. We could use a **array** of chunks,  
   but we'd have to move the chunks around as our camera moves.
4. We could use a **sliding window buffer**...

## Implementation

We will start off with an implementation of the 1-Dimensional variant to get the concept across.

### 1D

{% warn_notice() %}
**Disclaimer:** Haven't actually checked any of this implementation, so use at your own risk / ask if you think there's a mistake, because there probably is.
{% end %}

To begin, pretend we have an infinite array of (references to) [chunks](/wiki/chunking). We keep `5` chunks loaded at a time: a center chunk and two on either side. This is simple to lay out in our infinite array:

![An infinite array of chunks, with five loaded chunks in the 'center'.](/wiki/sliding-window/image0.png)

Chunk index in world is the same as array index in memory: chunk 15 is stored at array index `15`, etc.

Moving left is also simple: we unload the one chunk that's now too far away, and load one that's just come in range:

![Moving the range of loaded chunks to the left.](/wiki/sliding-window/image1.png)

Now, suppose we only want to use a size-5 array. We chop off the bits we're not using:

![The array is now finite, so the chunk indices no longer match the array indices.](/wiki/sliding-window/image2.png)

Since our array is only size `5`, our indices now run from `0` to `4`, and they're not the same as chunk indices any more. I'm going to start using "position" to mean world position, and "index" to mean index in the array.

If we move the player left, we need to unload the rightmost chunk and load a new one. Naively, we'd want to load the new chunk at array index `-1`, but of course that's impossible.
Instead, we put it right where we unloaded the old chunk:

![Moving the loaded range to the left, but where to?](/wiki/sliding-window/image3.png)

Our "window" (lower red bracket in the picture) is now broken into two pieces, wrapping itself around the start of the array. If we wanted to list chunks from lowest world position to highest, we'd do

```c#
{chunks[4], chunks[0], chunks[1], chunks[2], chunks[3]}
```

which, per the illustration, give us world positions `11, 12, 13, 14, 15` (5 chunks centred on player, lowest to highest, like we wanted).

There's one more thing that can happen. If the player is already at array index `0` and wants to move left, you've got to wrap player position around to the end of the array:

![Wrapping around the offset position.](/wiki/sliding-window/image4.png)

Ok, so how do we implement this? There are a variety of different things you can store, but we're going to store playerPosition in the world and playerIndex in the array. In this image from above, playerPosition is `14` and playerIndex is `2`:

![???](/wiki/sliding-window/image5.png)

The first thing we might want to do is retrieve a chunk from memory given only its world position. We calculate how far the world position is from the player position, and use that to get an array index:

```c#
Chunk GetChunkByWorldPosition(int worldPos) {
    int offsetFromPlayer = worldPos - playerPos;
    int unwrappedIndex = playerIndex + offsetFromPlayer;
    int wrappedIndex = wrap(unwrappedIndex, arrayLength);

    return chunks[wrappedIndex];
}
```

The `wrap`-function performs wrapping using the modulus operator `%`.

If everything is positive, you can just use `unwrappedIndex % arrayLength`. Unfortunately, `%` behaves weirdly with negative numbers in multiple languages; you can use this wrapping function instead:

```c#
public static int wrap(int x, int length) {
  int remainder = x % length;
  return remainder < 0 ? remainder + length : remainder;
}
```

Or something similar.

The second thing we might want to do is move the player left or right.

We're going to pre-calculate two values `distanceToLeft` and `distanceToRight`, which tell us how far away the leftmost and rightmost loaded chunk are from the player in world space.

The leftmost loaded chunk should have world position `playerPos - distanceToLeft`, and the rightmost loaded chunk should have world position `playerPos + distanceToRight`. For our size-5 example array, both would be `2`.

Then, to move left:

```c#
void MovePlayerLeft() {
    // subtract one from position and index, wrapping if necessary
    playerPosition -= 1;
    playerIndex = wrap(playerIndex - 1, arrayLength);

    // calculate which world positions to load and unload
    int positionToUnload = playerPosition + distanceToRight; //won't need this
    int positionToLoad = playerPosition - distanceToLeft;

    // calculate the index in memory where you need to swap the old chunk to the new chunk
    int index = wrap(playerIndex + distanceToRight, arrayLength);
    // int index = wrap(playerIndex - distanceToLeft, arrayLength); // this would work too

    // perform load and unload
    unloadChunk(index);
    loadChunkIntoArray(index, positionToLoad);
}
```

Should be pretty straightforward to adapt that code to moving right.
<!-- Draw the rest of the f##king owl.-->

### 2D

{% todo_notice() %} Oof. {% end %}

### 3D

{% todo_notice() %} Oof. {% end %}

## References

- <https://en.wikipedia.org/wiki/Circular_buffer>
