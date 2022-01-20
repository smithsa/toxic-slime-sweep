import {Scene} from 'phaser';
import {CST} from "./constants";

export default class MenuScene extends Scene {
  constructor () {
    super({
      key: CST.SCENES.MENU
    });
  }

  preload () {

  }

  create () {
    // add html5 title for for menu
    this.add.dom(this.game.config.width/2, this.game.config.height/2).createElement("h1", {},CST.TITLE).setOrigin(0.5);
  }
}
