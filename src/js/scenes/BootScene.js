import {CONST} from "../constants";
import BaseScene from "./BaseScene";
import '../../scss/global.scss';

export default class BootScene extends BaseScene {
  constructor() {
    super({
      key: CONST.SCENES.BOOT
    });
  }

  preload() {
    this.load.audio('intro', './voice/intro.mp3');
    this.load.audio('title', './voice/title.mp3');
    this.load.audio('instructions', './voice/instructions.mp3');

    this.load.path = './img/';
    this.load.image('background', 'bg.jpg');
    this.load.image('alarm', "red_glow_fx.png");
    this.load.image('leftDoor1', "left-door-1.png");
    this.load.image('leftDoor2', "left-door-2.png");
    this.load.image('leftDoor3', "left-door-3.png");
    this.load.image('leftDoor4', "left-door-4.png");
    this.load.image('rightDoor1', "right-door-1.png");
    this.load.image('rightDoor2', "right-door-2.png");
    this.load.image('rightDoor3', "right-door-3.png");
    this.load.image('rightDoor4', "right-door-4.png");

    this.load.multiatlas("beaker", "beaker_atlas.json");
    this.load.multiatlas("glass", "glass_atlas.json");
    this.load.multiatlas("splat", "splat_atlas.json");
    this.load.multiatlas("floatingSlime", "slime_fx_atlas.json");
    this.load.multiatlas("slime", "./slime_atlas.json");
  }

  create() {
    this.scene.start(CONST.SCENES.TITLE);
  }
}
