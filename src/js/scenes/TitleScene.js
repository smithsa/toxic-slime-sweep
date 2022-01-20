import {CST} from "../constants";
import {Scene} from "phaser";
import '../../scss/title.scss';
import HTMLElementBuilder from "../utils/HTMLElementBuilder";

export default class TitleScene extends Scene {
  constructor () {
    super({
      key: CST.SCENES.TITLE
    });
  }

  create () {
    const titleHtmlBuilder = new HTMLElementBuilder("h1", CST.CONTENT.TITLE);
    this.add.dom(this.game.config.width/2, this.game.config.height/2 - 200,
      titleHtmlBuilder.element);

    const playButtonHtmlBuilder = new HTMLElementBuilder("button", CST.CONTENT.PLAY_BUTTON_TEXT);
    playButtonHtmlBuilder.addAriaAttributes({"aria-label": "play"});

    this.add.dom(this.game.config.width/2, this.game.config.height/2,
      playButtonHtmlBuilder.element);
  }
}
