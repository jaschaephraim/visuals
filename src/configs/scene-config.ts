import { SceneConfig } from '../types';
import getBirdsProgramConfig from './birds-program-config';
import getLandscapeProgramConfig from './landscape-program-config';
import getDrawTextureProgramConfig from './draw-texture-program-config';

function getConfig(aspectRatio: number): SceneConfig {
  return {
    programs: [
      getLandscapeProgramConfig(aspectRatio),
      getBirdsProgramConfig(aspectRatio),
      getDrawTextureProgramConfig(aspectRatio),
    ],
  };
}

export default getConfig;
