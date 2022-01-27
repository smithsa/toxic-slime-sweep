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
    playButtonHtmlBuilder.addAttributes({"aria-label": "play"});

    this.add.dom(this.game.config.width/2, this.game.config.height/2,
      playButtonHtmlBuilder.element);

    const optionsDialogBuilder = new HTMLElementBuilder("options-modal")
      .addAttributes({open: true});

    this.add.dom(this.game.config.width/2, this.game.config.height/2 - 50, optionsDialogBuilder.element);

    playButtonHtmlBuilder.element.addEventListener("click", () => {
      // const music = this.game.sound.voice.add('test');
      const music2 = this.game.sound.voice.add('test2');
      music2.addMarker({name:"rideTheRainbow", start: 1, duration: 2});
      music2.addMarker({name:"clickakid", start: 0, duration: 1});
      this.play(music2);
    });
  }
}
