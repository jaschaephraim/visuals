#version 300 es
#extension GL_GOOGLE_include_directive : enable

precision mediump float;
precision mediump int;

#include "bird-displacement.glsl"

uniform float u_aspectRatio;
uniform float u_t;
uniform mat4 u_projectionMatrix;

in vec4 a_position;

const float scale = 0.01;

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
    yCos, 0.0, ySin, 0.0,
    0.0, 1.0, 0.0, 0.0,
    -ySin, 0.0, yCos, 0.0,
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

mat4 getRotation(vec4 displacement) {
  vec4 nextDisplacement = getDisplacement(u_t + 1.0);
  vec4 diff = nextDisplacement - displacement;
  vec3 rotations = vec3(-diff.y * 5.0, diff.x, diff.x ) * 1000.0;
  return rotationMatrix(rotations);
}

void main() {
  gl_PointSize = u_aspectRatio * 4.0;

  vec4 displacement = getDisplacement(u_t);
  mat4 rotation = getRotation(displacement);

  vec4 position = rotation * a_position * scale + displacement;
  gl_Position = u_projectionMatrix * position;
}