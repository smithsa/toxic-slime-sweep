import {CONST} from "../constants";
import HTMLElementBuilder from "../utils/HTMLElementBuilder";
import BaseScene from "./BaseScene";
import '../../scss/title.scss';

export default class TitleScene extends BaseScene {
  constructor () {
    super({
      key: CONST.SCENES.TITLE
    });
  }

  preload () {
    this.load.audio('test', './voice/Click a kid to ride the rainbow.m4a');
  }

  create () {

    const titleHtmlBuilder = new HTMLElementBuilder("h1", CONST.CONTENT.TITLE);
    this.add.dom(this.game.config.width/2, this.game.config.height/2 - 200,
      titleHtmlBuilder.element);

    const playButtonHtmlBuilder = new HTMLElementBuilder("button", CONST.CONTENT.PLAY_BUTTON_TEXT);
    playButtonHtmlBuilder.addAttributes({"aria-label": "play"});

    this.add.dom(this.game.config.width/2, this.game.config.height/2,
      playButtonHtmlBuilder.element);

    playButtonHtmlBuilder.element.addEventListener("click", () => {
      const music = this.sound.add('test');
      this.playCaptionedSound(music);
    });
  }
}
