import {CONST} from "../constants";
import BaseScene from "./BaseScene";

export default class IntroductionScene extends BaseScene {
  constructor() {
    super({
      key: CONST.SCENES.INTRODUCTION
    });
  }

  preload() {
    this.load.audio('intro', './voice/intro.mp3');
  }

  create() {
    this.addGameBackground();
    this.addOptionsSettings();
    this.fadeInScene();
    const introductionSound = this.game.sound.voice.add('intro');
    introductionSound.addMarker({name: "intro_start", start: 0, duration: 3});
    introductionSound.addMarker({name: "intro_beakers_exploded", start: 3, duration: 2});
    introductionSound.addMarker({name: "intro_slime_everywhere", start: 5, duration: 2.9});
    introductionSound.addMarker({name: "intro_slime_expanding", start: 7.9, duration: 5.3});
    introductionSound.addMarker({name: "intro_end", start: 13.2, duration: 2});
    this.play(introductionSound);
  }
}
