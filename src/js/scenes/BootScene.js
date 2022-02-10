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

    this.load.path = './img/';
    this.load.image('background', 'bg.jpg');
    this.load.multiatlas("beaker", "beaker_atlas.json");
    this.load.multiatlas("glass", "glass_atlas.json");
  }

  create() {
    this.scene.start(CONST.SCENES.TITLE);
  }
}
