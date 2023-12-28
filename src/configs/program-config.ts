import fragmentShader from 'shaders/main.frag';
import vertexShader from 'shaders/main.vert';
import { ProgramConfig, Vector } from '../types';

const {
  ARRAY_BUFFER,
  ELEMENT_ARRAY_BUFFER,
  FLOAT,
  FLOAT_VEC4,
  FRAGMENT_SHADER,
  INT,
  LINES,
  TRIANGLES,
  VERTEX_SHADER,
} = WebGL2RenderingContext;

const GRID_SIZE = 100;

function hexToRgb(hex: string): Vector {
  let r = parseInt(hex.substring(1, 3), 16) / 255;
  let g = parseInt(hex.substring(3, 5), 16) / 255;
  let b = parseInt(hex.substring(5, 7), 16) / 255;
  return [r, g, b, 1];
}

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

export type Config = {
  aspectRatio: number;
  fov: number;
  cameraHeight: number;
  edgeColor: string;
  faceColor: string;
  birdColor: string;
  shadowColor: string;
};

function getConfig({
  aspectRatio,
  fov,
  cameraHeight,
  edgeColor,
  faceColor,
  birdColor,
  shadowColor,
}: Config): ProgramConfig {
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
      {
        name: 'u_fov',
        type: FLOAT,
        value: fov,
      },
      {
        name: 'u_cameraHeight',
        type: FLOAT,
        value: cameraHeight,
      },
      {
        name: 'u_edgeColor',
        type: FLOAT_VEC4,
        value: hexToRgb(edgeColor),
      },
      {
        name: 'u_faceColor',
        type: FLOAT_VEC4,
        value: hexToRgb(faceColor),
      },
      {
        name: 'u_birdColor',
        type: FLOAT_VEC4,
        value: hexToRgb(birdColor),
      },
      {
        name: 'u_shadowColor',
        type: FLOAT_VEC4,
        value: hexToRgb(shadowColor),
      },
    ],
    buffers: [
      {
        name: 'faces',
        type: ELEMENT_ARRAY_BUFFER,
        mode: TRIANGLES,
        drawCount: 1,
        values: generateTriangleIndexArray(),
      },
      {
        name: 'edges',
        type: ELEMENT_ARRAY_BUFFER,
        mode: LINES,
        drawCount: 1,
        values: generateLineIndexArray(),
      },
      {
        name: 'bird',
        type: ARRAY_BUFFER,
        mode: TRIANGLES,
        drawCount: 2,
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
