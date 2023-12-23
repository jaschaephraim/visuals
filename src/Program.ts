import {
  BufferConfig,
  ProgramConfig,
  ShaderConfig,
  UniformConfig,
} from './config';

const {
  ARRAY_BUFFER,
  COLOR_BUFFER_BIT,
  COMPILE_STATUS,
  DEPTH_BUFFER_BIT,
  DEPTH_TEST,
  ELEMENT_ARRAY_BUFFER,
  FLOAT,
  INT,
  LINK_STATUS,
  STATIC_DRAW,
  UNSIGNED_SHORT,
} = WebGL2RenderingContext;

class Program {
  private webgl: WebGL2RenderingContext;

  private config: ProgramConfig;

  private program: WebGLProgram;

  private aspectRatio: number;

  private uniforms: Record<string, WebGLUniformLocation> = {};

  private buffers: Record<string, WebGLBuffer> = {};

  constructor(
    webgl: WebGL2RenderingContext,
    config: ProgramConfig,
    aspectRatio: number
  ) {
    this.webgl = webgl;
    this.config = config;
    this.aspectRatio = aspectRatio;

    this.webgl.enable(DEPTH_TEST);

    const program = this.webgl.createProgram();
    if (!program) {
      throw new Error('unable to create program');
    }
    this.program = program;

    this.config.shaders.forEach((shaderConfig) =>
      this.attachShader(shaderConfig)
    );
    this.linkAndUseProgram();

    this.config.uniforms.forEach((uniformConfig) =>
      this.createUniform(uniformConfig)
    );
    this.config.buffers.forEach((bufferConfig) =>
      this.createBuffer(bufferConfig)
    );
  }

  public draw(t: number) {
    const timeUniform = this.getUniform('u_t');
    this.webgl.uniform1i(timeUniform, t);
    this.webgl.clearColor(
      0.984313725490196,
      0.8980392156862745,
      0.7647058823529411,
      1.0
    );
    this.webgl.clear(COLOR_BUFFER_BIT | DEPTH_BUFFER_BIT);
    this.config.buffers.forEach((bufferConfig, i) =>
      this.drawBuffer(bufferConfig, i)
    );
  }

  private linkAndUseProgram() {
    this.webgl.linkProgram(this.program);
    if (!this.webgl.getProgramParameter(this.program, LINK_STATUS)) {
      const infoLog = this.webgl.getProgramInfoLog(this.program);
      throw new Error(`unable to link program:\n${infoLog}`);
    }
    this.webgl.useProgram(this.program);
  }

  private attachShader({ name, type, source }: ShaderConfig) {
    const shader = this.webgl.createShader(type);
    if (!shader) {
      throw new Error(`unable to create shader ${name}`);
    }

    this.webgl.shaderSource(shader, source);
    this.webgl.compileShader(shader);
    if (!this.webgl.getShaderParameter(shader, COMPILE_STATUS)) {
      const infoLog = this.webgl.getShaderInfoLog(shader);
      throw new Error(`unable to compile shader ${name}:\n${infoLog}`);
    }
    this.webgl.attachShader(this.program, shader);
  }

  private createUniform({ name, type, value }: UniformConfig) {
    const uniform = this.webgl.getUniformLocation(this.program, name);
    if (!uniform) {
      throw new Error(`unable to get location of uniform ${name}`);
    }

    switch (type) {
      case FLOAT:
        this.webgl.uniform1f(uniform, value);
        break;
      case INT:
        this.webgl.uniform1i(uniform, value);
        break;
      default:
        throw new Error(
          `could not create uniform ${name}, unexpected type ${type}`
        );
    }
    this.uniforms[name] = uniform;
  }

  private createBuffer({ name, type, values }: BufferConfig) {
    const buffer = this.webgl.createBuffer();
    if (!buffer) {
      throw new Error(`unable to create buffer ${name}`);
    }

    this.webgl.bindBuffer(type, buffer);
    this.webgl.bufferData(type, values, STATIC_DRAW);

    if (type === ARRAY_BUFFER) {
      this.enableVertexAttribute(buffer);
    }
    this.buffers[name] = buffer;
  }

  private enableVertexAttribute(buffer: WebGLBuffer) {
    const position = this.webgl.getAttribLocation(this.program, 'a_position');
    this.webgl.bindBuffer(ARRAY_BUFFER, buffer);
    this.webgl.vertexAttribPointer(position, 2, FLOAT, false, 0, 0);
    this.webgl.enableVertexAttribArray(position);
  }

  private drawBuffer(
    { name, type, mode, values }: BufferConfig,
    index: number
  ) {
    const buffer = this.getBuffer(name);
    const bufferIndexUniform = this.getUniform('u_bufferIndex');

    this.webgl.uniform1i(bufferIndexUniform, index);
    this.webgl.bindBuffer(type, buffer);

    switch (type) {
      case ELEMENT_ARRAY_BUFFER:
        this.webgl.drawElements(mode, values.length, UNSIGNED_SHORT, 0);
        break;
      case ARRAY_BUFFER:
        this.webgl.drawArrays(mode, 0, values.length / 2);
        break;
      default:
        throw new Error(
          `could not draw buffer ${name}, unexpected type ${type}`
        );
    }
  }

  private getUniform(name: string) {
    const uniform = this.uniforms[name];
    if (!uniform) {
      throw new Error(`uniform ${name} not found`);
    }
    return uniform;
  }

  private getBuffer(name: string) {
    const buffer = this.buffers[name];
    if (!buffer) {
      throw new Error(`buffer ${name} not found`);
    }
    return buffer;
  }
}

export default Program;
