#version 300 es

precision mediump float;
precision mediump int;

uniform sampler2D u_texture;

in vec2 v_uv;
out vec4 out_color;

void main() {
  vec4 color = texture(u_texture, v_uv);
  if (color.a == 0.0) {
    discard;
  }
  out_color = color;
}