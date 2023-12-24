import fragmentShader from 'shaders/birds.frag';
import vertexShader from 'shaders/birds.vert';
import { ProgramConfig } from '../types';
import { getProjectionMatrix, getRotationMatrix } from './perspective';

const {
  ELEMENT_ARRAY_BUFFER,
  FLOAT,
  FLOAT_MAT4,
  FRAGMENT_SHADER,
  INT,
  POINTS,
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
        name: 'u_rotationMatrix',
        type: FLOAT_MAT4,
        value: getRotationMatrix(),
      },
      {
        name: 'u_projectionMatrix',
        type: FLOAT_MAT4,
        value: getProjectionMatrix(aspectRatio),
      },
    ],
    buffers: [
      {
        name: 'birds',
        type: ELEMENT_ARRAY_BUFFER,
        mode: POINTS,
        values: new Uint16Array([0]),
      },
    ],
  };
}

export default getConfig;
