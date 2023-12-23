import fragmentShader from 'shaders/birds.frag';
import vertexShader from 'shaders/birds.vert';
import { ProgramConfig } from '../types';

const {
  ELEMENT_ARRAY_BUFFER,
  FLOAT,
  FRAGMENT_SHADER,
  INT,
  POINTS,
  VERTEX_SHADER,
} = WebGL2RenderingContext;

const config: ProgramConfig = {
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
      value: 1,
    },
    {
      name: 'u_t',
      type: INT,
      value: 0,
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

export default config;
