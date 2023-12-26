export type ShaderConfig = { name: string; type: number; source: string };

type BaseUniformConfig = {
  name: string;
};

type NumberUniformConfig = BaseUniformConfig & {
  type: WebGL2RenderingContext['FLOAT'] | WebGL2RenderingContext['INT'];
  value: number;
};

type MatrixUniformConfig = BaseUniformConfig & {
  type: WebGL2RenderingContext['FLOAT_MAT4'];
  value: Float32Array;
};

export type UniformConfig = NumberUniformConfig | MatrixUniformConfig;

export type BufferConfig = {
  name: string;
  type: number;
  mode: number;
  values: Float32Array | Uint16Array;
};

export type ProgramConfig = {
  drawToFramebuffer: boolean;
  shaders: ShaderConfig[];
  uniforms: UniformConfig[];
  buffers: BufferConfig[];
};

export type SceneConfig = {
  programs: ProgramConfig[];
};
