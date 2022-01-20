import {CST} from "./constants";
import {Scene} from 'phaser';

export default class PreloaderScene extends Scene {
  constructor () {
    super({
      key: CST.SCENES.PRELOAD
    });
  }

  preload () {

  }

  create () {
    console.log("preload")
    this.scene.start(CST.SCENES.MENU);
  }
}
