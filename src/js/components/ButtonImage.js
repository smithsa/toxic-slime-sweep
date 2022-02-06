import HTMLElementBuilder from "../utils/HTMLElementBuilder";

export default class ButtonImage {
  constructor(ariaLabel, imageSrc) {
    this.ariaLabel = ariaLabel;
    this.imageSrc = imageSrc;
    this.builder = this._build(this.ariaLabel, this.imageSrc);
    this.element = this.builder.element;
  }

  _build(ariaLabel, imgSrc) {
    const buttonHtmlBuilder = new HTMLElementBuilder("button");
    buttonHtmlBuilder.addAttributes({
      "aria-label": ariaLabel
    }).appendElements(
      new HTMLElementBuilder("img")
        .addAttributes({
          "src": imgSrc,
        }).element
    )

    return buttonHtmlBuilder;
  }
}
