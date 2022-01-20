import {CST} from "../constants";
import BaseScene from "./BaseScene";

export default class BootScene extends BaseScene {
  constructor () {
    super({
      key: CST.SCENES.PRELOAD
    });
  }

  preload () {

  }

  create () {
    console.log("preload")
    this.scene.start(CST.SCENES.TITLE);
  }
}
