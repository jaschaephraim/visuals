import fragmentShader from 'shaders/main.frag';
import vertexShader from 'shaders/main.vert';

class Program {
  private webgl: WebGL2RenderingContext;

  private lineIndexArray: Uint16Array;

  private triangleIndexArray: Uint16Array;

  private lineIndexBuffer: WebGLBuffer;

  private triangleIndexBuffer: WebGLBuffer;

  private program: WebGLProgram;

  private aspectRatio: number;

  private gridDimension = 100;

  constructor(webgl: WebGL2RenderingContext, aspectRatio: number) {
    this.webgl = webgl;
    this.aspectRatio = aspectRatio;

    this.lineIndexArray = this.generateLineIndexArray();
    this.triangleIndexArray = this.generateTriangleIndexArray();

    this.lineIndexBuffer = this.createIndexBuffer(this.lineIndexArray);
    this.triangleIndexBuffer = this.createIndexBuffer(this.triangleIndexArray);

    this.program = this.createProgram();
  }

  private generateLineIndexArray() {
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

  private generateTriangleIndexArray() {
    const lastGridIndex = this.gridDimension - 1;
    const elements: number[] = [];
    for (let i = 0; i < this.gridDimension * this.gridDimension; i++) {
      if (i % this.gridDimension < lastGridIndex && Math.floor(i / this.gridDimension) < lastGridIndex) {
        const nw = i;
        const ne = i + 1;
        const se = i + this.gridDimension + 1;
        const sw = i + this.gridDimension;
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

  public draw(t: number) {
    const timeUniform = this.webgl.getUniformLocation(this.program, 'u_t');
    const isFaceUniform = this.webgl.getUniformLocation(this.program, 'u_isFace');
    
    this.webgl.uniform1i(timeUniform, t);

    // this.webgl.clearColor(0, 0, 0, 1);
    this.webgl.clearColor(0.9803921569, 0.9215686275, 0.7843137255, 1);
    this.webgl.clear(this.webgl.COLOR_BUFFER_BIT);

    this.webgl.uniform1i(isFaceUniform, 1);
    this.webgl.bindBuffer(this.webgl.ELEMENT_ARRAY_BUFFER, this.triangleIndexBuffer);
    this.webgl.drawElements(this.webgl.TRIANGLES, this.triangleIndexArray.length, this.webgl.UNSIGNED_SHORT, 0);

    this.webgl.uniform1i(isFaceUniform, 0);
    this.webgl.bindBuffer(this.webgl.ELEMENT_ARRAY_BUFFER, this.lineIndexBuffer);
    this.webgl.drawElements(this.webgl.LINES, this.lineIndexArray.length, this.webgl.UNSIGNED_SHORT, 0);
  }

  private createIndexBuffer(indexArray: Uint16Array) {
    const indexBuffer = this.webgl.createBuffer();
    if (!indexBuffer) {
      throw new Error('unable to create index buffer');
    }
    this.webgl.bindBuffer(this.webgl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    this.webgl.bufferData(this.webgl.ELEMENT_ARRAY_BUFFER, indexArray, this.webgl.STATIC_DRAW);
    return indexBuffer;
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
  
    return program;
  }
}

export default Program;