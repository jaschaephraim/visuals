import getProgramConfig, { Config } from './program-config';
import { SceneConfig } from '../types';

function getConfig(config: Config): SceneConfig {
  return {
    programs: [getProgramConfig(config)],
  };
}

export default getConfig;
