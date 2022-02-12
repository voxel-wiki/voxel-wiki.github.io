+++
title = "Rendering: Culling"
description = "Limiting the amount of voxels rendered to manageable levels."
+++

In general, culling is the process of limiting the amount of things rendered to manageable levels, so the GPU doesn't go up in flames.

So, here are the ~4 families of culling, in increasing algorithmic- and/or time-complexity:

1. Distance Culling: Don't render what is too far away.
2. Frustum Culling: Don't render what falls outside the cameras view.
3. Portal Culling: Don't render what is in another room.
4. Occlusion Culling: Don't render what cannot *actually* be seen.
