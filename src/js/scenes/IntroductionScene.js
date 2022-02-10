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
    this.particles = this.add.particles("glass");
    // this.particles = this.add.particles("slimeSplatter");
    this.load.audio('title', './voice/title.mp3');
  }

  create() {
    const introductionSound = this.game.sound.voice.add('intro');

    const beaker1= this.add.image(1200,750, "beaker", "beaker1.png");
    const beaker2 = this.add.image(575,630, "beaker", "beaker2.png");
    const beaker3 = this.add.image(290,645, "beaker", "beaker3.png");

    introductionSound.addMarker({name: "intro_start", start: 0, duration: 3});
    introductionSound.addMarker({name: "intro_beakers_exploded", start: 3, duration: 2});
    introductionSound.addMarker({name: "intro_slime_everywhere", start: 5, duration: 2.9});
    introductionSound.addMarker({name: "intro_slime_expanding", start: 7.9, duration: 5.3});
    introductionSound.addMarker({name: "intro_end", start: 13.2, duration: 2});
    this.play(introductionSound).finally(() => {
      this.scene.start(CONST.SCENES.GAME);
    });

    // TODO get rid of beaker
    // TODO fire at one at a time sequentially
    // TODO after glass shatters, the slime shatters do it right before the glass, splat like the glass
    // TODO a quarter of a second have the slime fade in, all at the same time then if time one at a time

    // TODO use timedEvent
    // timedEvent = this.time.delayedCall(3000, onEvent, [], this);
    // slime
    // doors are a frame animation
    // 1. warning lights go off (warning on board)
    // 2. doors close (10 frame per second)
    // 3. splat happens


    const glassShatterEmitter = this.particles.createEmitter({
      frame: ["fx_glass1.png", "fx_glass2.png", "fx_glass3.png"],
      speed: {min: 100, max: 300},
      lifespan: 500,
      blendMode: "ADD",
      frequency: 15,
      maxParticles: 10,
      scale: {start: 1, end: 0, random: true},
      alpha: {start:1, end: 0},
      rotate: {start:0, end: 180, random: true},
      on: false
    });

    glassShatterEmitter.explode(15, 575, 530);
    setTimeout(() => {
      beaker2.destroy(); }, 100)
    this.particles.setDepth(1);
  }
}
