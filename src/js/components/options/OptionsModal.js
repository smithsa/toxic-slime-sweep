export default class OptionsModal extends HTMLElement{
  constructor() {
    super();

    this.CAPTIONS_KEY = "captionsOn";
    this.VOICE_SOUND_MANAGER_ID = "voice";
    this.MUSIC_SOUND_MANAGER_ID = "music";

    this._captionToggleHandler = this._captionToggleHandler.bind(this);
    this._voiceVolumeChangeHandler = this._voiceVolumeChangeHandler.bind(this);
    this._musicVolumeChangeHandler = this._musicVolumeChangeHandler.bind(this);
    this._closeClickHandler = this._closeClickHandler.bind(this);

    this.attachShadow({mode: "open"});

    this.shadowRoot.innerHTML = `
      <style>
        .sr-only {
          position:absolute;
          left:-10000px;
          top:auto;
          width:1px;
          height:1px;
          overflow:hidden;
         }

         .esg-modal {
            width: 600px;
            height: 500px;
            border-radius: 20px;
            padding: 60px;
            font-family: Arial, Helvetica, sans-serif;
            color: #fff;
            background-color: rgba(0, 0, 0, .95);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
         }

         .esg-modal h2 {
            font-size: 60px;
            margin: 0 0 30px 0;
            text-align: center;
            letter-spacing: 1px;
         }

         .esg-modal__item {
            margin-bottom: 30px;
         }

         .esg-modal__close {
            cursor:pointer;
            font-size: 32px;
            max-width: 50%;
            align-self: center;
            border-radius: 10px;
            padding: 10px 30px;
         }

         .esg-modal[aria-hidden="false"] {
            display: flex;
         }

         .esg-modal[aria-hidden="true"] {
            display: none;
         }
      </style>
      <div class="esg-modal" role="dialog"
        aria-hidden="true"
        aria-label="game options" aria-describedby="esg-modal__desc">
            <h2>Options</h2>
            <p id="esg-modal__desc" class="sr-only">Turn captioning on or off, or adjust the volume of music and voice.</p>
            <div class="esg-modal__items">
                <div class="esg-modal__item">
                  <esg-toggle id="captions-toggle" label="Captions"></esg-toggle>
                </div>
                <div class="esg-modal__item">
                  <esg-slider id="voice-slider" class="esg-modal__item" label="Voice"></esg-slider>
                </div>
                <div class="esg-modal__item">
                  <esg-slider id="music-slider" class="esg-modal__item" label="Music"></esg-slider>
                </div>
            </div>
            <button class="esg-modal__close" aria-label="close">Close</button>
      </div>
    `;

    this.captionsToggleElement = this.shadowRoot.getElementById("captions-toggle");
    this.voiceSliderElement = this.shadowRoot.getElementById("voice-slider");
    this.musicSliderElement = this.shadowRoot.getElementById("music-slider");
    this.modalElement = this.shadowRoot.querySelector(".esg-modal");
    this.closeButton = this.shadowRoot.querySelector(".esg-modal__close");
  }

  _captionToggleHandler(event) {
    if(event.detail.on === 'true') {
      window.esparkGame.registry.set(this.CAPTIONS_KEY, true);
    } else {
      window.esparkGame.registry.set(this.CAPTIONS_KEY, false);
    }
  }

  _changeSoundManagerVolume(event, soundManagerKey) {
    window.esparkGame.sound[soundManagerKey].volume = event.detail.value;
  }

  _voiceVolumeChangeHandler(event) {
    this._changeSoundManagerVolume(event, this.VOICE_SOUND_MANAGER_ID);
  }

  _musicVolumeChangeHandler(event) {
    this._changeSoundManagerVolume(event, this.MUSIC_SOUND_MANAGER_ID);
  }

  _closeClickHandler() {
    this.open = this._getOppositeValueOfValueAttr(this.open);
    this.modalElement.setAttribute("aria-hidden", this._getOppositeValueOfValueAttr(this.open));
  }

  _getOppositeValueOfValueAttr(isOpen) {
    return isOpen === 'true' ? 'false' : 'true';
  }

  connectedCallback() {
    this.captionsToggleElement.addEventListener("toggle", this._captionToggleHandler);
    this.voiceSliderElement.addEventListener("volumechange", this._voiceVolumeChangeHandler);
    this.musicSliderElement.addEventListener("volumechange", this._musicVolumeChangeHandler);
    this.closeButton.addEventListener("click", this._closeClickHandler);
    this.modalElement.setAttribute("aria-hidden",
      this._getOppositeValueOfValueAttr(this.open));
    this.voiceSliderElement.setAttribute("value", window.esparkGame.sound[this.VOICE_SOUND_MANAGER_ID].volume);
    this.musicSliderElement.setAttribute("value", window.esparkGame.sound[this.MUSIC_SOUND_MANAGER_ID].volume);
    this.captionsToggleElement.setAttribute("toggleon", window.esparkGame.registry.get(this.CAPTIONS_KEY));
  }

  disconnectedCallback() {
    this.captionsToggleElement.removeEventListener("toggle", this._captionToggleHandler);
    this.voiceSliderElement.removeEventListener("volumechange", this._voiceVolumeChangeHandler);
    this.musicSliderElement.removeEventListener("volumechange", this._musicVolumeChangeHandler);

  }

  static get observedAttributes() {
    return ["open"];
  }

  get open() {
    return this.getAttribute('open');
  }

  set open(isOpen) {
    this.setAttribute("open", isOpen);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch(name) {
      case "open":
        console.log(this._getOppositeValueOfValueAttr(newValue))
        this.modalElement.setAttribute("aria-hidden",
          this._getOppositeValueOfValueAttr(newValue));
        break;
      default:
        break;
    }
  }
}
