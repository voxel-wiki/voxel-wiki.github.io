struct Camera
{
    vec3 eye;
    vec3 target;
    float fov;
};

struct Ray 
{
    vec3 origin;
    vec3 dir;
};

Ray create_ray(uint x, uint y, uint width, uint height, Camera camera)
{
    float aspect = float(width) / float(height); // get the aspect ratio of the image
    float theta = radians(camera.fov);
    float half_height = tan(theta / 2.0);
    float half_width = aspect * half_height;

    vec3 w = normalize(camera.eye - camera.target); // the cameras forward direction
    vec3 u = normalize(cross(vec3(0, 1, 0), w)); // the vector horizontal to the cameras view
    vec3 v = cross(w, u); // the vector horizontal to the cameras view

    vec3 origin = camera.eye;
    vec3 lower_left_corner = origin - (u * half_width) - (v * half_height) - w;
    vec3 horizontal = u * 2.0 * half_width;
    vec3 vertical = v * 2.0 * half_height;

    float xu = float(x) / float(width);
    float yv = float(y) / float(height);
    vec3 dir = normalize(lower_left_corner + (horizontal * xu) + (vertical * yv) - origin);

    return Ray(origin, dir);
}