//NOTE: still file still refrences to the old name which is tab-bar

// Create a class for the element
class NavigationRail extends HTMLElement {
    /** @description 
* The tabbar element allows you to navigate between pages or viewpager pages
*/

    /** @usage 
     * Navigating between pages
    */

    static observedAttributes = ["direction", 'index', 'for'];

    constructor() {
        // Always call super first in constructor
        super();

        this.index = this.getAttribute('index') || 1;
    }

    initElement(element) {
        let forAttr = this.getAttribute('for');

        this.style.gridTemplateColumns = `repeat(` + this.index + `, 1fr)`; // dynamically calculate size of each item and reuse index for size calculations

        element.setAttribute('index', this.index);

        if (!forAttr == '') {
            let forElement = document.getElementById(forAttr);
            let el = forElement.children[parseInt(element.getAttribute('index'))];

            if (el.checkVisibility({ opacityProperty: true, visibilityProperty: true, contentVisibilityAuto: true })) {
                element.classList.add('current');
            }
        }

        //automatically select href refrencing to page url.
        if (element.href == window.location.href) element.classList.add('current');

        element.addEventListener('click', function (e) {
            e.stopPropagation();
            e.preventDefault();

            if (!this.classList.contains('current')) {

                try {
                    this.parentNode.getElementsByClassName('current')[0].classList.remove('current');
                } catch (e) { }
                this.classList.add('current');
            }
        });

        this.index++ // increase to give everychild its own index integer for the pageChanged callback
    }

    appendChild(child) {
        super.appendChild(child);

        this.initElement(child);
    }

    connectedCallback() {
        let i;
        let forAttr = this.getAttribute('for');
        let keys = this.children;

        this.classList.add('tabBarHolder');

        if (this.getAttribute('direction') == 'vertical') this.classList.add('verticalTabbar');

        if (!forAttr == '') {
            addForConnection(this, forAttr);
        }

        for (i of keys) {
            this.initElement(i);
        }
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (this.getAttribute('direction') == 'vertical') this.classList.add('verticalTabbar');
        if (this.getAttribute('direction') != 'vertical') this.classList.remove('verticalTabbar');

        if (!this.getAttribute('for') == '') {
            addForConnection(this, this.getAttribute('for'));
        } else {
            removeForConnection(this, this.getAttribute('for'));
        }
    }
}

function addForConnection(e, e2) {
    let element = document.getElementById(e2);
    let i;

    //fires the pageChanged function on the connected for element, it executes what the developer put into the pageChanged function/callback.
    element.pageChanged(e.parentNode.getElementsByClassName('current')[0], this.getAttribute('index'));
}

function removeForConnection(e, e2) {
    let element = document.getElementById(e2);
    let i;

    for (i of e.children) {
        i.removeEventListener('click', function () { }, false);
    }
}

customElements.define("navigation-rail", NavigationRail);  