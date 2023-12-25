#version 300 es
#extension GL_GOOGLE_include_directive : enable

precision mediump float;
precision mediump int;

#include "palette.glsl"

uniform int u_bufferIndex;

out vec4 out_color;

const vec4 faceColor = champagne;
const vec4 edgeColor = seaSalt;

void main() {
  out_color = mat4(
    faceColor,
    edgeColor,
    vec4(0),
    vec4(0)
  )[u_bufferIndex];
}