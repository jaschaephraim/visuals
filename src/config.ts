import fragmentShader from 'shaders/main.frag';
import vertexShader from 'shaders/main.vert';

const GRID_SIZE = 100;

export type ShaderConfig = { name: string; type: number; source: string };

export type UniformConfig = { name: string, type: number; value: number };

export type BufferConfig = { name: string, type: number; values: Float32Array | Uint16Array };

export type ProgramConfig = {
  shaders: ShaderConfig[],
  uniforms: UniformConfig[],
  buffers: BufferConfig[],
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
    if (i % GRID_SIZE < lastGridIndex && Math.floor(i / GRID_SIZE) < lastGridIndex) {
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
      type: WebGL2RenderingContext.VERTEX_SHADER,
      source: vertexShader,
    },
    {
      name: 'fragment',
      type: WebGL2RenderingContext.FRAGMENT_SHADER,
      source: fragmentShader,
    },
  ],
  uniforms: [
    {
      name: 'u_aspectRatio',
      type: WebGL2RenderingContext.FLOAT,
      value: 1,
    },
    {
      name: 'u_gridSize',
      type: WebGL2RenderingContext.INT,
      value: GRID_SIZE,
    },
    {
      name: 'u_bufferIndex',
      type: WebGL2RenderingContext.INT,
      value: 0,
    },
    {
      name: 'u_t',
      type: WebGL2RenderingContext.INT,
      value: 0,
    }
  ],
  buffers: [
    {
      name: 'faces',
      type: WebGL2RenderingContext.TRIANGLES,
      values: generateTriangleIndexArray(),
    },
    {
      name: 'edges',
      type: WebGL2RenderingContext.LINES,
      values: generateLineIndexArray(),
    }
  ]
}

export default config;