import {CST} from "../constants";
import BaseScene from "./BaseScene";
import '../../scss/title.scss';
import AlignGrid from "../utils/AlignGrid";

export default class TitleScene extends BaseScene {
  constructor () {
    super({
      key: CST.SCENES.TITLE
    });
  }

  create () {
    const titleElement = this.add.dom(this.game.config.width/2, this.game.config.height/2 - 200,
      this.createHtmlElement("h1", CST.LANG.EN.TITLE));

    const playButtonElement = this.add.dom(this.game.config.width/2, this.game.config.height/2,
      this.createHtmlElement("button", CST.LANG.EN.PLAY));

  }
}
