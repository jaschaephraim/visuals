import { SceneConfig } from '../types';
import birdsProgramConfig from './birds-program-config';
import landscapeProgramConfig from './landscape-program-config';

const config: SceneConfig = {
  programs: [landscapeProgramConfig, birdsProgramConfig],
};

export default config;
