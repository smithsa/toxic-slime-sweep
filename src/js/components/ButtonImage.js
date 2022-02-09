import HTMLElementBuilder from "../utils/HTMLElementBuilder";

export default class ButtonImage {
  constructor(ariaLabel, imageSrc, elementClass="") {
    this.ariaLabel = ariaLabel;
    this.imageSrc = imageSrc;
    this.elementClass = elementClass;
    this.builder = this._build();
    this.element = this.builder.element;
  }

  _build() {
    const buttonHtmlBuilder = new HTMLElementBuilder("button");
    buttonHtmlBuilder.addAttributes({
      "aria-label": this.ariaLabel
    }).appendElements(
      new HTMLElementBuilder("img")
        .addAttributes({
          "src": this.imageSrc,
          "class": this.elementClass
        }).element
    )

    return buttonHtmlBuilder;
  }
}
