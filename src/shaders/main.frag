#version 300 es

precision mediump float;
precision mediump int;

uniform int u_bufferIndex;

out vec4 out_color;

const vec4 backgroundColor = vec4(0.9019607843, 0.2941176471, 0.2156862745, 1.0);
const vec4 faceColor = vec4(0.9803921569, 0.9215686275, 0.7843137255, 1.0);
const vec4 edgeColor = vec4(1.0);

void main() {
  bool isBackground = u_bufferIndex == 0;
  bool isFace = u_bufferIndex == 1;
  out_color = float(isBackground) * float(!isFace) * backgroundColor
    + float(!isBackground) * float(isFace) * faceColor
    + float(!isBackground) * float(!isFace) * edgeColor;
}