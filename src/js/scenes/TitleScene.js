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

  }

  create() {
    this.addGameBackground();
    this.addOptionsSettings();
    const gameTitle = this.addGameTitle();
    const playButton = this.addPlayButton();
    playButton.element.addEventListener("click", () => {
      const titleSound = this.game.sound.voice.add('title');
      this.play(titleSound).finally(() => {
        playButton.gameObject.alpha = 0;
        gameTitle.gameObject.alpha = 0;
        this.scene.launch(CONST.SCENES.INTRODUCTION);
      });
    }, {once: true});
  }

  addGameTitle () {
    const titleHtmlBuilder = new HTMLElementBuilder("img");
    titleHtmlBuilder.addAttributes({"src": "./img/title.png",
      "aria-label": `${CONST.CONTENT.TITLE}`,
      "width": "1000px",
    });

    const gameObject = this.add.dom(this.game.config.width/2, 100, titleHtmlBuilder.element).setOrigin(0.5);

    return {element: titleHtmlBuilder.element, gameObject};
  }

  addPlayButton() {
    const playButtonHtmlBuilder = new ButtonImage(CONST.CONTENT.PLAY_BUTTON_TEXT, "./img/btn_play.png", "play__btn");
    const gameObject = this.add.dom(this.game.config.width/2 - 130, this.game.config.height/2 + 50, playButtonHtmlBuilder.element);

    return {element: playButtonHtmlBuilder.element, gameObject};
  }
}
