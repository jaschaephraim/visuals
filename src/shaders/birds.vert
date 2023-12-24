#version 300 es
#extension GL_GOOGLE_include_directive : enable

precision mediump float;
precision mediump int;

#include "/generative/snoise.glsl"

uniform float u_aspectRatio;
uniform int u_t;
uniform mat4 u_rotationMatrix;
uniform mat4 u_projectionMatrix;

const vec4 birdCenter = vec4(0.0, 0.25, -0.2, 1.0);

vec4 getBirdPosition() {
  float t = float(u_t) * 0.005;
  float x = snoise(vec3(t, 0, 0));
  float y = snoise(vec3(0, t, 0));
  float z = snoise(vec3(0, 0, t));
  return u_projectionMatrix * u_rotationMatrix * (birdCenter + vec4(vec3(x, y, z) * vec3(0.3, 0.2, 0.05), 0.0));
}

void main() {
  gl_PointSize = u_aspectRatio * 4.0;
  gl_Position = getBirdPosition();
}