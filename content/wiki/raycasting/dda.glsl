bool DDATraversal(vec3 origin, vec3 dir, out vec3 o_hitPos, out vec3 o_hitNormal)
{
    dir = normalize(dir);
    
    // We don't want to deal with this in the loop...
    if (rayDir.x == 0)
        rayDir.x = 0.001;
    if (rayDir.y == 0)
        rayDir.y = 0.001;
    if (rayDir.z == 0)
        rayDir.z = 0.001;
    
    ivec3 raySign = ivec3(sign(dir));
    ivec3 rayPositivity = (1 + raySign) >> 1;
    vec3 rayInverse = 1 / dir;
    
    ivec3 gridCoords = ivec3(origin);
    vec3 withinVoxelCoords = origin - gridCoords;
    
    while (true)
    {
        if (!isCoordInBounds(gridCoords))
            return false;
        
        if (isVoxelFilled(gridCoords))
        {
            o_hitPos = gridCoords + withinVoxelCoords;
            vec3 normal = vec3(0);
            normal[minIdx] = -raySign[minIdx];
            o_hitNormal = normal;
            return true; // We hit a voxel!
        }
        
        // Do a step...
        vec3 t = (rayPositivity - withinVoxelCoords) * rayInverse;
        int minIdx = t.x < t.y ? (t.x < t.z ? 0 : 2) : (t.y < t.z ? 1 : 2);
        
        gridCoords[minIdx] += raySign[minIdx];
        withinVoxelCoords += rayDir * t[minIdx];
        withinVoxelCoords[minIdx] = 1 - rayPositivity[minIdx];
    }
}
