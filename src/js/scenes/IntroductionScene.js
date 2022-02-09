import {CONST} from "../constants";
import BaseScene from "./BaseScene";

export default class IntroductionScene extends BaseScene {
  constructor() {
    super({
      key: CONST.SCENES.INTRODUCTION
    });

    this.particles = null;
  }

  preload() {
    this.load.audio('intro', './voice/intro.mp3');
    this.particles = this.add.particles("glass");
  }

  create() {
    this.addGameBackground();
    this.addOptionsSettings();

    const introductionSound = this.game.sound.voice.add('intro');

    this.add.image(1200,750, "beaker", "beaker1.png");
    this.add.image(575,630, "beaker", "beaker2.png");
    this.add.image(290,645, "beaker", "beaker3.png");

    introductionSound.addMarker({name: "intro_start", start: 0, duration: 3});
    introductionSound.addMarker({name: "intro_beakers_exploded", start: 3, duration: 2});
    introductionSound.addMarker({name: "intro_slime_everywhere", start: 5, duration: 2.9});
    introductionSound.addMarker({name: "intro_slime_expanding", start: 7.9, duration: 5.3});
    introductionSound.addMarker({name: "intro_end", start: 13.2, duration: 2});
    this.play(introductionSound).finally(() => {
      this.scene.start(CONST.SCENES.GAME);
    });

    this.particles.createEmitter({
      x: 575,
      y: 530,
      speed: {min: 250, max: 400},
      lifespan: 2500,
      blendMode: "ADD",
      frequency: 15,
      maxParticles: 10,
      scale: {start: 1, end: 0, random: true},
      alpha: {start:1, end: 0},
      rotate: {start:0, end: 180, random: true},
    });

    this.particles.setDepth(1);
  }
}
