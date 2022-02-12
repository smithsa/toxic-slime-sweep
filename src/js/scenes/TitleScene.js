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

  async create() {
    this.addGameBackground();
    const gameTitle = this.addGameTitle();
    const playButton = this.addPlayButton();

    playButton.element.addEventListener("click", async () => {
      const titleSound = this.game.sound.voice.add('title');
        await this.play(titleSound);
        playButton.gameObject.alpha = 0;
        gameTitle.gameObject.alpha = 0;
        this.scene.launch(CONST.SCENES.INTRODUCTION);
    }, {once: true});

    this.addFloatingSlimeToSmallRectangularTank();
    this.addFloatingSlimeToLargeRectangularTank();
    this.addFloatingSlimeToCylindricalTank();

    this.addOptionsSettings();
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

  addFloatingSlimeToCylindricalTank() {
    const slimeDot = this.add.sprite(1533, 230, "floatingSlime","fx_slime1.png");
    const slimeDot2 = this.add.sprite(1533, 500, "floatingSlime","fx_slime3.png");
    const slimeDot3 = this.add.sprite(1550, 425, "floatingSlime","fx_slimeDot.png");
    const slimeDot4 = this.add.sprite(1550, 130, "floatingSlime","fx_slime2.png");
    slimeDot2.setScale(.8);
    slimeDot4.setScale(.7);
    slimeDot3.setScale(.6);

    this.createFloatSlimeTween(slimeDot, slimeDot.y + 3, 2800, 0.001);
    this.createFloatSlimeTween(slimeDot2, slimeDot2.y - 5, 3000, -0.001);
    this.createFloatSlimeTween(slimeDot3, slimeDot3.y + 6, 2500, 0.002);
    this.createFloatSlimeTween(slimeDot4, slimeDot4.y + 8, 2900, -0.001);
  }

  addFloatingSlimeToSmallRectangularTank(){
    const slimeDot = this.add.sprite(160, 220, "floatingSlime","fx_slimeDot.png");
    const slimeDot2 = this.add.sprite(140, 240, "floatingSlime","fx_slimeDot.png");
    const slimeDot3 = this.add.sprite(100, 220, "floatingSlime","fx_slime2.png");

    slimeDot.setScale(.6);
    slimeDot2.setScale(.6);
    slimeDot3.setScale(.5);

    this.createFloatSlimeTween(slimeDot, slimeDot.y + 3, 2800);
    this.createFloatSlimeTween(slimeDot2, slimeDot2.y - 3, 2300);
    this.createFloatSlimeTween(slimeDot3, slimeDot3.y + 4,2500, 0.001);
  }

  addFloatingSlimeToLargeRectangularTank(){
    const slimeDot = this.add.sprite(330, 200, "floatingSlime","fx_slimeDot.png");
    const slimeDot2 = this.add.sprite(360, 230, "floatingSlime","fx_slimeDot.png");
    const slimeDot3 = this.add.sprite(335, 360, "floatingSlime","fx_slime3.png");
    const slimeDot4 = this.add.sprite(355, 450, "floatingSlime","fx_slime1.png");
    const slimeDot5 = this.add.sprite(340, 290, "floatingSlime","fx_slime2.png");

    slimeDot.setScale(.7);
    slimeDot2.setScale(.4);
    slimeDot3.setScale(.6);
    slimeDot4.setScale(.7);
    slimeDot5.setScale(.6);

    this.createFloatSlimeTween(slimeDot, slimeDot.y + 5, 3000);
    this.createFloatSlimeTween(slimeDot2, slimeDot2.y - 5, 2100);
    this.createFloatSlimeTween(slimeDot3, slimeDot3.y + 6, 2900, -0.001);
    this.createFloatSlimeTween(slimeDot4, slimeDot4.y - 6, 2900, 0.001);
    this.createFloatSlimeTween(slimeDot5, slimeDot5.y - 6, 2900, 0.001);
  }

  createFloatSlimeTween(slimeObject, floatDelta, duration, rotationDelta=null) {
    return this.tweens.add({
      targets: slimeObject,
      y: floatDelta,
      loop: -1,
      duration: duration,
      ease: 'Sine.easeInOut',
      easeParams: [],
      yoyo: true,
      onUpdate: function(){
        if(rotationDelta != null) {
          slimeObject.setRotation(slimeObject.rotation += rotationDelta);
        }
      }
    })
  }
}
