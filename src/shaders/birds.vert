#version 300 es
#extension GL_GOOGLE_include_directive : enable

precision mediump float;
precision mediump int;

#include "/generative/snoise.glsl"

uniform float u_aspectRatio;
uniform int u_t;

const float u_tiltAngle = 1.5;
const float u_fov = 2.5;
const float u_near = 0.1;
const float u_far = 100.0;

const vec4 birdCenter = vec4(0.0, 0.25, -0.2, 1.0);

const float cosTilt = cos(u_tiltAngle);
const float sinTilt = sin(u_tiltAngle);
const mat4 rotationMatrix = mat4(
  1.0, 0.0, 0.0, 0.0,
  0.0, cosTilt, -sinTilt, 0.0,
  0.0, sinTilt, cosTilt, 0.0,
  0.0, 0.0, 0.0, 1.0
);

const float f = 1.0 / tan(u_fov / 2.0);

vec4 getBirdPosition(mat4 projectionMatrix) {
  float t = float(u_t) * 0.005;
  float x = snoise(vec3(t, 0, 0));
  float y = snoise(vec3(0, t, 0));
  float z = snoise(vec3(0, 0, t));
  return projectionMatrix * rotationMatrix * (birdCenter + vec4(vec3(x, y, z) * vec3(0.3, 0.2, 0.05), 0.0));
}

void main() {
  mat4 projectionMatrix = mat4(
    f / u_aspectRatio, 0.0, 0.0, 0.0,
    0.0, f, 0.0, 0.0,
    0.0, 0.0, (u_far + u_near) / (u_near - u_far), -1.0,
    0.0, 0.0, (2.0 * u_far * u_near) / (u_near - u_far), 0.0
  );

  gl_PointSize = u_aspectRatio * 4.0;
  gl_Position = getBirdPosition(projectionMatrix);
}