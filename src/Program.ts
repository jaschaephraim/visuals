import { BufferConfig, ProgramConfig, ShaderConfig, UniformConfig } from './config';

class Program {
  private webgl: WebGL2RenderingContext;

  private config: ProgramConfig;

  private program: WebGLProgram;

  private aspectRatio: number;

  private uniforms: Record<string, WebGLUniformLocation> = {};

  private buffers: Record<string, WebGLBuffer> = {};

  constructor(webgl: WebGL2RenderingContext, config: ProgramConfig, aspectRatio: number) {
    this.webgl = webgl;
    this.config = config;
    this.aspectRatio = aspectRatio;

    const program = this.webgl.createProgram();
    if (!program) {
      throw new Error('unable to create program');
    }
    this.program = program;
    
    this.config.shaders.forEach((shaderConfig) => this.attachShader(shaderConfig));
    this.linkAndUseProgram();
    
    this.config.uniforms.forEach((uniformConfig) => this.createUniform(uniformConfig));
    this.config.buffers.forEach((bufferConfig) => this.createBuffer(bufferConfig));
  }

  public draw(t: number) {
    const timeUniform = this.getUniform('u_t');
    this.webgl.uniform1i(timeUniform, t);    
    this.webgl.clearColor(0.9803921569, 0.9215686275, 0.7843137255, 1);
    this.webgl.clear(this.webgl.COLOR_BUFFER_BIT);
    this.config.buffers.forEach((bufferConfig, i) => this.drawBuffer(bufferConfig, i));
  }

  private linkAndUseProgram() {
    this.webgl.linkProgram(this.program);
    if (!this.webgl.getProgramParameter(this.program, this.webgl.LINK_STATUS)) {
      throw new Error('unable to link program');
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
    if (!this.webgl.getShaderParameter(shader, this.webgl.COMPILE_STATUS)) {
      throw new Error(`unable to compile shader ${name}`);
    }
    this.webgl.attachShader(this.program, shader);
  }

  private createUniform({ name, type, value }: UniformConfig) {
    const uniform = this.webgl.getUniformLocation(this.program, name);
    if (!uniform) {
      throw new Error(`unable to get location of uniform ${name}`);
    }

    switch (type) {
      case WebGL2RenderingContext.FLOAT:
        this.webgl.uniform1f(uniform, value);
        break;
      case WebGL2RenderingContext.INT:
        this.webgl.uniform1i(uniform, value);
        break;
      default:
        throw new Error(`could not create uniform ${name}, unexpected type ${type}`);
    }
    this.uniforms[name] = uniform;
  }

  private createBuffer({ name, values }: BufferConfig) {
    const buffer = this.webgl.createBuffer();
    if (!buffer) {
      throw new Error(`unable to create buffer ${name}`);
    }

    this.webgl.bindBuffer(this.webgl.ELEMENT_ARRAY_BUFFER, buffer);
    this.webgl.bufferData(this.webgl.ELEMENT_ARRAY_BUFFER, values, this.webgl.STATIC_DRAW);
    this.buffers[name] = buffer;
  }

  private drawBuffer({ name, type, values }: BufferConfig, index: number) {
    const buffer = this.getBuffer(name);
    const bufferIndexUniform = this.getUniform('u_bufferIndex');

    this.webgl.uniform1i(bufferIndexUniform, index);
    this.webgl.bindBuffer(this.webgl.ELEMENT_ARRAY_BUFFER, buffer);
    this.webgl.drawElements(type, values.length, this.webgl.UNSIGNED_SHORT, 0);
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