#version 300 es
#extension GL_GOOGLE_include_directive : enable

precision mediump float;
precision mediump int;

#include "palette.frag.glsl"

uniform int u_bufferIndex;
uniform float u_t;

in vec2 v_uv;
in mat4 v_projectionMatrix;
in vec4 v_birdDisplacement;
out vec4 out_color;

const vec4 faceColor = champagne;
const vec4 edgeColor = seaSalt;
const vec4 shadowColor = vec4(vanDyke.rgb, 0.35);

const float shadowRadius = 0.1;
const float shadowOffset = 0.035;

void main() {
  vec4 displacement = v_projectionMatrix * v_birdDisplacement;
  float height = displacement.y + 1.0 / 2.0;
  float birdDistance = distance(v_uv, displacement.xz);
  float shadowSize = height * shadowRadius - shadowOffset;
  float shadowValue = smoothstep(0.0, shadowSize, birdDistance);
  vec4 finalColor = mix(shadowColor, faceColor, shadowValue);

  out_color = mat4(
    finalColor,
    edgeColor,
    airForceBlue,
    vec4(0)
  )[u_bufferIndex];
}