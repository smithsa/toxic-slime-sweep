import {CANVAS, Scale, Game} from 'phaser';
import BootScene from './scenes/BootScene';
import TitleScene from './scenes/TitleScene';
import {CONST} from "./constants";

const gameConfig = {
  type: CANVAS,
  gameTitle: CONST.CONTENT.TITLE,
  width: 1600,
  height: 900,
  backgroundColor: '#fff',
  parent: "game-container",
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

game.registry.set({
  backgroundMusicOn: true,
  captionsOn: true
});
