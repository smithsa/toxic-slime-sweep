import HTMLElementBuilder from '../../utils/HTMLElementBuilder';
import OptionsSlider from "./OptionsSlider";

export default class OptionsDialog extends HTMLElement{
  constructor() {
    super();

    this.CAPTIONS_KEY = "captionsOn";

    const header = new HTMLElementBuilder("h2", "Options");
    const captionsBuilder = new HTMLElementBuilder("captions-toggle")
      .addAttributes({ id: "captions-toggle",
                                label: "Captions",
                                toggleon: window.esparkGame.registry.get(this.CAPTIONS_KEY)});
    this.captionsElement = captionsBuilder.element;
    this.captionsElement.addEventListener("toggle", (e) => {
      if(e.detail.on) {
        window.esparkGame.registry.set(this.CAPTIONS_KEY, true);
      } else {
        window.esparkGame.registry.set(this.CAPTIONS_KEY, false);
      }
    });

    const voiceBuilder = new OptionsSlider("es-volume-voice", "Voice");
    const bgMusicSliderBuilder = new OptionsSlider("es-volume-music", "Music");

    this.dialog = new HTMLElementBuilder("div")
      .addClasses("esg-options-dialog", "esg-component")
      .appendElements([header.element, this.captionsElement, voiceBuilder.element, bgMusicSliderBuilder.element])
      .element

    return this.dialog;
  }


}
