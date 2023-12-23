import Stats from 'stats.js';

import Program from './Program';
import { SceneConfig } from './types';

const { COLOR_BUFFER_BIT, DEPTH_BUFFER_BIT } = WebGL2RenderingContext;

class Scene {
  private window: Window;

  private webgl: WebGL2RenderingContext;

  private config: SceneConfig;

  private programs: Program[] = [];

  private aspectRatio: number;

  private stats: Stats | undefined;

  constructor(
    window: Window,
    webgl: WebGL2RenderingContext,
    config: SceneConfig,
    aspectRatio: number,
    stats?: Stats
  ) {
    this.window = window;
    this.webgl = webgl;
    this.config = config;
    this.aspectRatio = aspectRatio;
    this.stats = stats;

    this.linkPrograms();
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

  private linkPrograms() {
    this.config.programs.forEach((programConfig) => {
      const program = new Program(this.webgl, programConfig, this.aspectRatio);
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
