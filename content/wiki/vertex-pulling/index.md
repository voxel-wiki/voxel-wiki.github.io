+++
title = "Vertex Pulling"
description = "Manual vertex streaming for improved memory usage and bandwidth."
aliases = ["/wiki/vertex-pulling"]
[taxonomies]
categories = ["rendering"]
tags = ["rendering", "meshing", "vertices"]
[extra]
chapters = true
chapter_prev = {text = "Vertex Packing", link = "/wiki/vertex-packing"}
chapter_next = {text = "Face Pulling", link = "/wiki/face-pulling"}
+++

{% todo_notice() %} This article is a work-in-progress. {% end %}

Traditionally, when uploading and fetching data to draw in a vertex shader, you would use a Vertex Buffer Object (VBO) linked to a Vertex Attribute Object (VAO). Optionally, an Index Buffer Object (EBO/IBO) could be attached to reuse identical vertices that overlap. For instance, on the face of a cube rendered with triangles, there are 2 triangles with 6 vertices. 2 of the vertices overlap across triangles. Hence, an index buffer can render the face with 4 indices, reusing 2 out of the 6 identical vertices.

In modern programming, this same idea can be used with Vertex Pulling for an even more beneficial memory gain. With a VBO and EBO, you are required to have minimum 4 indices at 16 bytes (4 bytes an integer with 4 integers) stored to draw a face. However, with Vertex Pulling, you can have as little memory as 4 bytes per face if the data is repeated across the face. This works by storing your data inside of a Shader Storage Buffer Object (SSBO) instead of a VBO. 

## Key Notes

- Pulling from a vertex-stream or SSBO/UBO is generally the same speed as from a VBO/EBO
- Vertex pulling is especially effective when there is identical data across vertices
- Mesh/Vertex data is put inside of a SSBO instead of a VBO, and a custom index created with gl_VertexID inside of the vertex shader is used to pull the data.
- Vertex-shaders only have to emit a NDC-position; how they do so is undefined.

## Implementation

1. First, let's create a SSBO to hold our mesh data, and a VAO so we can issue a draw command later. Additionally, you will want to create a shader program - which we will not review in this article.
```cpp
unsigned int ssbo, vao, shaderProgram;
glCreateBuffers(1, &ssbo);
glCreateBuffers(1, &vao);
```

2. To use our SSBO, first we need to create some mesh data. Let's create a vector to store our vertices, and put some basic mesh data in to draw a face of a cube. We will pack our data inside of a single vertex for efficiency using bit manipulation. 
```cpp
// Vector to hold our mesh data
std::vector<int> ssboVertices; 

// The position of our face
vec3 position = vec3(5, 5, 5); 
// Pack the position of our face into a singular integer
int vertex = (position.x | position.y << 10 | position.z << 20); 

// Put the mesh data inside our vector
ssboVertices.push_back(vertex);
```

3. Now that we have some mesh data, lets put it inside of the SSBO and send it off to the Vertex Shader. Note the 2nd parameter of glBindBufferBase - the 0. This parameter is referred to as the "binding point" and will come back next step as it needs to match the SSBO in the vertex shader, which is how they are linked.
```cpp
// Bind our shader program (created on your own)  
glUseProgram(shaderProgram);
// Using DSA, put the data inside of the SSBO. Non-DSA equivalent is glBufferData
glNamedBufferStorage(ssbo, ssbo.size() * sizeof(int), ssbo.data(), NULL);
glBindBufferBase(GL_SHADER_STORAGE_BUFFER, 0, ssbo);
// Unbind our shader program
glUseProgram(0);
```

4. Inside of your Vertex Shader, let's create the actual SSBO so the data from the previous step is sent inside. Note the line `binding = 0`. This is the binding point referred to in the previous step, and must match the 2nd parameter of glBindBufferBase.
```glsl
layout(std430, binding = 0) readonly buffer vertexPullBuffer 
{
	uint packedMeshData[]; // Contains packed data for our vertices
};
```

