#version 300 es
#extension GL_GOOGLE_include_directive : enable

precision mediump float;
precision mediump int;

#include "palette.glsl"

out vec4 out_color;

void main() {
  out_color = englishViolet;
}