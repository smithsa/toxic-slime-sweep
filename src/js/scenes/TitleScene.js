import {CONST} from "../constants";
import HTMLElementBuilder from "../utils/HTMLElementBuilder";
import BaseScene from "./BaseScene";

export default class TitleScene extends BaseScene {
  constructor () {
    super({
      key: CONST.SCENES.TITLE
    });
  }

  preload () {
    this.load.audio('test', './voice/Click a kid to ride the rainbow.m4a');
    this.load.audio('test2', './voice/Click a kid to ride the rainbow.m4a');
  }

  create () {
    const titleHtmlBuilder = new HTMLElementBuilder("h1", CONST.CONTENT.TITLE);
    this.add.dom(this.game.config.width/2, this.game.config.height/2 - 200,
      titleHtmlBuilder.element);

    const playButtonHtmlBuilder = new HTMLElementBuilder("button", CONST.CONTENT.PLAY_BUTTON_TEXT);
    playButtonHtmlBuilder.addAttributes({"aria-label": "play", "style": "z-index: 100; position: relative"});

    this.add.dom(this.game.config.width/2, this.game.config.height/2,
      playButtonHtmlBuilder.element);

    const optionsModalBuilder = new HTMLElementBuilder("options-modal")
      .addAttributes({"open": false, "id": "options-modal","style": "pointer-events: none"});
    this.add.dom(CONST.OPTIONS_MODAL_POS.x,
      CONST.OPTIONS_MODAL_POS.y,
      optionsModalBuilder.element);

    const optionsButtonBuilder = new HTMLElementBuilder("options-button", "Options")
      .addAttributes({"modal-id": "options-modal"});
    this.add.dom(200, 200, optionsButtonBuilder.element);

    playButtonHtmlBuilder.element.addEventListener("click", () => {
      // const music = this.game.sound.voice.add('test');
      const music2 = this.game.sound.voice.add('test2');
      music2.addMarker({name:"rideTheRainbow", start: 1, duration: 2});
      music2.addMarker({name:"clickakid", start: 0, duration: 1});
      this.play(music2);
    });
  }
}
