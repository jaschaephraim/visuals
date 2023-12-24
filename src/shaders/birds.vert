#version 300 es
#extension GL_GOOGLE_include_directive : enable

precision mediump float;
precision mediump int;

#include "psrdnoise3.glsl"

uniform float u_aspectRatio;
uniform int u_t;
uniform mat4 u_projectionMatrix;

in vec4 a_position;

const float scale = 0.01;
const vec4 offset = vec4(0.0, -0.3, -0.3, 1.0);

float sampleNoise(vec3 coord) {
  vec3 gradient = vec3(0.0);
  return psrdnoise(coord, vec3(0.0), 0.0, gradient);
}

vec4 getBirdPosition() {
  float t = float(u_t) * 0.005;
  float x = sampleNoise(vec3(t, 0, 0));
  float y = sampleNoise(vec3(0, t, 0));
  float z = sampleNoise(vec3(0, 0, t));
  return a_position * scale + offset + vec4(vec3(x, y, z) * vec3(0.4, 0.15, 0.14), 0.0);
}

void main() {
  gl_PointSize = u_aspectRatio * 4.0;

  vec4 birdPosition = getBirdPosition();
  gl_Position = u_projectionMatrix * birdPosition;
}