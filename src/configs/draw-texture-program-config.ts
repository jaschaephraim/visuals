import vertexShader from 'shaders/draw-texture.vert';
import fragmentShader from 'shaders/draw-texture.frag';
import { ProgramConfig } from '../types';

const { ARRAY_BUFFER, FRAGMENT_SHADER, INT, TRIANGLES, VERTEX_SHADER } =
  WebGL2RenderingContext;

function getConfig(_aspectRatio: number): ProgramConfig {
  return {
    useFramebuffer: false,
    shaders: [
      {
        name: 'vertex',
        type: VERTEX_SHADER,
        source: vertexShader,
      },
      {
        name: 'fragment',
        type: FRAGMENT_SHADER,
        source: fragmentShader,
      },
    ],
    uniforms: [
      {
        name: 'u_texture',
        type: INT,
        value: 0,
      },
    ],
    buffers: [
      {
        name: 'screen',
        type: ARRAY_BUFFER,
        mode: TRIANGLES,
        // prettier-ignore
        values: new Float32Array([
          -1, 1, 0,
          1, 1, 0,
          -1, -1, 0,
          1, -1, 0,
          -1, -1, 0,
          1, 1, 0,
        ]),
      },
    ],
  };
}

export default getConfig;
