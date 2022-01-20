import {AUTO, Scale, Game} from 'phaser';
import BootScene from './scenes/BootScene';
import TitleScene from './scenes/TitleScene';
import {CST} from "./constants";

const gameConfig = {
  type: AUTO,
  gameTitle: CST.LANG.EN.TITLE,
  width: 1600,
  height: 900,
  backgroundColor: '#fff',
  parent: CST.SCENES.TITLE,
  dom: {
    createContainer: true
  },
  scale: {
    mode: Scale.FIT,
    autoCenter: Scale.CENTER_BOTH
  },
  scene: [BootScene, TitleScene]
};

const game = new Game(gameConfig);
