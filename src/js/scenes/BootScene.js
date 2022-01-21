import {CONST} from "../constants";
import BaseScene from "./BaseScene";

export default class BootScene extends BaseScene {
  constructor () {
    super({
      key: CONST.SCENES.BOOT
    });
  }

  preload () {
    this.load.json('captions', './data/captions.json');
    this.load.json('questions', './data/questions.json');
  }

  create () {
    console.log(this.cache.json.get('captions'));
    this.scene.start(CONST.SCENES.TITLE);
  }
}
