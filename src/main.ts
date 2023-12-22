import Program from "./Program";
import config from "./config";

function resizeCanvas(window: Window, canvas: HTMLCanvasElement) {
  const boundary = canvas.getBoundingClientRect();
  canvas.width = boundary.width * window.devicePixelRatio;
  canvas.height = boundary.height * window.devicePixelRatio;
  
  const aspectRatio = canvas.width / canvas.height;
  return aspectRatio;
}

export function render(window: Window, canvas: HTMLCanvasElement) {
  const aspectRatio = resizeCanvas(window, canvas);

  const webgl = canvas.getContext('webgl2');
  if (!webgl) {
    throw new Error('unable to get webgl context');
  }

  const program = new Program(webgl, config, aspectRatio);
  const drawFrame = (t: number) => {
    window.requestAnimationFrame(() => drawFrame(t + 1));
    program.draw(t);
  }
  drawFrame(0);
}
