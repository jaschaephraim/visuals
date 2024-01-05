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
uniform float u_fov;
uniform float u_cameraHeight;

in vec4 a_position;
out vec2 v_uv;
out mat4 v_projectionMatrix;
out mat4 v_birdDisplacements;

// projection
const float near = 0.1;
const float far = 100.0;

// landscape
const float landscapeSpeed = 0.0002;
const float landscapeLineOffset = 0.0001;

// landscape noise
const float noiseFreqA = 3.0;
const float noiseAmpA = 0.05;
const float noiseFreqB = 8.0;
const float noiseAmpB = 0.025;

// bird
mat4 nextBirdDisplacements;
const float birdScale = 0.01;
const float birdSpeed = 0.0003;
const float flapSpeed = 0.02;
const vec3 birdDisplacementScale = vec3(0.4, 0.15, 0.14);
const vec4 birdOffset = vec4(0.0, 0.2, -0.3, 1.0);
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
  ivec2 coord = ivec2(
    gl_VertexID % u_gridSize,
    gl_VertexID / u_gridSize
  );

  vec2 norm = vec2(coord) / float(u_gridSize - 1) * 2.0 - 1.0;
  float xNorm = norm.x;
  float zNorm = norm.y;

  float scaledTime = u_t * landscapeSpeed;
  float cellSize = 2.0 / float(u_gridSize);
  float cellOffset = floor(scaledTime / cellSize) * cellSize;
  
  float zOffset = mod(scaledTime, cellSize);
  vec2 noiseSample = vec2(xNorm / u_aspectRatio,  zNorm - cellOffset);
  float yDisplacement = sampleNoise2(noiseSample * noiseFreqA) * noiseAmpA
    + sampleNoise2(noiseSample * noiseFreqB) * noiseAmpB;
  vec4 position = vec4(xNorm / u_aspectRatio, yDisplacement, zNorm + zOffset, 1.0);

  return v_projectionMatrix * position;
}

mat4 getBirdDisplacements(float t) {
  float tScaled = t * birdSpeed;
  vec3 displacement1 = vec3(
    sampleNoise3(vec3(tScaled, 0, 0) + birdNoiseOffsets[0]),
    sampleNoise3(vec3(0, tScaled, 0) + birdNoiseOffsets[0]),
    sampleNoise3(vec3(0, 0, tScaled) + birdNoiseOffsets[0])
  );
  vec3 displacement2 = vec3(
    sampleNoise3(vec3(tScaled, 0, 0) + birdNoiseOffsets[1]),
    sampleNoise3(vec3(0, tScaled, 0) + birdNoiseOffsets[1]),
    sampleNoise3(vec3(0, 0, tScaled) + birdNoiseOffsets[1])
  );

  return mat4(
    vec4(displacement1 * birdDisplacementScale, 0.0) + birdOffset,
    vec4(displacement2 * birdDisplacementScale, 0.0) + birdOffset,
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
  vec4 nextDisplacement = nextBirdDisplacements[birdIndex];
  vec4 diff = nextDisplacement - displacement;

  vec3 rotations = vec3(-diff.y * 5.0, diff.x, diff.x ) * 1000.0;
  return getBirdRotationMatrix(rotations);
}

vec4 getWingTipPosition(int birdIndex) {
  vec4 displacement = v_birdDisplacements[birdIndex];
  vec4 flapPosition = a_position + (sin(flapSpeed * u_t) - 0.5) / 1.5;
  return mix(
    flapPosition,
    a_position,
    smoothstep(0.0, 0.5, (displacement.y - birdOffset.y) / birdDisplacementScale.y + 0.5)
  );
}

vec4 getBirdVertexPosition(int birdIndex) {
  return vec4[6](
    a_position,
    getWingTipPosition(birdIndex),
    a_position,
    a_position,
    getWingTipPosition(birdIndex),
    a_position
  )[gl_VertexID];
}

vec4 getRotatedVertexForBird(int birdIndex) {
  mat4 rotation = getBirdRotation(birdIndex);
  return rotation * getBirdVertexPosition(birdIndex);
}

mat4 getBirdVertexPositions() {
  mat4 vertices = mat4(
    getRotatedVertexForBird(0),
    getRotatedVertexForBird(1),
    vec4(0),
    vec4(0)
  ) * birdScale;
  mat4 positions = vertices + v_birdDisplacements;
  return v_projectionMatrix * positions;
}

void main() {
  float f = 1.0 / tan(u_fov / 2.0);
  v_projectionMatrix = mat4(
    f / u_aspectRatio, 0.0, 0.0, 0.0,
    0.0, f, 0.0, 0.0,
    0.0, 0.0, (far + near) / (near - far), -1.0,
    0.0, 0.0, (2.0 * far * near) / (near - far), 0.0
  );

  v_birdDisplacements = getBirdDisplacements(u_t);
  nextBirdDisplacements = getBirdDisplacements(u_t + 1.0);

  vec4 landscapePosition = getLandscapePosition();
  mat4 birdVertexPositions = getBirdVertexPositions();
  vec4 position = mat4(
    landscapePosition,
    landscapePosition + vec4(0.0, landscapeLineOffset, 0.0, 0.0),
    birdVertexPositions[0],
    birdVertexPositions[1]
  )[u_bufferIndex];

  gl_Position = position - vec4(0.0, u_cameraHeight, 0.0, 0.0);
  v_uv = position.xz;
}