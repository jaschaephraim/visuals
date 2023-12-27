import { SceneConfig } from '../types';
import getProgramConfig from './program-config';

function getConfig(aspectRatio: number): SceneConfig {
  return {
    programs: [getProgramConfig(aspectRatio)],
  };
}

export default getConfig;
