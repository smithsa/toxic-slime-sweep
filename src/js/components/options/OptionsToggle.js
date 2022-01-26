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
        button[aria-pressed] .off {
            background: none;
        }
        button[aria-pressed] .on{
            background: green;
        }
        :host {
            font-size: 32px;
        }
      </style>
      <div class="esg-toggle esg-component">
        <span class="es-label">${this.getAttribute("label")}</span>
        <button type="button" role="switch" aria-label="${this.getAttribute("label")}" id="${this.getAttribute("id")}">
            <span class="esg-toggle-state on">On</span><span class="esg-toggle-state off">Off</span>
        </button>
      </div>
    `;

    this.shadowtoggleButton = this.shadowRoot.querySelector("button");
    this.shadowtoggleButtonLabel = this.shadowRoot.querySelector(".es-label");

    this.handleToggle = this.handleToggle.bind(this);
    this.toggleEvent = new CustomEvent("toggle", {
      detail: {
        on: false
      }
    });
  }

  handleToggle (event) {
    this.shadowtoggleButton.toggleAttribute("aria-pressed");
    const toggleButtonPressed = this.shadowtoggleButton.hasAttribute("aria-pressed");
    this.toggleEvent.detail.on = toggleButtonPressed
    this.dispatchEvent(this.toggleEvent);
  }

  connectedCallback() {
    this.shadowtoggleButton.addEventListener("click", this.handleToggle);
  }

  disconnectedCallback() {
    this.shadowtoggleButton.removeEventListener("click", this.handleToggle);
  }

  static get observedAttributes() {
    return ["id", "label"];
  }

  get id() {
    return this.getAttribute("id");
  }

  get label() {
    return this.getAttribute("label");
  }

  set id(id) {
    this.setAttribute("id", id);
  }

  set label(label) {
    this.setAttribute("label", label);
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
      default:
        break;
    }
  }
}
