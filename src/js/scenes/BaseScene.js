import {Scene} from "phaser";
import HTMLElementBuilder from "../utils/HTMLElementBuilder";

export default class BaseScene extends Scene {
  constructor(key) {
    super(key);

    this.captionElement = null;
  }

  playCaptionedSound(soundObject, marker=null, config={}) {
    soundObject.once('play', (function() {
      this.captionElement = this.addCaptionToScene();
    }).bind(this));

    soundObject.once('complete', (function() {
      this.captionElement.remove();
    }).bind(this));

    if (marker) {
      soundObject.play(marker, config);
    } else {
      soundObject.play(config);
    }
  }

  addCaptionToScene () {
    const captionHtmlElement = new HTMLElementBuilder("div");
    captionHtmlElement.addClasses("captions");

    captionHtmlElement.appendElements([
      this.createCaptionCueElement("Click a kid"),
      this.createCaptionCueElement("to ride the rainbow")
    ]);

    this.add.dom(this.game.config.width/2, this.game.config.height-80,
      captionHtmlElement.element);

    return captionHtmlElement.element;
  }

  createCaptionCueElement (cueText) {
    const captionCueElement = new HTMLElementBuilder("p", cueText);
    captionCueElement.addClasses("cue");

    return captionCueElement.element;
  }
}
