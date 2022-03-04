import {CANVAS, Scale, Sound, Game} from 'phaser';
import SoundA11yPlugin from "phaser3-plugin-sound-a11y";
import slimeCoordinates from "../data/slime_coordinates.json";
import IntroductionScene from "./scenes/IntroductionScene";
import BootScene from './scenes/BootScene';
import TitleScene from './scenes/TitleScene';
import GameScene from "./scenes/GameScene";
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
  scene: [BootScene, TitleScene, IntroductionScene, GameScene],
  callbacks: {
    preBoot: function (game) {
      game.sound.voice = Sound.SoundManagerCreator.create(game),
      game.sound.sfx = Sound.SoundManagerCreator.create(game),
      game.sound.music = Sound.SoundManagerCreator.create(game)
    }
  },
  plugins: {
    scene: [
      { key: 'SoundA11yPlugin',
        plugin: SoundA11yPlugin,
        start: true,
        mapping: 'SoundA11yPlugin'
      }
    ]
  }
};

window.esparkGame = new Game(gameConfig);

window.esparkGame.registry.set({
  backgroundMusicOn: true,
  captionsOn: true,
  slime: slimeCoordinates,
  slimeQueue: Object.keys(slimeCoordinates).sort(() => {
    return 0.5 - Math.random()
  }),
  slimeOnScreen: []
});
