// Create a class for the element
class simpleButton extends HTMLElement {

    constructor() {
        // Always call super first in constructor
        super();
    }

    connectedCallback() {

    }
}

customElements.define("simple-button", simpleButton);