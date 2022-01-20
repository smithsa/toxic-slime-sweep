import {CST} from "../constants";
import BaseScene from "./BaseScene";
import '../../scss/title.scss';
import HTMLElementBuilder from "../utils/HTMLElementBuilder";

export default class TitleScene extends BaseScene {
  constructor () {
    super({
      key: CST.SCENES.TITLE
    });
  }

  create () {
    const titleHtmlBuilder = new HTMLElementBuilder("h1", CST.LANG.EN.TITLE);
    this.add.dom(this.game.config.width/2, this.game.config.height/2 - 200,
      titleHtmlBuilder.element);

    let playButtonHtmlBuilder = new HTMLElementBuilder("button", CST.LANG.EN.PLAY);
    playButtonHtmlBuilder.addAriaAttributes({"aria-label": "Play"});

    this.add.dom(this.game.config.width/2, this.game.config.height/2,
      playButtonHtmlBuilder.element);

  }
}
