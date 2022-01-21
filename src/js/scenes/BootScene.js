import {CONST} from "../constants";
import BaseScene from "./BaseScene";

export default class BootScene extends BaseScene {
  constructor () {
    super({
      key: CONST.SCENES.BOOT
    });
  }

  preload () {

  }

  create () {
    this.scene.start(CONST.SCENES.TITLE);
  }
}
