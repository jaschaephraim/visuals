import getProgramConfig, { type Config } from './program-config';
import type { SceneConfig } from '../types';

function getConfig(config: Config): SceneConfig {
  return {
    programs: [getProgramConfig(config)],
  };
}

export default getConfig;
