#include "psrdnoise3.glsl"

const float speed = 0.0003;
const vec3 displacementScale = vec3(0.4, 0.15, 0.14);
const vec4 offset = vec4(0.0, -0.3, -0.3, 1.0);

float sampleNoise(vec3 coord) {
  vec3 gradient = vec3(0.0);
  return psrdnoise(coord, vec3(0.0), 0.0, gradient);
}

vec4 getDisplacement(float t) {
  float tScaled = t * speed;
  float x = sampleNoise(vec3(tScaled, 0, 0));
  float y = sampleNoise(vec3(0, tScaled, 0));
  float z = sampleNoise(vec3(0, 0, tScaled));
  return vec4(vec3(x, y, z) * displacementScale, 0.0) + offset;
}