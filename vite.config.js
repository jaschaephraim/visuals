/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'vite';
import glsl from 'vite-plugin-glsl';
import tsconfigPaths from 'vite-tsconfig-paths';

/** @type {import('vite').UserConfig} */
export default defineConfig((config) => {
  const baseConfig = {
    plugins: [glsl(), tsconfigPaths()],
  };

  if (config.command !== 'build') {
    return baseConfig;
  }
  return {
    ...baseConfig,
    build: {
      lib: {
        name: 'visuals',
        entry: './src/main.ts',
        formats: ['es'],
      },
      rollupOptions: {
        external: ['gpu-io'],
      },
    },
  };
});
