import {CONST} from "../constants";
import BaseScene from "./BaseScene";

export default class IntroductionScene extends BaseScene {
  constructor() {
    super({
      key: CONST.SCENES.INTRODUCTION
    });

    this.glassParticles = null;
    this.slimeSplatterParticles = null;
  }

  preload() {
    this.glassParticles = this.add.particles("glass");
    this.slimeSplatterParticles = this.add.particles("splat");
  }

  async create() {
    const beaker1= this.add.image(1200,750, "beaker", "beaker1.png");
    const beaker2 = this.add.image(575,630, "beaker", "beaker2.png");
    const beaker3 = this.add.image(290,645, "beaker", "beaker3.png");

    const introductionSound = this.game.sound.voice.add('intro');
    introductionSound.addMarker({name: "intro_start", start: 0, duration: 3});
    introductionSound.addMarker({name: "intro_beakers_exploded", start: 3, duration: 2});
    introductionSound.addMarker({name: "intro_slime_everywhere", start: 5, duration: 2.9});
    introductionSound.addMarker({name: "intro_slime_expanding", start: 7.9, duration: 5.3});
    introductionSound.addMarker({name: "intro_end", start: 13.2, duration: 2});


    await this.explodeBeaker(beaker1, 1200, 700);
    await this.explodeBeaker(beaker2, 575, 600);
    await this.explodeBeaker(beaker3, 290, 645);

    this.setOffAlarm();

    const introSoundTimedEvent = this.time.delayedCall(500, () => {
      this.play(introductionSound).finally(() => {
        this.scene.launch(CONST.SCENES.GAME);
      });

      introSoundTimedEvent.destroy();
    }, [], this);

    for(let i=0; i < 6; i++) {
      await this.addSlime();
    }

    await this.closeDoor("leftDoor1", 105, 480, [
      { key: "leftDoor1" },
      { key: "leftDoor2" },
      { key: "leftDoor3" },
      { key: "leftDoor4", duration: 50 },
    ]);

    await this.closeDoor("rightDoor1", 1278, 485, [
      { key: "rightDoor1" },
      { key: "rightDoor2" },
      { key: "rightDoor3" },
      { key: "rightDoor4", duration: 50 },
    ]);

  }

  async addSlime() {
    return new Promise((resolve, reject) => {
        let {slime, slimeQueue, slimeOnScreen} = this.getSlimeState();

        let slimeKey = slimeQueue.pop();
        slimeOnScreen.push(slimeKey);

        const slimeSprite =
          this.add.sprite(slime[slimeKey]["x"],
            slime[slimeKey]["y"],
            "slime", `${slimeKey}.png`);

        // slimeSprite.setScale(.6);
        slimeSprite.setAlpha(0);
        slimeSprite.setDepth(1);
        this.expandSlimeTween(slimeSprite).finally(() => {
          resolve(slimeSprite);
        });
        slime[slimeKey]["object"] = slimeSprite;

        this.setSlimeState({slime, slimeQueue, slimeOnScreen});
    });
  }

  expandSlimeTween(slimeSprite) {
    return new Promise((resolve, reject) => {
      this.tweens.add({
        targets: slimeSprite,
        loop: 0,
        duration: 1500,
        scaleX: {from: .5, to: 1 },
        scaleY: {from: .5, to: 1 },
        alpha: {from: 0, to: 1 },
        ease: "Linear",
        yoyo: false,
        onComplete: () => {
          resolve(true);
        }
      });
    });
  }

  setOffAlarm() {
    const alarm = this.add.image(1250, 190, "alarm").setDepth(2);
    this.tweens.add({
      targets: alarm,
      loop: 3,
      duration: 2000,
      scaleX: 2,
      scaleY: 2,
      alpha: { from: 0, to: 1 },
      ease: "Linear",
      yoyo: true
    });
  }

  async explodeBeaker(beaker, x, y) {
    return new Promise((resolve, reject) => {
      const glassShatterEmitter = this.createGlassShatterEmitter();
      const slimeSplatterEmitter = this.createSlimeSplatterEmitter();

      slimeSplatterEmitter.onParticleDeath((particle) => {
        resolve(true);
      });

      glassShatterEmitter.explode(15, x, y);
      slimeSplatterEmitter.explode(15, x, y);

      this.time.delayedCall(200, () => {
        beaker.destroy();
      }, [beaker], this);
    });
  }

  async closeDoor(initalImageKey, imageX, imageY, frames) {
    return new Promise((resolve, reject) => {
      const closeDoorAnimation = this.anims.create({
        key: "closeDoor",
        frames: frames,
        frameRate: 8,
        repeat: 0
      });

      const door = this.add.sprite(imageX, imageY, initalImageKey).play("closeDoor");
      door.once("animationcomplete", function(){
        closeDoorAnimation.destroy();
        resolve(true);
      }, this);
    });
  }

  createGlassShatterEmitter() {
    return this.glassParticles.createEmitter({
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
  }

  createSlimeSplatterEmitter() {
    return this.slimeSplatterParticles.createEmitter({
      frame: ["fx_splat1.png", "fx_splat2.png", "fx_splat3.png", "fx_splat4.png"],
      speed: {min: 100, max: 300},
      lifespan: 1000,
      blendMode: "ADD",
      frequency: 15,
      maxParticles: 15,
      scale: {start: .5, end: 0},
      alpha: {start:0, end: 1},
      rotate: {start:0, end: 90, random: true},
      on: false
    });
  }
}
