#version 300 es
#extension GL_GOOGLE_include_directive : enable

precision mediump float;
precision mediump int;

#include "/generative/snoise.glsl"

uniform float u_aspectRatio;
uniform int u_gridSize;
uniform int u_bufferIndex;
uniform int u_t;

const float u_tiltAngle = 1.5;
const float u_fov = 2.5;
const float u_near = 0.1;
const float u_far = 100.0;

const float speed = 0.005;
const float zOffset = -0.3;

const float noiseFreqA = 3.0;
const float noiseAmpA = 0.05;
const float noiseFreqB = 8.0;
const float noiseAmpB = 0.03;

const float cosTilt = cos(u_tiltAngle);
const float sinTilt = sin(u_tiltAngle);
const mat4 rotationMatrix = mat4(
  1.0, 0.0, 0.0, 0.0,
  0.0, cosTilt, -sinTilt, 0.0,
  0.0, sinTilt, cosTilt, 0.0,
  0.0, 0.0, 0.0, 1.0
);

const float f = 1.0 / tan(u_fov / 2.0);

vec4 getLandscapePosition(mat4 projectionMatrix) {
  int x = gl_VertexID % u_gridSize;
  int y = gl_VertexID / u_gridSize;

  float xNorm = float(x) / float(u_gridSize - 1) * 2.0 - 1.0;
  float yNorm = float(y) / float(u_gridSize - 1) * 2.0 - 1.0;

  float scaledTime = float(u_t) * speed;
  float cellSize = 2.0 / float(u_gridSize);
  float cellOffset = floor(scaledTime / cellSize) * cellSize;
  
  float yOffset = mod(scaledTime, cellSize);
  float zOffset = -0.3;
  vec2 noiseSample = vec2(xNorm / u_aspectRatio,  yNorm + cellOffset);
  float zDisplacement = snoise(noiseSample * noiseFreqA) * noiseAmpA + snoise(noiseSample * noiseFreqB) * noiseAmpB;
  vec4 position = vec4(xNorm / u_aspectRatio, yNorm - yOffset, zOffset + zDisplacement, 1.0);

  return projectionMatrix * rotationMatrix * position;
}

void main() {
  mat4 projectionMatrix = mat4(
    f / u_aspectRatio, 0.0, 0.0, 0.0,
    0.0, f, 0.0, 0.0,
    0.0, 0.0, (u_far + u_near) / (u_near - u_far), -1.0,
    0.0, 0.0, (2.0 * u_far * u_near) / (u_near - u_far), 0.0
  );
  
  vec4 landscapePosition = getLandscapePosition(projectionMatrix);
  gl_Position = mat4(
    landscapePosition,
    landscapePosition + vec4(0.0, 0.0001, 0.0, 0.0),
    vec4(0),
    vec4(0)
  )[u_bufferIndex]; 
}