5. Now, let's actually draw our mesh. We currently have 1 vertex per face in our mesh data since we are using vertex pulling, but 6 vertices are needed to draw a face since it uses 2 triangles, so the 3rd parameter of glDrawArrays is the size of our vertices multiplied by six. This basically means we will draw 6 vertices in our vertex shader, even though we have only supplied 1 vertice's worth of data
```cpp
// Bind our vertex array. This is needed even though we have no VBO
glBindVertexArray(vao);
// Issue the draw command
glDrawArrays(GL_TRIANGLES, 0, ssboVertices.size()*6);
// Unbind our vertex array
glBindVertexArray(0);
```

6. Finally, let's actually use the data from the SSBO to draw our face! First, we will retrieve the data from the SSBO using a custom index. Since we have 6 vertices on a face, and gl_VertexID is equal to the current vertex being drawn, we will do gl_VertexID / 6.

- Next, we unpack the data using standard bit manipulation to get the position (5, 5, 5) for x, y, and z we packed in step 2.

- Lastly, we must move our vertices by an amount so they can form the actual face. By default, all of our vertices will be at the position (5, 5, 5) without this. However in reality, to make the face, we need our vertices at corners to make the triangles - for instance one triangle would have vertices at (5, 5, 5), (6, 5, 5), and (6, 5, 6) which would make one of the 2 triangles in a face. That is what is happening when we are doing `position += facePositions[currVertexID]` - we are offsetting our 6 vertices in a custom order defined by our indices[6] array to create the 2 triangles.

```glsl
// Our SSBO added in step 4
layout(std430, binding = 0) readonly buffer vertexPullBuffer 
{
	uint packedMeshData[]; // Contains packed data for our vertices
};

// Offsets for our vertices drawing this face
const vec3 facePositions[4] = vec3[4]
(
	vec3(0.0f, 0.0f, 1.0f),
	vec3(1.0f, 0.0f, 0.0f),
	vec3(1.0f, 0.0f, 1.0f),
	vec3(0.0f, 0.0f, 0.0f)
);

// Winding order to access the face positions
int indices[6] = {0, 1, 2, 1, 0, 3};

void main()
{
  // Create a custom index to access the mesh data in the right order
  const int index = gl_VertexID / 6;
  const uint packedData = packedMeshData[index];
  const int currVertexID = gl_VertexID % 6;

  // Unpack the data we retrieved
  const uint x = (packedData) & 1023;
  const uint y = (packedData >> 10) & 1023;
  const uint z = (packedData >> 20) & 1023;
  vec3 position = vec3(x, y, z);
  
  // Apply the offsets for our face so we can form the 2 triangles
  position += facePositions[currVertexID];

  // Output our position
  gl_Position = vec4(position, 1.0);
}
```

7. You are now finished! In this implementation, we have packed the position of a cube face into a single integer, using vertex pulling to draw the face to the screen - which is 4 bytes. By comparison, using a normal VAO/VBO setup, you would use 4 indices (4x4 = 16 bytes), or 6 vertices (4x6 = 24 bytes) to draw the same face to the screen.

## References

- [Vertex Formats Part 2: Fetch vs Pull](https://www.yosoygames.com.ar/wp/2018/03/vertex-formats-part-2-fetch-vs-pull/) (**recommended**)
- [Programmable Vertex Pulling by *hannomalie*](https://hannomalie.github.io/posts/2019-12-01-programmable-vertex-pulling.html)
- [Programmable Vertex Pulling by *ktstephano*](https://ktstephano.github.io/rendering/opengl/prog_vtx_pulling)
- [Dynamic Vertex Pulling with D3D11](https://bazhenovc.github.io/blog/post/d3d11-dynamic-vertex-pulling/)
- [WebGL Pulling Vertices](https://webglfundamentals.org/webgl/lessons/webgl-pulling-vertices.html)  
  <small>**Note:** Uses textures instead of buffers.</small>
- [`nlguillemot/ProgrammablePulling`](https://github.com/nlguillemot/ProgrammablePulling)
- [`superdump/bevy-vertex-pulling`](https://github.com/superdump/bevy-vertex-pulling)
