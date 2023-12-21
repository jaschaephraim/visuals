import fragmentShader from 'shaders/main.frag';
import vertexShader from 'shaders/main.vert';

class Program {
  private window: Window;

  private canvas: HTMLCanvasElement;

  private webgl: WebGL2RenderingContext;

  private indexArray: Uint16Array;

  private program: WebGLProgram;

  private aspectRatio = 1;

  private gridDimension = 100;

  constructor(window: Window, canvas: HTMLCanvasElement) {
    this.window = window;
    this.canvas = canvas;
    this.resizeCanvas();

    const webgl = canvas.getContext('webgl2');
    if (!webgl) {
      throw new Error('unable to get webgl context');
    }
    this.webgl = webgl;

    this.indexArray = this.generateIndexArray();
    this.program = this.createProgram();
    this.draw(0);
  }

  private resizeCanvas() {
    const boundary = this.canvas.getBoundingClientRect();
    this.canvas.width = boundary.width * this.window.devicePixelRatio;
    this.canvas.height = boundary.height * this.window.devicePixelRatio;
    // this.aspectRatio = this.canvas.width / this.canvas.height;
  }

  private generateIndexArray() {
    const lastGridIndex = this.gridDimension - 1;
    const elements: number[] = [];
    for (let i = 0; i < this.gridDimension * this.gridDimension; i++) {
      if (i % this.gridDimension < lastGridIndex) {
        elements.push(i);
        elements.push(i + 1);
      }
      if (Math.floor(i / this.gridDimension) < lastGridIndex) {
        elements.push(i);
        elements.push(i + this.gridDimension);
      }
    }
    return new Uint16Array(elements);
  }

  private draw(t: number) {
    this.window.requestAnimationFrame(() => this.draw(t + 1));

    const timeUniform = this.webgl.getUniformLocation(this.program, 'u_t');
    this.webgl.uniform1i(timeUniform, t);

    this.webgl.clearColor(0, 0, 0, 1);
    this.webgl.clear(this.webgl.COLOR_BUFFER_BIT);
    this.webgl.drawElements(this.webgl.LINES, this.indexArray.length, this.webgl.UNSIGNED_SHORT, 0);
  }

  private createProgram() {
    const program = this.webgl.createProgram();
    if (!program) {
      throw new Error('unable to create program');
    }

    const shaders: { name: string; type: number; source: string }[] = [
      {
        name: 'vertex',
        type: this.webgl.VERTEX_SHADER,
        source: vertexShader,
      },
      {
        name: 'fragment',
        type: this.webgl.FRAGMENT_SHADER,
        source: fragmentShader,
      },
    ];

    shaders.forEach(({ name, type, source }) => {
      const shader = this.webgl.createShader(type);
      if (!shader) {
        throw new Error(`unable to create shader: ${name}`);
      }

      this.webgl.shaderSource(shader, source);
      this.webgl.compileShader(shader);

      if (!this.webgl.getShaderParameter(shader, this.webgl.COMPILE_STATUS)) {
        throw new Error(`unable to compile shader: ${name}`);
      }

      this.webgl.attachShader(program, shader);
    });

    this.webgl.linkProgram(program);
    if (!this.webgl.getProgramParameter(program, this.webgl.LINK_STATUS)) {
      throw new Error('unable to link program');
    }

    this.webgl.useProgram(program);

    const aspectRatioUniform = this.webgl.getUniformLocation(program, 'u_aspectRatio');
    this.webgl.uniform1f(aspectRatioUniform, this.aspectRatio);

    const gridSizeUniform = this.webgl.getUniformLocation(program, 'u_gridSize');
    this.webgl.uniform1i(gridSizeUniform, this.gridDimension);

    const indexBuffer = this.webgl.createBuffer();
    this.webgl.bindBuffer(this.webgl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    this.webgl.bufferData(this.webgl.ELEMENT_ARRAY_BUFFER, this.indexArray, this.webgl.STATIC_DRAW);
  
    return program;
  }
}

export default Program;