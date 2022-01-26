import {CANVAS, Scale, Sound, Game} from 'phaser';
import BootScene from './scenes/BootScene';
import TitleScene from './scenes/TitleScene';
import {CONST} from "./constants";
import './components/register';

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
  scene: [BootScene, TitleScene],
  callbacks: {
    preBoot: function (game) {
      game.sound.voice = Sound.SoundManagerCreator.create(game),
      game.sound.sfx = Sound.SoundManagerCreator.create(game),
      game.sound.music = Sound.SoundManagerCreator.create(game)
    }
  }
};

window.esparkGame = new Game(gameConfig);

window.esparkGame.registry.set({
  backgroundMusicOn: true,
  captionsOn: false
});
