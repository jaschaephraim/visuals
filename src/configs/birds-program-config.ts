import fragmentShader from 'shaders/birds.frag';
import vertexShader from 'shaders/birds.vert';
import { ProgramConfig } from '../types';
import { getProjectionMatrix } from './perspective';

const {
  ARRAY_BUFFER,
  FLOAT,
  FLOAT_MAT4,
  FRAGMENT_SHADER,
  INT,
  TRIANGLES,
  VERTEX_SHADER,
} = WebGL2RenderingContext;

function getConfig(aspectRatio: number): ProgramConfig {
  return {
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
        name: 'u_aspectRatio',
        type: FLOAT,
        value: aspectRatio,
      },
      {
        name: 'u_t',
        type: INT,
        value: 0,
      },
      {
        name: 'u_projectionMatrix',
        type: FLOAT_MAT4,
        value: getProjectionMatrix(aspectRatio),
      },
    ],
    buffers: [
      {
        name: 'bird',
        type: ARRAY_BUFFER,
        mode: TRIANGLES,
        // prettier-ignore
        values: new Float32Array([
          0, 0, -0.2,
          -1, 0.5, 0,
          0, 0, 0.2,
          0, 0, 0.2,
          1, 0.5, 0,
          0, 0, -0.2,
        ]),
      },
    ],
  };
}

export default getConfig;
