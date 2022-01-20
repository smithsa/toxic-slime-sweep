import {Scene} from 'phaser';

export default class BaseScene extends Scene {
  createHtmlElement (tagName, textContent, classList=[], ariaAttributes=null) {
    const element = document.createElement(tagName);
    element.textContent = textContent;

    classList.forEach((classListItem) => {
      element.classList.add(classListItem);
    });

    if(ariaAttributes && ariaAttributes.constructor === Object) {
      for (let ariaAttribute in ariaAttributes) {
        let ariaAttributeValue = ariaAttributes[ariaAttribute];
        element.setAttribute(ariaAttribute, ariaAttributeValue);
      }
    }

    return element;
  }
}
