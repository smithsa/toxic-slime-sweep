import HTMLElementBuilder from '../../utils/HTMLElementBuilder';

export default class OptionsToggle extends HTMLElement{
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        button {
            cursor: pointer;
            font-size: 32px;
        }
        button .off{
            background: red;
        }
        button[aria-pressed="true"] .off {
            background: none;
        }
        button[aria-pressed="true"] .on{
            background: green;
        }
        :host {
            font-size: 32px;
        }
      </style>
      <div class="esg-toggle esg-component">
        <span class="es-label">${this.label}</span>
        <button type="button" role="switch" aria-label="${this.label}" id="${this.id}">
            <span class="esg-toggle-state on">On</span><span class="esg-toggle-state off">Off</span>
        </button>
      </div>
    `;

    this.shadowtoggleButton = this.shadowRoot.querySelector("button");
    this.shadowtoggleButtonLabel = this.shadowRoot.querySelector(".es-label");
    this.handleToggle = this.handleToggle.bind(this);

    this.toggleEvent = new CustomEvent("toggle", {
      detail: {
        on: this.toggleOn
      }
    });
  }

  handleToggle (event) {
    this.shadowtoggleButton.toggleAttribute("aria-pressed");
    this.toggleOn = this.toggleOn.toLowerCase() === 'true' ? false : true;
    this.toggleEvent.detail.on = this.toggleOn;
    this.dispatchEvent(this.toggleEvent);
  }

  connectedCallback() {
    this.shadowtoggleButton.addEventListener("click", this.handleToggle);
  }

  disconnectedCallback() {
    this.shadowtoggleButton.removeEventListener("click", this.handleToggle);
  }

  static get observedAttributes() {
    return ["id", "label", "toggleon"];
  }

  get id() {
    return this.getAttribute("id");
  }

  get label() {
    return this.getAttribute("label");
  }

  get toggleOn() {
    return this.getAttribute("toggleon");
  }

  set id(id) {
    this.setAttribute("id", id);
  }

  set label(label) {
    this.setAttribute("label", label);
  }

  set toggleOn(toggleOnVal) {
    this.setAttribute("toggleon", toggleOnVal);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch(name) {
      case "label":
        this.shadowtoggleButtonLabel.innerHTML = newValue;
        this.shadowtoggleButton.setAttribute("aria-label", newValue);
        break;
      case "id":
        this.shadowtoggleButton.id = newValue;
        break;
      case "toggleon":
        this.shadowtoggleButton.setAttribute("aria-pressed", newValue);
        break;
      default:
        break;
    }
  }
}
