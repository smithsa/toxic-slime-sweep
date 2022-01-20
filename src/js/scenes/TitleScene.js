import {CST} from "../constants";
import BaseScene from "./BaseScene";
import '../../scss/title.scss';

export default class TitleScene extends BaseScene {
  constructor () {
    super({
      key: CST.SCENES.TITLE
    });
  }

  create () {
    const titleElement = this.createHtmlElement("h1", CST.LANG.EN.TITLE);
    this.add.dom(this.game.config.width/2, this.game.config.height/2 - 200, titleElement);

    const playButtonElement = this.createHtmlElement("button", CST.LANG.EN.PLAY);
    this.add.dom(this.game.config.width/2, this.game.config.height/2, playButtonElement);
  }
}
