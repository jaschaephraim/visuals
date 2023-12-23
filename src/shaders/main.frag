#version 300 es

precision mediump float;
precision mediump int;

uniform int u_bufferIndex;
uniform int u_t;

in vec2 v_uv;
out vec4 out_color;

const vec2 sunCenter = vec2(0.0, -0.8);
const float sunRadius = 1.0;

const vec4 eerieBlack = vec4(0.12549019607843137, 0.11372549019607843, 0.09411764705882353, 1.0);
const vec4 darkPurple = vec4(0.21568627450980393, 0.16470588235294117, 0.24705882352941178, 1.0);
const vec4 airForceBlue = vec4(0.3568627450980392, 0.5294117647058824, 0.6392156862745098, 1.0);
const vec4 champagne = vec4(0.984313725490196, 0.8980392156862745, 0.7647058823529411, 1.0);
const vec4 mustard = vec4(1.0, 0.8549019607843137, 0.26666666666666666, 1.0);
const vec4 vermillion = vec4(0.8392156862745098, 0.26666666666666666, 0.21568627450980393, 1.0);

const mat4 sunColors = mat4(darkPurple, airForceBlue, mustard, vermillion);
const vec4 faceColor = champagne;
const vec4 edgeColor = vec4(1.0);

// vec4 getBackgroundColor() {
//   float centerDistance = distance(v_uv, sunCenter);
//   return mix(
//     sunColors[int(mod(centerDistance / sunRadius * 4.0 - float(u_t) * 0.02, 4.0))],
//     faceColor,
//     step(sunRadius, centerDistance)
//   );
// }

vec4 getBackgroundColor() {
  float centerDistance = distance(v_uv, sunCenter);
  return mix(vermillion, faceColor, smoothstep(0.6, 1.0, centerDistance / sunRadius));
}

void main() {
  vec4 backgroundColor = getBackgroundColor();
  out_color = mat4(
    backgroundColor,
    faceColor,
    edgeColor,
    vec4(0)
  )[u_bufferIndex];
}