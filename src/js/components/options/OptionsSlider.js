import HTMLElementBuilder from '../../utils/HTMLElementBuilder';

export default class OptionsSlider extends HTMLElement{
  constructor(id, label) {
    super();
    this.id = id;
    this.label = label;

    this.label = new HTMLElementBuilder("label", this.label)
      .addAttributes({for: this.id})
      .element;

    this.slider = new HTMLElementBuilder("input")
      .addAttributes({type: "range", step:10, min:"0", max:"100", value:"100", id: this.id})
      .addClasses("slider")
      .element;

    this.element = new HTMLElementBuilder("div")
      .addClasses("esg-slider", "esg-element")
      .appendElements([this.label, this.slider])
      .element;
  }
}
