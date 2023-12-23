import Scene from './Scene';
import sceneConfig from './configs/scene-config';

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

  const scene = new Scene(window, webgl, sceneConfig, aspectRatio);
  scene.run();
}
