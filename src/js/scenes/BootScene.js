import {CONST} from "../constants";
import BaseScene from "./BaseScene";
import '../../scss/global.scss';

export default class BootScene extends BaseScene {
  constructor () {
    super({
      key: CONST.SCENES.BOOT
    });
  }

  preload () {
    this.load.path = './img/';
    this.load.image('background', 'bg.jpg');
  }

  create () {
    this.scene.start(CONST.SCENES.TITLE);
  }
}
