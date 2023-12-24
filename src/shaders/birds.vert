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
const vec3 displacementScale = vec3(0.4, 0.15, 0.14);
const vec4 offset = vec4(0.0, -0.3, -0.3, 1.0);

float sampleNoise(vec3 coord) {
  vec3 gradient = vec3(0.0);
  return psrdnoise(coord, vec3(0.0), 0.0, gradient);
}

mat4 rotationMatrix(vec3 rotations) {
  float xCos = cos(rotations.x);
  float xSin = sin(rotations.x);
  mat4 xRotation = mat4(
    1.0, 0.0, 0.0, 0.0,
    0.0, xCos, -xSin, 0.0,
    0.0, xSin, xCos, 0.0,
    0.0, 0.0, 0.0, 1.0
  );

  float yCos = cos(rotations.y);
  float ySin = sin(rotations.y);
  mat4 yRotation = mat4(
    xCos, 0.0, xSin, 0.0,
    0.0, 1.0, 0.0, 0.0,
    -xSin, 0.0, xCos, 0.0,
    0.0, 0.0, 0.0, 1.0
  );

  float zCos = cos(rotations.z);
  float zSin = sin(rotations.z);
  mat4 zRotation = mat4(
    zCos, -zSin, 0.0, 0.0,
    zSin, zCos, 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    0.0, 0.0, 0.0, 1.0
  );

  return xRotation * yRotation * zRotation;
}

vec4 getDisplacement(int t) {
  float tScaled = float(t) * 0.005;
  float x = sampleNoise(vec3(tScaled, 0, 0));
  float y = sampleNoise(vec3(0, tScaled, 0));
  float z = sampleNoise(vec3(0, 0, tScaled));
  return vec4(vec3(x, y, z) * displacementScale, 0.0) + offset;
}

mat4 getRotation(vec4 displacement) {
  vec4 prevDisplacement = getDisplacement(u_t - 1);
  vec4 diff = displacement - prevDisplacement;
  vec3 rotations = diff.xyz * 50.0;
  return rotationMatrix(rotations);
}

void main() {
  gl_PointSize = u_aspectRatio * 4.0;

  vec4 displacement = getDisplacement(u_t);
  mat4 rotation = getRotation(displacement);

  vec4 position = rotation * a_position * scale + displacement;
  gl_Position = u_projectionMatrix * position;
}