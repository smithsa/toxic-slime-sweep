import {Scene} from "phaser";
import HTMLElementBuilder from "../utils/HTMLElementBuilder";
import captions from '../../data/captions.json';

export default class BaseScene extends Scene {
  constructor(key) {
    super(key);

    this.captions = captions;
    this.activeCaptions = [];
    this.captionBottomOffset = 80;
  }

  play(soundObject, marker=null, config={}) {
    if(this.game.registry.get("captionsOn")) {
      this._playCaptionedSound(soundObject, marker, config);
    } else{
      this._playSound(soundObject, marker, config);
    }

    return soundObject;
  }

  _playSound(soundObject, marker, config) {
    soundObject.manager.stopAll();
    if (marker) {
      soundObject.play(marker, config);
      return;
    }

    soundObject.play(config);
  }

  _playCaptionedSound(soundObject, marker=null, config={}) {
    if(soundObject.markers === {} || marker != null) {
      this._startCaptionedAudio(soundObject, marker, config);
      return soundObject;
    }

    const markers = Object.keys(soundObject.markers);
    for(let i=0; i < markers.length-1; i++) {
      this._startCaptionedAudio(soundObject, markers[i], config).on("complete", () => {
        this._startCaptionedAudio(soundObject, markers[i+1], config);
      });
    }

    return soundObject;
  }

  _startCaptionedAudio(soundObject, marker=null, config={}) {
    this._removeCaptions();

    soundObject.on('play', (function() {
      const captionElement = this._addCaptions(marker || soundObject.key)
      this.activeCaptions.push(captionElement);
    }).bind(this));

    soundObject.on('complete', (function() {
      this._removeCaptions();
      soundObject.removeAllListeners();
    }).bind(this));

    this._playSound(soundObject, marker, config);

    return soundObject;
  }

  _removeCaptions() {
    this.activeCaptions.forEach((caption) => {
      caption.remove();
    });
  }

  _addCaptions (captionKey) {
    const captionHtmlElement = new HTMLElementBuilder("div");
    captionHtmlElement.addClasses("captions");

    if(captionKey in this.captions) {
      captionHtmlElement.appendElements(this._createCaptionCueElement(this.captions[captionKey]));
    } else {
      console.warn(`caption key: ${captionKey} was not found in captions`);
    }

    this.add.dom(this.game.config.width/2, this.game.config.height-this.captionBottomOffset,
      captionHtmlElement.element);

    return captionHtmlElement.element;
  }

  _createCaptionCueElement (cueText) {
    const captionCueElement = new HTMLElementBuilder("p", cueText);
    captionCueElement.addClasses("cue");

    return captionCueElement.element;
  }
}
