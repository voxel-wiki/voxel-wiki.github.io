#define MAX_RAY_STEPS 64

bool raycast(
    // Inputs
    vec3 ray_origin,
    vec3 ray_direction,
    
    // Outputs
    // out bool RETURN, // was any voxel hit at all?
    out bvec3 o_hit_axis, // Which axis did the hit occur on.
    out float o_hit_dist, // Distance to the hit position.
    out ivec3 o_hit_vox, // Which voxel was hit.
    out vec3  o_hit_pos, // Position of the hit, globally.
    out vec3  o_hit_uvw, // Position of the hit, on voxel.
    out vec3  o_hit_nor // Normal of the face that was hit.
) {
    ray_direction = normalize(ray_direction);
    
    // We don't want to deal with this in the loop...
    if(ray_direction.x == 0.0)
        ray_direction.x = 0.0001;
    if(ray_direction.y == 0.0)
        ray_direction.y = 0.0001;
    if(ray_direction.z == 0.0)
        ray_direction.z = 0.0001;
    
    vec3 ray_signf = sign(ray_direction); // only for init
    ivec3 ray_sign = ivec3(ray_signf); // used in loop
    vec3 ray_step = 1.0 / ray_direction;
    
    vec3 ray_origin_grid = floor(ray_origin);
    ivec3 voxel_coords = ivec3(ray_origin_grid);
    
    vec3 side_distance = ray_origin_grid - ray_origin;
    side_distance += 0.5;
    side_distance += ray_signf * 0.5;
    side_distance *= ray_step;
    
    bvec3 mask; // of side_distance's largest axis
    
    for (int i = 0; i < MAX_RAY_STEPS; i++) {
        
        if(is_voxel_filled(voxel_coords)) {
            o_hit_axis = mask;
            
            // Determine final hit position in global space.
            o_hit_pos = side_distance - ray_origin;
            o_hit_pos += 0.5;
            o_hit_pos -= ray_signf * 0.5; // MINUS=
            o_hit_pos *= ray_step;
            //o_hit_pos = ray_origin + ray_direction * o_hit_dist;
            
            // The voxel that was hit.
            o_hit_vox = voxel_coords;
            
            // The distance to the hit.
            o_hit_dist = max(o_hit_pos.x, max(o_hit_pos.y, o_hit_pos.z));
            //o_hit_dist = length(vec3(mask) * (side_distance - ray_step));
            
            // The normal of the face that was hit.
            o_hit_nor = vec3(mask) * -ray_sign;
            
            // The position of the hit on the voxel.
            o_hit_uvw = o_hit_pos - o_hit_vox;
            
            return true; // We hit a voxel!
        }
        
        // Determine the mask without branching...
        // (Idea by https://www.shadertoy.com/user/kzy)
        mask = lessThanEqual(side_distance.xyz, min(side_distance.yzx, side_distance.zxy));
        
        // All components of `mask` are false,
        // EXCEPT for the corresponding largest component of sideDist,
        // which is the axis along which the ray should be incremented.
        
        side_distance += vec3(mask) * ray_step;
        voxel_coords += ivec(vec3(mask)) * ray_sign;
    }
    
    return false;
}
