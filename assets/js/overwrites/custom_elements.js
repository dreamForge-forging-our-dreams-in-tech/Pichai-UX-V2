//overwrites the customElements.define function so that we can attach a function to it for setting the css classes.

// Stash the original
const originalDefine = customElements.define;

function wrapClass(OriginalClass, name) {
    return class extends OriginalClass {
        connectedCallback() {
            // 1. You MUST call the original connectedCallback if it exists!
            if (super.connectedCallback) {
                super.connectedCallback();
            }

            // 2. Now add your custom logic (adding the class name)
            this.classList.add(name)
        }
    };
}

customElements.define = function (name, constructor, options) {
    // 1. Create a wrapper class that extends the passed 'constructor'
    // 2. In the connectedCallback of that wrapper, do: this.classList.add(...)
    // 3. Call originalDefine with the wrapper instead of the original constructor

    originalDefine.call(customElements, name, wrapClass(constructor, name), options);

};