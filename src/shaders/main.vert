#version 300 es
#extension GL_GOOGLE_include_directive : enable

precision mediump float;
precision mediump int;

#include "psrdnoise2.vert.glsl"
#include "psrdnoise3.vert.glsl"

uniform float u_aspectRatio;
uniform int u_gridSize;
uniform int u_bufferIndex;
uniform float u_t;

in vec4 a_position;
out vec2 v_uv;
out mat4 v_projectionMatrix;
out vec4 v_birdDisplacement;

// projection
const float fov = 2.5;
const float near = 0.1;
const float far = 100.0;
const float f = 1.0 / tan(fov / 2.0);

// landscape
const float landscapeSpeed = 0.0002;
const float landscapeYOffset = -0.5;
const float landscapeLineOffset = 0.0001;

// landscape noise
const float noiseFreqA = 3.0;
const float noiseAmpA = 0.05;
const float noiseFreqB = 8.0;
const float noiseAmpB = 0.03;

// bird
const float birdScale = 0.01;
const float birdSpeed = 0.0003;
const vec3 birdDisplacementScale = vec3(0.4, 0.15, 0.14);
const vec4 birdOffset = vec4(0.0, -0.3, -0.3, 1.0);

float sampleNoise2(vec2 coord) {
  vec2 gradient = vec2(0.0);
  return psrdnoise(coord, vec2(0.0), 0.0, gradient);
}

float sampleNoise3(vec3 coord) {
  vec3 gradient = vec3(0.0);
  return psrdnoise(coord, vec3(0.0), 0.0, gradient);
}

vec4 getLandscapePosition() {
  int x = gl_VertexID % u_gridSize;
  int z = gl_VertexID / u_gridSize;

  float xNorm = float(x) / float(u_gridSize - 1) * 2.0 - 1.0;
  float zNorm = float(z) / float(u_gridSize - 1) * 2.0 - 1.0;

  float scaledTime = u_t * landscapeSpeed;
  float cellSize = 2.0 / float(u_gridSize);
  float cellOffset = floor(scaledTime / cellSize) * cellSize;
  
  float zOffset = mod(scaledTime, cellSize);
  vec2 noiseSample = vec2(xNorm / u_aspectRatio,  zNorm - cellOffset);
  float yDisplacement = sampleNoise2(noiseSample * noiseFreqA) * noiseAmpA
    + sampleNoise2(noiseSample * noiseFreqB) * noiseAmpB;
  vec4 position = vec4(xNorm / u_aspectRatio, landscapeYOffset + yDisplacement, zNorm + zOffset, 1.0);

  return v_projectionMatrix * position;
}

vec4 getBirdDisplacement(float t) {
  float tScaled = t * birdSpeed;
  float x = sampleNoise3(vec3(tScaled, 0, 0));
  float y = sampleNoise3(vec3(0, tScaled, 0));
  float z = sampleNoise3(vec3(0, 0, tScaled));
  return vec4(vec3(x, y, z) * birdDisplacementScale, 0.0) + birdOffset;
}

mat4 getBirdRotationMatrix(vec3 rotations) {
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

mat4 getBirdRotation(vec4 displacement) {
  vec4 nextDisplacement = getBirdDisplacement(u_t + 1.0);
  vec4 diff = nextDisplacement - displacement;
  vec3 rotations = vec3(-diff.y * 5.0, diff.x, diff.x ) * 1000.0;
  return getBirdRotationMatrix(rotations);
}

vec4 getBirdVertexPosition() {
  v_birdDisplacement = getBirdDisplacement(u_t);
  mat4 rotation = getBirdRotation(v_birdDisplacement);

  vec4 position = rotation * a_position * birdScale + v_birdDisplacement;
  return v_projectionMatrix * position;
}

void main() {
  v_projectionMatrix = mat4(
    f / u_aspectRatio, 0.0, 0.0, 0.0,
    0.0, f, 0.0, 0.0,
    0.0, 0.0, (far + near) / (near - far), -1.0,
    0.0, 0.0, (2.0 * far * near) / (near - far), 0.0
  );

  vec4 landscapePosition = getLandscapePosition();
  vec4 birdVertexPosition = getBirdVertexPosition();
  vec4 position = mat4(
    landscapePosition,
    landscapePosition + vec4(0.0, landscapeLineOffset, 0.0, 0.0),
    birdVertexPosition,
    vec4(0)
  )[u_bufferIndex];

  gl_Position = position;
  v_uv = position.xz;
}