import createIndexArray from './elements';
import createProgram from './program';

const GRID_SIZE = 100;

function resizeCanvas(window: Window, canvas: HTMLCanvasElement) {
  const boundary = canvas.getBoundingClientRect();
  canvas.width = boundary.width * window.devicePixelRatio;
  canvas.height = boundary.height * window.devicePixelRatio;
}

export function render(window: Window, canvas: HTMLCanvasElement) {
  resizeCanvas(window, canvas);

  const webgl = canvas.getContext('webgl2');
  if (!webgl) {
    throw new Error('unable to get webgl context');
  }
  
  const aspectRatio = 1; // canvas.width / canvas.height;
  const indexArray = createIndexArray(GRID_SIZE);
  createProgram({ webgl, aspectRatio, gridSize: GRID_SIZE, indexArray });
}
