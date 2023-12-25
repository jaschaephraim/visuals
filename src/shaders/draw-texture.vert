#version 300 es

precision mediump float;
precision mediump int;

in vec4 a_position;

void main() {
  gl_Position = a_position;
}