#version 300 es
#extension GL_GOOGLE_include_directive : enable

precision mediump float;
precision mediump int;

#include "psrdnoise2.glsl"

uniform float u_aspectRatio;
uniform int u_gridSize;
uniform int u_bufferIndex;
uniform int u_t;
uniform mat4 u_projectionMatrix;

const float speed = 0.005;
const float yOffset = -0.5;

const float noiseFreqA = 3.0;
const float noiseAmpA = 0.05;
const float noiseFreqB = 8.0;
const float noiseAmpB = 0.03;

float sampleNoise(vec2 coord) {
  vec2 gradient = vec2(0.0);
  return psrdnoise(coord, vec2(0.0), 0.0, gradient);
}

vec4 getLandscapePosition() {
  int x = gl_VertexID % u_gridSize;
  int z = gl_VertexID / u_gridSize;

  float xNorm = float(x) / float(u_gridSize - 1) * 2.0 - 1.0;
  float zNorm = float(z) / float(u_gridSize - 1) * 2.0 - 1.0;

  float scaledTime = float(u_t) * speed;
  float cellSize = 2.0 / float(u_gridSize);
  float cellOffset = floor(scaledTime / cellSize) * cellSize;
  
  float zOffset = mod(scaledTime, cellSize);
  vec2 noiseSample = vec2(xNorm / u_aspectRatio,  zNorm - cellOffset);
  float yDisplacement = sampleNoise(noiseSample * noiseFreqA) * noiseAmpA
    + sampleNoise(noiseSample * noiseFreqB) * noiseAmpB;
  vec4 position = vec4(xNorm / u_aspectRatio, yOffset + yDisplacement, zNorm + zOffset, 1.0);

  return u_projectionMatrix * position;
}

void main() {  
  vec4 landscapePosition = getLandscapePosition();
  gl_Position = mat4(
    landscapePosition,
    landscapePosition + vec4(0.0, 0.0001, 0.0, 0.0),
    vec4(0),
    vec4(0)
  )[u_bufferIndex]; 
}