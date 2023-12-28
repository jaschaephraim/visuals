import { SceneConfig } from '../types';
import getProgramConfig, { Config } from './program-config';

function getConfig(config: Config): SceneConfig {
  return {
    programs: [getProgramConfig(config)],
  };
}

export default getConfig;
