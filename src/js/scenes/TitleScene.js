import {CONST} from "../constants";
import HTMLElementBuilder from "../utils/HTMLElementBuilder";
import BaseScene from "./BaseScene";
import ButtonImage from "../components/ButtonImage";

export default class TitleScene extends BaseScene {
  constructor() {
    super({
      key: CONST.SCENES.TITLE
    });
  }

  preload() {
    this.load.audio('title', './voice/title.mp3');
  }

  create() {
    this.addGameBackground();

    this.addGameTitle();

    const playButton = this.addPlayButton();
    playButton.addEventListener("click", () => {
      const titleSound = this.game.sound.voice.add('title');
      this.play(titleSound).finally(() => {
        this.scene.start(CONST.SCENES.INTRODUCTION);
      });
    });

    this.addOptionsSettings();
  }

  addGameTitle () {
    const titleHtmlBuilder = new HTMLElementBuilder("img");
    titleHtmlBuilder.addAttributes({"src": "./img/title.png",
      "aria-label": `${CONST.CONTENT.TITLE}`,
      "width": "1000px",
    });

    this.add.dom(this.game.config.width/2, 100,
      titleHtmlBuilder.element).setOrigin(0.5);
  }

  addPlayButton() {
    const playButtonHtmlBuilder = new ButtonImage(CONST.CONTENT.PLAY_BUTTON_TEXT, "./img/btn_play.png", "play__btn");
    this.add.dom(this.game.config.width/2 - 130, this.game.config.height/2 + 50,
      playButtonHtmlBuilder.element);

    return playButtonHtmlBuilder.element;
  }
}
