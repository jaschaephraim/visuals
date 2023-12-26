import Stats from 'stats.js';

import Scene from './Scene';
import getSceneConfig from './configs/scene-config';

function resizeCanvas(window: Window, canvas: HTMLCanvasElement) {
  const boundary = canvas.getBoundingClientRect();
  canvas.width = boundary.width * window.devicePixelRatio;
  canvas.height = boundary.height * window.devicePixelRatio;

  const aspectRatio = canvas.width / canvas.height;
  return aspectRatio;
}

export function render(window: Window, canvas: HTMLCanvasElement) {
  let aspectRatio = resizeCanvas(window, canvas);
  aspectRatio = 1;

  const stats = new Stats();
  canvas.parentElement?.appendChild(stats.dom);

  const webgl = canvas.getContext('webgl2');
  if (!webgl) {
    throw new Error('unable to get webgl context');
  }

  // if (spector) {
  //   spector.startCapture(webgl);
  // }

  const scene = new Scene({
    window,
    webgl,
    config: getSceneConfig(aspectRatio),
    dimensions: { width: canvas.width, height: canvas.height },
    stats,
  });
  scene.run();

  // if (spector) {
  //   SpeechRecognitionResult.stopCapture();
  // }
}
