#version 300 es

precision mediump float;
precision mediump int;

in vec4 a_position;
out vec2 v_uv;

void main() {
  gl_Position = a_position;
  v_uv = (a_position.xy + 1.0) / 2.0;
}