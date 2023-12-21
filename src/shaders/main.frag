#version 300 es

precision mediump float;

uniform int u_isFace;

out vec4 out_color;

const vec4 edgeColor = vec4(1.0);
const vec4 faceColor = vec4(0.9803921569, 0.9215686275, 0.7843137255, 1.0);

void main() {
  float isFace = float(u_isFace);
  out_color = isFace * faceColor + (1.0 - isFace) * edgeColor;
}