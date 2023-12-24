import { SceneConfig } from '../types';
import getBirdsProgramConfig from './birds-program-config';
import getLandscapeProgramConfig from './landscape-program-config';

function getConfig(aspectRatio: number): SceneConfig {
  return {
    programs: [
      getLandscapeProgramConfig(aspectRatio),
      getBirdsProgramConfig(aspectRatio),
    ],
  };
}

export default getConfig;
