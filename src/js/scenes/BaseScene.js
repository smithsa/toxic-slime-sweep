import {Scene} from "phaser";
import HTMLElementBuilder from "../utils/HTMLElementBuilder";
import captions from '../../data/captions.json';
import {CONST} from "../constants";

export default class BaseScene extends Scene {
  constructor(key) {
    super(key);

    this.captions = captions;
    this.activeCaptions = [];
    this.captionBottomOffset = 80;
  }

  addOptionsSettings() {
    const optionsModalBuilder = new HTMLElementBuilder("options-modal")
      .addAttributes({"open": false, "id": "options-modal", "color": `${CONST.OPTIONS.COLOR}`});

    this.add.dom(CONST.OPTIONS.MODAL_POS.x,
      CONST.OPTIONS.MODAL_POS.y,
      optionsModalBuilder.element);

    const optionsButtonBuilder = new HTMLElementBuilder("options-button")
      .addAttributes({"modal-id": "options-modal", color: `${CONST.OPTIONS.COLOR}`});
    this.add.dom(this.game.config.width - 100, 100, optionsButtonBuilder.element).setDepth(1000);
  }

  addGameBackground () {
    this.add.sprite(800, 450,'background').setOrigin(0.5).setScale(1.05,1);
  }

  play(soundObject, marker=null, config={}) {
    return new Promise(function(resolve, reject) {
      try {
        if(this.game.registry.get("captionsOn")) {
          this._playCaptionedSound(soundObject, marker, config).then(() => {
            resolve(soundObject);
          });
        } else{
          this._playSound(soundObject, marker, config).then(() => {
            resolve(soundObject);
          });
        }
      } catch (e) {
        reject("An error occurred playing sound:", `${e}`);
      }
    }.bind(this));
  }

  _playSound(soundObject, marker, config) {
    soundObject.manager.stopAll();
    return new Promise(function(resolve, reject) {
      try {
        let sound;
        if (marker) {
          const sound = soundObject.play(marker, config);
          sound.on("complete", () => resolve(sound));
        }

        sound = soundObject.play(config);
        sound.on("complete", () => resolve(sound));
      } catch (e) {
        reject("An error occurred in _playSound:", `${e}`);
      }
    });
  }

  _playCaptionedSound(soundObject, marker=null, config={}) {
    return new Promise(function (resolve, reject) {
      try {
        const markers = Object.keys(soundObject.markers);
        if(markers.length === 0) {
          this._startCaptionedAudio(soundObject, marker, config);

          soundObject.on('complete', (function() {
            this._removeCaptions();
            soundObject.removeAllListeners();
            resolve(soundObject);
          }).bind(this));

          return soundObject;
        }

        // setting up the generator to play subsequent markers after the
        // sound object has completed playing.
        const soundMarkerGenerator = this._SoundMarkerIterator(markers);
        soundObject.on("complete", () => {
          const currentMarker = soundMarkerGenerator.next();
          if (currentMarker.done) {
            this._removeCaptions();
            soundObject.removeAllListeners();
            resolve(soundObject);
          } else {
            this._startCaptionedAudio(soundObject, currentMarker.value, config);
          }
        });

        this._startCaptionedAudio(soundObject, markers[0], config);
      } catch(e) {
        reject("An error occurred in _playSound:", `${e}`);
      }
    }.bind(this));
  }

  _startCaptionedAudio(soundObject, marker=null, config={}) {
    this._removeCaptions();

    soundObject.on('play', (function() {
      const captionElement = this._addCaptions(marker || soundObject.key)
      this.activeCaptions.push(captionElement);
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
    this._removeCaptions();
    const captionHtmlElement = new HTMLElementBuilder("div");
    captionHtmlElement.addClasses("captions");
    if(captionKey in this.captions) {
      captionHtmlElement.appendElements(this._createCaptionCueElement(this.captions[captionKey]));
    } else {
      console.warn(`caption key: ${captionKey} was not found in captions`);
    }

    this.add.dom(this.game.config.width/2, this.game.config.height-this.captionBottomOffset,
      captionHtmlElement.element).setOrigin(.5, 1);

    return captionHtmlElement.element;
  }

  _createCaptionCueElement (cueText) {
    const captionCueElement = new HTMLElementBuilder("p", cueText);
    captionCueElement.addClasses("cue");

    return captionCueElement.element;
  }

  * _SoundMarkerIterator(markers) {
    for(let i=1; i < markers.length; i++) {
      yield markers[i];
    }

    return;
  }

  randomArrSort () {
    return 0.5 - Math.random();
  }
}
