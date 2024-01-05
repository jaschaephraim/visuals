import Stats from 'stats.js';

import Scene from './Scene';
import { Config } from './configs/program-config';
import getSceneConfig from './configs/scene-config';

function resizeCanvas(window: Window, canvas: HTMLCanvasElement) {
  const boundary = canvas.getBoundingClientRect();
  // eslint-disable-next-line no-param-reassign
  canvas.width = boundary.width * window.devicePixelRatio;
  // eslint-disable-next-line no-param-reassign
  canvas.height = boundary.height * window.devicePixelRatio;

  const aspectRatio = canvas.width / canvas.height;
  return aspectRatio;
}

export function renderVisuals(
  window: Window,
  canvas: HTMLCanvasElement,
  config: Omit<Config, 'aspectRatio'>,
  showStats: boolean = false
) {
  const aspectRatio = resizeCanvas(window, canvas);

  let stats: Stats | undefined;
  if (showStats) {
    stats = new Stats();
    canvas.parentElement?.appendChild(stats.dom);
  }

  const webgl = canvas.getContext('webgl2');
  if (!webgl) {
    throw new Error('unable to get webgl context');
  }

  const scene = new Scene({
    window,
    webgl,
    config: getSceneConfig({
      ...config,
      aspectRatio,
    }),
    dimensions: { width: canvas.width, height: canvas.height },
    stats,
  });
  scene.run();
}
