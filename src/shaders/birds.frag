#version 300 es

precision mediump float;
precision mediump int;

out vec4 out_color;

const vec4 darkPurple = vec4(0.21568627450980393, 0.16470588235294117, 0.24705882352941178, 1.0);

void main() {
  out_color = darkPurple;
}