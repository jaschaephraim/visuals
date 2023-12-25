#version 300 es

precision mediump float;
precision mediump int;

uniform sampler2D u_texture;

out vec4 out_color;

void main() {
  out_color = texture(u_texture, v_uv);
}