import fragmentShader from 'shaders/main.frag';
import vertexShader from 'shaders/main.vert';
import { ProgramConfig } from '../types';

const {
  ARRAY_BUFFER,
  ELEMENT_ARRAY_BUFFER,
  FLOAT,
  FRAGMENT_SHADER,
  INT,
  LINES,
  TRIANGLES,
  VERTEX_SHADER,
} = WebGL2RenderingContext;

const GRID_SIZE = 100;

function generateLineIndexArray() {
  const lastGridIndex = GRID_SIZE - 1;
  const elements: number[] = [];
  for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
    if (i % GRID_SIZE < lastGridIndex) {
      elements.push(i);
      elements.push(i + 1);
    }
    // if (Math.floor(i / GRID_SIZE) < lastGridIndex) {
    //   elements.push(i);
    //   elements.push(i + GRID_SIZE);
    // }
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

function getConfig(aspectRatio: number): ProgramConfig {
  return {
    drawToFramebuffer: false,
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
        type: FLOAT,
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
