import {AUTO, Scale, Game} from 'phaser';
import PreloaderScene from './preload';
import MenuScene from './menu';
import {CST} from "./constants";

const gameConfig = {
  gameTitle: CST.TITLE,
  type: AUTO,
  width: 1024,
  height: 610,
  backgroundColor: '#fff',
  parent: CST.SCENES.MENU,
  dom: {
    createContainer: true
  },
  scale: {
    mode: Scale.FIT,
    autoCenter: Scale.CENTER_BOTH
  },
  scene: [PreloaderScene, MenuScene]
};

const game = new Game(gameConfig);
