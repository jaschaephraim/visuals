#version 300 es
#extension GL_GOOGLE_include_directive : enable

precision mediump float;
precision mediump int;

#include "palette.glsl"
#include "bird-displacement.glsl"

uniform int u_bufferIndex;
uniform mat4 u_projectionMatrix;
uniform float u_t;

in vec2 v_uv;
out vec4 out_color;

const vec4 faceColor = champagne;
const vec4 edgeColor = seaSalt;
const vec4 shadowColor = vec4(vanDyke.rgb, 0.35);
const float shadowRadius = 0.1;
const float shadowOffset = 0.035;

void main() {
  vec4 displacement = u_projectionMatrix * getDisplacement(u_t);
  float height = displacement.y + 1.0 / 2.0;

  float birdDistance = distance(v_uv, displacement.xz);
  float shadowSize = height * shadowRadius - shadowOffset;
  float shadowValue = smoothstep(0.0, shadowSize, birdDistance);
  vec4 finalColor = mix(shadowColor, faceColor, shadowValue);

  out_color = mat4(
    finalColor,
    edgeColor,
    vec4(0),
    vec4(0)
  )[u_bufferIndex];
}