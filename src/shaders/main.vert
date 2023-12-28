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
out mat4 v_birdDisplacements;

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
const mat3 birdNoiseOffsets = mat3(
  -1, 0, 1,
  0, 1, -1,
  1, -1, 0
);

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

mat4 getBirdDisplacements(float t) {
  float tScaled = t * birdSpeed;
  vec2 x = vec2(
    sampleNoise3(vec3(tScaled, 0, 0) + birdNoiseOffsets[0]),
    sampleNoise3(vec3(tScaled, 0, 0) + birdNoiseOffsets[1])
  );
  vec2 y = vec2(
    sampleNoise3(vec3(0, tScaled, 0) + birdNoiseOffsets[0]),
    sampleNoise3(vec3(0, tScaled, 0) + birdNoiseOffsets[1])
  );
  vec2 z = vec2(
    sampleNoise3(vec3(0, 0, tScaled) + birdNoiseOffsets[0]),
    sampleNoise3(vec3(0, 0, tScaled) + birdNoiseOffsets[1])
  );
  return mat4(
    vec4(vec3(x[0], y[0], z[0]) * birdDisplacementScale, 0.0) + birdOffset,
    vec4(vec3(x[1], y[1], z[1]) * birdDisplacementScale, 0.0) + birdOffset,
    vec4(0),
    vec4(0)
  );
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

mat4 getBirdRotation(int birdIndex) {
  vec4 displacement = v_birdDisplacements[birdIndex];
  vec4 nextDisplacement = getBirdDisplacements(u_t + 1.0)[birdIndex];
  vec4 diff = nextDisplacement - displacement;
  vec3 rotations = vec3(-diff.y * 5.0, diff.x, diff.x ) * 1000.0;
  return getBirdRotationMatrix(rotations);
}

vec4 getVertexPosition(int birdIndex) {
  mat4 rotation = getBirdRotation(birdIndex);
  return rotation * a_position * birdScale;
}

mat4 getBirdVertexPositions() {
  mat4 vertices = mat4(
    getVertexPosition(0),
    getVertexPosition(1),
    vec4(0),
    vec4(0)
  );
  mat4 positions = vertices + v_birdDisplacements;
  return v_projectionMatrix * positions;
}

void main() {
  v_projectionMatrix = mat4(
    f / u_aspectRatio, 0.0, 0.0, 0.0,
    0.0, f, 0.0, 0.0,
    0.0, 0.0, (far + near) / (near - far), -1.0,
    0.0, 0.0, (2.0 * far * near) / (near - far), 0.0
  );

  v_birdDisplacements = getBirdDisplacements(u_t);

  vec4 landscapePosition = getLandscapePosition();
  mat4 birdVertexPositions = getBirdVertexPositions();
  vec4 position = mat4(
    landscapePosition,
    landscapePosition + vec4(0.0, landscapeLineOffset, 0.0, 0.0),
    birdVertexPositions[0],
    birdVertexPositions[1]
  )[u_bufferIndex];

  gl_Position = position;
  v_uv = position.xz;
}