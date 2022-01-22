import {Scene} from "phaser";
import HTMLElementBuilder from "../utils/HTMLElementBuilder";
import captions from '../../data/captions.json';

export default class BaseScene extends Scene {
  constructor(key) {
    super(key);

    this.captions = captions;
    this.activeCaptions = [];
  }

  play(soundObject, marker=null, config={}) {
    if(this.game.registry.get("captionsOn")) {
      this.playCaptionedSound(soundObject, marker, config);
    } else{
      this.playSound(soundObject, marker, config);
    }

    return soundObject;
  }

  playSound(soundObject, marker, config) {
    this.game.sound.stopAll();
    if (marker) {
      soundObject.play(marker, config);
    } else {
      soundObject.play(config);
    }
  }

  playCaptionedSound(soundObject, marker=null, config={}) {
    if(soundObject.markers === {} || marker != null) {
      this.startCaptionedAudio(soundObject, marker, config);
      return soundObject;
    }

    const markers = Object.keys(soundObject.markers);
    for(let i=0; i < markers.length-1; i++) {
      this.startCaptionedAudio(soundObject, markers[i], config).on("complete", () => {
        this.startCaptionedAudio(soundObject, markers[i+1], config);
      });
    }

    return soundObject;
  }

  startCaptionedAudio(soundObject, marker=null, config={}) {
    this.removeCaptions();

    soundObject.on('play', (function() {
      const captionElement = this.addCaptions(marker || soundObject.key)
      this.activeCaptions.push(captionElement);
    }).bind(this));

    soundObject.on('complete', (function() {
      this.removeCaptions();
      soundObject.removeAllListeners();
    }).bind(this));

    this.playSound(soundObject, marker, config);

    return soundObject;
  }

  removeCaptions() {
    this.activeCaptions.forEach((caption) => {
      caption.remove();
    });
  }

  addCaptions (captionKey) {
    const captionHtmlElement = new HTMLElementBuilder("div");
    captionHtmlElement.addClasses("captions");

    if(captionKey in this.captions) {
      captionHtmlElement.appendElements(this.createCaptionCueElement(this.captions[captionKey]));
    } else {
      console.warn(`caption key: ${captionKey} was not found in captions`);
    }

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
