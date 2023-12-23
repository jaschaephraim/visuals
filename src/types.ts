export type ShaderConfig = { name: string; type: number; source: string };

export type UniformConfig = { name: string; type: number; value: number };

export type BufferConfig = {
  name: string;
  type: number;
  mode: number;
  values: Float32Array | Uint16Array;
};

export type ProgramConfig = {
  shaders: ShaderConfig[];
  uniforms: UniformConfig[];
  buffers: BufferConfig[];
};

export type SceneConfig = {
  programs: ProgramConfig[];
};
