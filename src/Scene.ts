import Program from './Program';
import { SceneConfig } from './types';

class Scene {
  private window: Window;

  private webgl: WebGL2RenderingContext;

  private config: SceneConfig;

  private programs: Program[] = [];

  private aspectRatio: number;

  constructor(
    window: Window,
    webgl: WebGL2RenderingContext,
    config: SceneConfig,
    aspectRatio: number
  ) {
    this.window = window;
    this.webgl = webgl;
    this.aspectRatio = aspectRatio;
    this.config = config;

    this.linkPrograms();
  }

  public run() {
    const frame = (t: number) => {
      this.window.requestAnimationFrame(() => frame(t + 1));
      this.renderFrame(t);
    };
    frame(0);
  }

  private renderFrame(t: number) {
    this.programs.forEach((program) => {
      program.use();
      program.draw(t);
    });
  }

  private linkPrograms() {
    this.config.programs.forEach((programConfig) => {
      const program = new Program(this.webgl, programConfig, this.aspectRatio);
      this.programs.push(program);
    });
  }
}

export default Scene;
