export default class HTMLElementBuilder {
  constructor(tagName, textContent = "") {
    this.element = document.createElement(tagName);
    this.element.textContent = textContent;

    return this;
  }

  addAriaAttributes(ariaAttributes = {}) {
    if(!ariaAttributes || ariaAttributes.constructor !== Object) {
      return new Error("Parameter for addAriaAttributes should be an object. Example: {aria-label: \"Play\"");
    }

    for (let ariaAttribute in ariaAttributes) {
      let ariaAttributeValue = ariaAttributes[ariaAttribute];
      this.element.setAttribute(ariaAttribute, ariaAttributeValue);
    }

    return this;
  }

  addClass (...classNames) {
    classNames.forEach((className) => {
      this.element.classList.add(className);
    });

    return this;
  }
}
