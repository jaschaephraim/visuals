#version 300 es
#extension GL_GOOGLE_include_directive : enable

precision mediump float;
precision mediump int;

uniform int u_bufferIndex;
uniform float u_t;
uniform vec4 u_edgeColor;
uniform vec4 u_faceColor;
uniform vec4 u_birdColor;
uniform vec4 u_shadowColor;

in vec2 v_uv;
in mat4 v_projectionMatrix;
in mat4 v_birdDisplacements;
out vec4 out_color; 

const float shadowRadius = 0.1;
const float shadowOffset = 0.035;

void main() {
  mat4 displacements = v_projectionMatrix * v_birdDisplacements;
  vec2 heights = vec2(
    displacements[0].y,
    displacements[1].y
  ) + 1.0 / 2.0;
  vec2 birdDistances = vec2(
    distance(v_uv, displacements[0].xz),
    distance(v_uv, displacements[1].xz)
  );
  
  vec4 shadowColor = vec4(u_shadowColor.rgb, 0.35);
  vec2 shadowSizes = heights * shadowRadius - shadowOffset;
  vec2 shadowValues = vec2(
    smoothstep(0.0, shadowSizes[0], birdDistances[0]),
    smoothstep(0.0, shadowSizes[1], birdDistances[1])
  );
  vec4 finalColor = mix(shadowColor, u_faceColor, min(shadowValues[0], shadowValues[1]));

  out_color = mat4(
    finalColor,
    u_edgeColor,
    u_birdColor,
    u_birdColor
  )[u_bufferIndex];
}