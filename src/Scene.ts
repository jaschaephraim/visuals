import Stats from 'stats.js';

import Program from './Program';
import { SceneConfig } from './types';

const { COLOR_BUFFER_BIT, DEPTH_BUFFER_BIT } = WebGL2RenderingContext;

export type SceneArgs = {
  window: Window;
  webgl: WebGL2RenderingContext;
  config: SceneConfig;
  dimensions: { width: number; height: number };
  stats?: Stats;
};

class Scene {
  private window: Window;

  private webgl: WebGL2RenderingContext;

  private config: SceneConfig;

  private programs: Program[] = [];

  private stats: Stats | undefined;

  constructor({
    window,
    webgl,
    config,
    dimensions: { width, height },
    stats,
  }: SceneArgs) {
    this.window = window;
    this.webgl = webgl;
    this.config = config;
    this.stats = stats;

    this.linkPrograms(width, height);
  }

  public run() {
    const frame = (t: number) => {
      this.window.requestAnimationFrame(() => frame(t + 1));

      this.stats?.begin();
      this.renderFrame(t);
      this.stats?.end();
    };
    frame(0);
  }

  private linkPrograms(width: number, height: number) {
    this.config.programs.forEach((programConfig) => {
      const program = new Program({
        webgl: this.webgl,
        config: programConfig,
        dimensions: { width, height },
      });
      this.programs.push(program);
    });
  }

  private clear() {
    this.webgl.clearColor(0, 0, 0, 0);
    this.webgl.clear(COLOR_BUFFER_BIT | DEPTH_BUFFER_BIT);
  }

  private renderFrame(t: number) {
    this.clear();
    this.programs.forEach((program) => {
      program.use();
      program.draw(t);
    });
  }
}

export default Scene;
