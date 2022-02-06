import {CONST} from "../constants";
import BaseScene from "./BaseScene";

export default class IntroductionScene extends BaseScene {
  constructor () {
    super({
      key: CONST.SCENES.INTRODUCTION
    });
  }

  preload () {

  }

  create () {
    this.addGameBackground();
    this.addOptionsSettings();
  }
}
