export default class OptionsModal extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({mode: "open"});
    this.shadowRoot.innerHTML = `
      <style>
        button {
            font-size: 32px;
            cursor: pointer;
        }
      </style>
      <button aria-label="Game Options">
        <slot></slot>
      </button>
    `;

    this._handleOnClick = this._handleOnClick.bind(this);
    this.buttonElement = this.shadowRoot.querySelector('button');
    this.modal = null;
  }

  _handleOnClick () {
    if(this.modal == null) {
      console.warn("Unable to find specified options modal.");
      return;
    }
    this.modal.setAttribute("open", true);
  }

  connectedCallback() {
    this.modal = document.getElementById(this.modalId);
    this.buttonElement.addEventListener("click", this._handleOnClick);
  }

  disconnectedCallback() {
    this.buttonElement.removeEventListener("click", this._handleOnClick);
  }

  get modalId() {
    return this.getAttribute('modal-id');
  }

  set modalId(modalId) {
    this.setAttribute("modal-id", modalId);
  }

  static get observedAttributes() {
    return ["modal-id"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch(name) {
      case "modal-id":
        this.modal = document.getElementById(newValue);
        break;
      default:
        break;
    }
  }
}
