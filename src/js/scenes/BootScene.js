import {CST} from "../constants";
import {Scene} from 'phaser';

export default class BootScene extends Scene {
  constructor () {
    super({
      key: CST.SCENES.BOOT
    });
  }

  preload () {

  }

  create () {
    this.scene.start(CST.SCENES.TITLE);
  }
}
