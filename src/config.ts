import fragmentShader from 'shaders/main.frag';
import vertexShader from 'shaders/main.vert';

const {
  ELEMENT_ARRAY_BUFFER,
  FLOAT,
  FRAGMENT_SHADER,
  INT,
  LINES,
  POINTS,
  TRIANGLES,
  VERTEX_SHADER,
} = WebGL2RenderingContext;

const GRID_SIZE = 100;

export type ShaderConfig = { name: string; type: number; source: string };

export type UniformConfig = { name: string; type: number; value: number };

export type BufferConfig = {
  name: string;
  type: number;
  mode: number;
  values: Float32Array | Uint16Array;
};

export type ProgramConfig = {
  shaders: ShaderConfig[];
  uniforms: UniformConfig[];
  buffers: BufferConfig[];
};

function generateLineIndexArray() {
  const lastGridIndex = GRID_SIZE - 1;
  const elements: number[] = [];
  for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
    if (i % GRID_SIZE < lastGridIndex) {
      elements.push(i);
      elements.push(i + 1);
    }
    if (Math.floor(i / GRID_SIZE) < lastGridIndex) {
      elements.push(i);
      elements.push(i + GRID_SIZE);
    }
  }
  return new Uint16Array(elements);
}

function generateTriangleIndexArray() {
  const lastGridIndex = GRID_SIZE - 1;
  const elements: number[] = [];
  for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
    if (
      i % GRID_SIZE < lastGridIndex &&
      Math.floor(i / GRID_SIZE) < lastGridIndex
    ) {
      const nw = i;
      const ne = i + 1;
      const se = i + GRID_SIZE + 1;
      const sw = i + GRID_SIZE;
      elements.push(nw);
      elements.push(ne);
      elements.push(sw);
      elements.push(se);
      elements.push(sw);
      elements.push(ne);
    }
  }
  return new Uint16Array(elements);
}

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
      name: 'u_gridSize',
      type: INT,
      value: GRID_SIZE,
    },
    {
      name: 'u_bufferIndex',
      type: INT,
      value: 0,
    },
    {
      name: 'u_t',
      type: INT,
      value: 0,
    },
  ],
  buffers: [
    {
      name: 'faces',
      type: ELEMENT_ARRAY_BUFFER,
      mode: TRIANGLES,
      values: generateTriangleIndexArray(),
    },
    {
      name: 'edges',
      type: ELEMENT_ARRAY_BUFFER,
      mode: LINES,
      values: generateLineIndexArray(),
    },
    {
      name: 'birds',
      type: ELEMENT_ARRAY_BUFFER,
      mode: POINTS,
      values: new Uint16Array([0]),
    },
  ],
};

export default config;
